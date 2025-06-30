import { toMetaMaskSmartAccount, Implementation } from '@metamask/delegation-toolkit';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';
import { publicClient } from '../lib/viemClients';

export async function getMetaMaskSmartAccount(address: `0x${string}`) {
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
    account: address,
  });

  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [address, [], [], []],
    deploySalt: '0x',
    signatory: { walletClient },
  });

  return { smartAccount , address};
}
