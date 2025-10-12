import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  chainId: null,
  connected: false,
  error: null,
};

const connectedAddressSlice = createSlice({
    name: "connectedAddress",
    initialState,
    reducers: {
        setWalletInfo: (state, action) => {
            const { address, chainId } = action.payload;
            state.address = address;
            state.chainId = chainId;
            state.connected = !!address;
            state.error = null;
          },
          setWalletError: (state, action) => {
            state.error = action.payload;
            state.connected = false;
          },
          clearWallet: (state) => {
            state.address = null;
            state.chainId = null;
            state.connected = false;
            state.error = null;
          },
    }
})


export const { setWalletInfo, setWalletError, clearWallet } = connectedAddressSlice.actions;
export default connectedAddressSlice.reducer;