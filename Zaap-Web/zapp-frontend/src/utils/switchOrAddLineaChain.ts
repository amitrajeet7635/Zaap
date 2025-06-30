export const LINEA_SEPOLIA_PARAMS = {
  chainId: '0xe705', // 59141
  chainName: 'Linea Sepolia',
  rpcUrls: ['https://rpc.sepolia.linea.build'],
  nativeCurrency: {
    name: 'Linea Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://sepolia.lineascan.build'],
};

export async function switchOrAddLineaChain() {
  if (!window.ethereum) throw new Error('MetaMask not found');
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: LINEA_SEPOLIA_PARAMS.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [LINEA_SEPOLIA_PARAMS],
      });
    } else {
      throw error;
    }
  }
}
