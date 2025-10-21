import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Button from "@mui/material/Button";
import { clearWallet, setWalletError, setWalletInfo } from "../store/connectedAddressSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const providerOptions = {
  // Example: WalletConnect provider config, etc.
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

export default function App() {
  const dispatch = useAppDispatch()
  const { address, chainId, connected, error } = useAppSelector((state) => state.currentAddress);
  

  const connect = async () => {
    try {
      console.log("Trying to connect")
      const externalProvider = await web3Modal.connect(); // opens modal UI
      const provider = new ethers.BrowserProvider(externalProvider);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const address = await signer.getAddress();
      
      // ✅ Dispatch to Redux
      dispatch(setWalletInfo({
        address,
        chainId: Number(network.chainId),
      }));
    } catch (err) {
      console.error(err);
      // Handle unknown error types safely
      if (err instanceof Error) {
        dispatch(setWalletError(err.message));
      } else if (typeof err === "string") {
        dispatch(setWalletError(err));
      } else {
        dispatch(setWalletError("Failed to connect wallet"));
      }
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    dispatch(clearWallet())
  };

  return (
    <div>
        {!address ?
        <div> 
        <Button variant="contained" color="primary" onClick={connect}>Connect Wallet</Button>
        <div>{address}</div>
        </div>
       : 
      <Button variant="contained" color="primary" onClick={disconnect}>Disconnect</Button>
    }
    </div>
  );
}
