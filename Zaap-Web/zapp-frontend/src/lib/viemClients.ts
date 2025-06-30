import { createPublicClient, http } from 'viem';
import { lineaSepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: lineaSepolia,
  transport: http('https://rpc.sepolia.linea.build'),
});
