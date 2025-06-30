import type { WalletClient, HttpTransport, CustomTransport } from 'viem';

declare module 'viem' {
  /**
   * A WalletClient with guaranteed `account` present.
   * - Transport: HttpTransport or CustomTransport
   * - Account: required
   */
  export type ConnectedWalletClient = WalletClient<
    HttpTransport | CustomTransport,
    any,     // your chain type
    import('viem').Account,
    undefined
  >;
}
