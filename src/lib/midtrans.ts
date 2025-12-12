// src/lib/midtrans.ts
import Midtrans from "midtrans-client";

/**
 * Midtrans Configuration
 * Add these to your .env file:
 * MIDTRANS_SERVER_KEY=your-server-key
 * MIDTRANS_CLIENT_KEY=your-client-key
 * MIDTRANS_IS_PRODUCTION=false
 */

export const getMidtransConfig = () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not configured");
  }

  return {
    serverKey,
    isProduction,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  };
};

/**
 * Create Midtrans Snap instance
 */
export const createSnapClient = () => {
  const config = getMidtransConfig();

  return new Midtrans.Snap({
    isProduction: config.isProduction,
    serverKey: config.serverKey,
    clientKey: config.clientKey,
  });
};

/**
 * Create Midtrans Core API instance (for checking transaction status)
 */
export const createCoreApiClient = () => {
  const config = getMidtransConfig();

  return new Midtrans.CoreApi({
    isProduction: config.isProduction,
    serverKey: config.serverKey,
    clientKey: config.clientKey,
  });
};
