declare module '@cashfreepayments/cashfree-js' {
  export function load(options: { mode: CFEnvironment }): Promise<CashfreeSDK>;

  interface CashfreeSDK {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: '_self' | '_blank';
    }): Promise<any>;
  }
}