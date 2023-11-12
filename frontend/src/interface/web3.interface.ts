import { ReactNode } from "react";
import { Contract } from "ethers";

export type IAccount = string | null;

export interface IWeb3AssistantContext {
  account: string | null;
  contractCreate: () => Contract | any;
  connectToWallet: () => void;
}

export interface IGeneralContextProvider {
  children: ReactNode;
}
