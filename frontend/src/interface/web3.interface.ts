import { ReactNode } from "react";
import { InterfaceAbi } from "ethers";
import { Contract } from "ethers";

export type IAccount = string | null;

export interface IWeb3AssistantContext {
  account: string | null;
  contractCreate: (contractAddress: string, contractAbi: InterfaceAbi) => Contract | undefined;
  connectToWallet: () => void;
}

export interface IGeneralContextProvider {
  children: ReactNode;
}

export type IWeb3Response = {
  account: IAccount,
  connectToWallet: () => void,
  contractCreate: (contractAddress: string, contractAbi: InterfaceAbi,) => Promise<Contract | undefined>,
}