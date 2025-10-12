import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { etherscanAPI } from '../api'
import type { WalletInfo } from '../api'

interface WalletState {
  data: WalletInfo | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchWalletData = createAsyncThunk(
  'wallet/fetchWalletData',
  async (address: string, { rejectWithValue }) => {
    try {
      const data = await etherscanAPI.getWalletInfo(address)
      return data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch wallet data')
    }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletData(state) {
      state.data = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearWalletData, clearError } = walletSlice.actions
export default walletSlice.reducer
