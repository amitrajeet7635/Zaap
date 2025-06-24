import { useState } from "react";
import { ethereum } from "../services/metamask";

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async (): Promise<string | undefined> => {
    try {
      if (!ethereum || !ethereum.request) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      }) as string[]; // ✅ Fix here

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        return accounts[0];
      } else {
        console.error("No accounts found.");
      }
    } catch (err) {
      console.error("MetaMask connection failed", err);
      alert("MetaMask connection failed.");
    }
  };

  return { account, connect };
};
