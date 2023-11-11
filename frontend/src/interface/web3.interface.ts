import { ReactNode } from "react";
import { InterfaceAbi, BytesLike } from "ethers";
import { Contract } from "ethers";

export type IAccount = string | null;

export interface IWeb3AssistantContext {
  account: string | null;
  contractCreate: (contractAddress: string, contractAbi: InterfaceAbi) => void;
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