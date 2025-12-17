export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID as
  | string
  | undefined;

export type FacebookEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration";

export const pageView = (): void => {
  if (!window.fbq) return;
  window.fbq("track", "PageView");
};

export const track = (
  event: FacebookEvent,
  params: Record<string, unknown> = {}
): void => {
  if (!window.fbq) return;
  window.fbq("track", event, params);
};
