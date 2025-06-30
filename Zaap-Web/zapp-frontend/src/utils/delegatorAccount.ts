import { privateKeyToAccount } from 'viem/accounts';
import { Implementation, toMetaMaskSmartAccount } from '@metamask/delegation-toolkit';
import { publicClient } from '../lib/viemClients';

const OWNER_PRIVATE_KEY = import.meta.env.VITE_OWNER_PK as `0x${string}`;

export async function createDelegator() {
  const ownerAccount = privateKeyToAccount(OWNER_PRIVATE_KEY);

  const delegator = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [ownerAccount.address, [], [], []],
    deploySalt: '0x',
    signatory: { account: ownerAccount },
  });

  return delegator;
}
