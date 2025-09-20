// Type definitions for Cashfree API responses

declare module 'cashfree-pg' {
  export interface OrderEntity {
    cf_order_id?: string;
    order_id: string;
    order_amount: number;
    order_currency: string;
    order_status: string;
    payment_session_id: string;
    order_expiry_time?: string;
    order_note?: string;
    customer_details?: {
      customer_id: string;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
    };
    order_meta?: {
      return_url: string;
      notify_url: string;
      payment_methods?: string;
    };
    order_tags?: Record<string, string>;
    order_splits?: any[];
    payments?: {
      url?: string;
      payment_id?: string;
      auth_id?: string;
      payment_status?: string;
      payment_message?: string;
      payment_time?: string;
      payment_method?: string;
      bank_reference?: string;
    };
    payment_link?: string;
    payment_details?: {
      payment_id?: string;
      auth_id?: string;
      payment_status?: string;
      payment_message?: string;
      payment_time?: string;
      payment_method?: string;
      bank_reference?: string;
    };
  }

  export enum CFEnvironment {
    PRODUCTION = 'PRODUCTION',
    SANDBOX = 'SANDBOX'
  }

  export class Cashfree {
    constructor(environment: CFEnvironment, appId: string, secretKey: string);
    PGCreateOrder(orderData: any): Promise<{ data: OrderEntity }>;
    PGFetchOrder(orderId: string): Promise<{ data: OrderEntity }>;
  }
}