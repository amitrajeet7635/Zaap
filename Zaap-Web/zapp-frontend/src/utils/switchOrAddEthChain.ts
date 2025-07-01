export const SEPOLIA_PARAMS = {
  chainId: '0xaa36a7', // 11155111
  chainName: 'Ethereum Sepolia',
  rpcUrls: ['https://sepolia.infura.io/v3/91e8c9454d844124bd7c5e0e6ce51fe2'],
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export async function switchOrAddSepoliaChain() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_PARAMS.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SEPOLIA_PARAMS],
      });
    } else {
      throw error;
    }
  }
}
