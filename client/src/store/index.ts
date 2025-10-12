import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './walletSlice'
import currentAddressReducer from './connectedAddressSlice.ts'

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    currentAddress: currentAddressReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
