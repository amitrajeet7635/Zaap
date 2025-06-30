import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/91e8c9454d844124bd7c5e0e6ce51fe2'),
});
