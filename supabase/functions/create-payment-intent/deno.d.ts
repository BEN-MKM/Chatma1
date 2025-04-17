declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'npm:stripe@12.0.0' {
  export default class Stripe {
    constructor(secretKey: string, options?: { apiVersion: string });
    paymentIntents: {
      create(params: {
        amount: number;
        currency: string;
        automatic_payment_methods?: { enabled: boolean };
      }): Promise<{
        id: string;
        client_secret: string;
        metadata?: Record<string, string>;
      }>;
    };
  }
}
