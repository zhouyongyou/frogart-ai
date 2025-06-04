import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("請安裝 MetaMask 等以太坊錢包");
    return null;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}
