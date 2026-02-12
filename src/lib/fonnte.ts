/**
 * Utility to send messages via Fonnte API
 * Documentation: https://docs.fonnte.com/
 */

export interface FonnteResponse {
  status: boolean;
  reason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
}

/**
 * Send a WhatsApp message using Fonnte
 * @param target - Phone number or array of phone numbers (e.g., "6281...", ["6281...", "6282..."])
 * @param message - Message content
 * @returns Promise with Fonnte response
 */
export async function sendFonnteMessage(
  target: string | string[],
  message: string,
): Promise<FonnteResponse> {
  const token = process.env.FONNTE_TOKEN;

  const targetString = Array.isArray(target) ? target.join(",") : target;

  if (!token) {
    console.error("FONNTE_TOKEN is not defined in environment variables");
    return { status: false, reason: "FONNTE_TOKEN_MISSING" };
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: targetString,
        message: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Fonnte API Error:", result);
      return {
        status: false,
        reason: result.reason || "FONNTE_API_ERROR",
        detail: result,
      };
    }

    return result;
  } catch (error) {
    console.error("Failed to send message via Fonnte:", error);
    return {
      status: false,
      reason: "FETCH_ERROR",
      detail: error,
    };
  }
}
