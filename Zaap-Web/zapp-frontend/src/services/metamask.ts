import MetaMaskSDK from '@metamask/sdk';

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: 'Parental Wallet App',
    url: window.location.href,
  },
  injectProvider: true,
});

export const ethereum = MMSDK.getProvider();
