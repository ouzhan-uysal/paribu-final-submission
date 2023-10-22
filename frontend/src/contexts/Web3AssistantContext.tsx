"use client";

import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Contract, ethers, InterfaceAbi } from "ethers";
import { toast } from "react-toastify";
import {
  IAccount,
  IWeb3AssistantContext,
  IGeneralContextProvider,
} from "../interface/web3Assistant.interface";

export const Web3AssistantContext = createContext<IWeb3AssistantContext>({
  account: null,
  contractCreate: () => false,
  connectToWallet: () => false,
});

export const Web3AssistantContextProvider: FC<IGeneralContextProvider> = ({
  children,
}) => {
  const [account, setAccount] = useState<IAccount>(null);
  const { ethereum } = window as any;

  if (ethereum) {
    try {
      ethereum.on("accountsChanged", (accounts: Array<string>) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (err) {
      console.error(": ", err);
    }
  }

  const handleGetAccounts = useCallback(async () => {
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts[0]) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("Web3AssistantInstall Metamask Extension!");
      toast.warning(
        "If you want to use Web3Assistant, please install the Metamask Extension!",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetAccounts();
  }, [handleGetAccounts]);

  const connectToWallet = async () => {
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Install Metamask Extension!");
      toast.error("Install Metamask Extension!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const contractCreate = async (
    contractAddress: string,
    contractAbi: InterfaceAbi,
  ) => {
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractAbi, signer);
        return contract;
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Install Metamask Extension!");
      toast.error("Install Metamask Extension!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const value = useMemo(
    () => ({
      account,
      contractCreate,
      connectToWallet,
    }),
    // eslint-disable-next-line
    [account],
  );

  return (
    <Web3AssistantContext.Provider value={value}>
      {children}
    </Web3AssistantContext.Provider>
  );
};

export const useWeb3Assistant = () => {
  const context = useContext(Web3AssistantContext);
  if (!context) {
    throw new Error(
      "useWeb3Assistant must be used within a Web3AssistantContextProvider!",
    );
  }
  return context;
};
