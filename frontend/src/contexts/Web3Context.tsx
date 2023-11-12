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
import { IAccount, IGeneralContextProvider, IWeb3AssistantContext } from "src/interface/web3.interface";

export const Web3Context = createContext<IWeb3AssistantContext>({
  account: null,
  contractCreate: () => undefined,
  connectToWallet: () => false,
});

export const Web3ContextProvider: FC<IGeneralContextProvider> = ({
  children,
}) => {
  const [account, setAccount] = useState<IAccount>(null);

  if (typeof window !== "undefined") {
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
        console.error("err: ", err);
      }
    }
  }

  const handleGetAccounts = useCallback(async () => {
    const { ethereum } = window as any;
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
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetAccounts();
  }, [handleGetAccounts]);

  const connectToWallet = async () => {
    const { ethereum } = window as any;
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
    contractAbi: InterfaceAbi
  ): Promise<Contract | undefined> => {
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractAbi, signer);
        console.log("contract: ", contractAbi);
        return contract;
      } catch (err) {
        console.error(err);
        return undefined;
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
      return undefined;
    }
  };

  const value = useMemo(
    () => ({
      account,
      contractCreate,
      connectToWallet,
    }),
    // eslint-disable-next-line
    [account]
  );

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3ContextProvider!");
  }
  return context;
};
