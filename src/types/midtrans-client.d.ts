// Type definitions for midtrans-client
declare module "midtrans-client" {
  interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface ItemDetails {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface Callbacks {
    finish?: string;
    error?: string;
    pending?: string;
  }

  interface SnapTransaction {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetails[];
    callbacks?: Callbacks;
    custom_field1?: string;
    custom_field2?: string;
    custom_field3?: string;
    free_text?: {
      inquiry?: Array<{ en?: string; id?: string }>;
      footer?: Array<{ en?: string; id?: string }>;
    };
  }

  interface SnapResponse {
    token: string;
    redirect_url: string;
  }

  interface TransactionStatusResponse {
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
    status_code: string;
    signature_key: string;
  }

  class Snap {
    constructor(config: MidtransConfig);
    createTransaction(parameter: SnapTransaction): Promise<SnapResponse>;
    createTransactionToken(parameter: SnapTransaction): Promise<string>;
    createTransactionRedirectUrl(parameter: SnapTransaction): Promise<string>;
  }

  class CoreApi {
    constructor(config: MidtransConfig);
    transaction: {
      status(orderId: string): Promise<TransactionStatusResponse>;
      statusb2b(orderId: string): Promise<TransactionStatusResponse>;
      approve(orderId: string): Promise<TransactionStatusResponse>;
      deny(orderId: string): Promise<TransactionStatusResponse>;
      cancel(orderId: string): Promise<TransactionStatusResponse>;
      expire(orderId: string): Promise<TransactionStatusResponse>;
      refund(
        orderId: string,
        parameter?: unknown
      ): Promise<TransactionStatusResponse>;
      refundDirect(
        orderId: string,
        parameter?: unknown
      ): Promise<TransactionStatusResponse>;
    };
  }

  export { Snap, CoreApi };

  const MidtransClient = {
    Snap,
    CoreApi,
  };

  export default MidtransClient;
}
