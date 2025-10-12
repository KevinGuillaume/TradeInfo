import { Paper, Box, TextField, Button, Stack, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWalletData } from '../store/walletSlice'
import type { RootState } from '../store'

export default function AddressSearch() {
  const [address, setAddress] = useState('')
  const dispatch = useDispatch()
  const loading = useSelector((state: RootState) => state.wallet.loading)

  const handleSubmit = async () => {
    if (address.trim()) {
      dispatch(fetchWalletData(address.trim()) as any)
    }
  }

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box component="form" noValidate>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField 
            fullWidth 
            label="Enter ETH address or ENS" 
            placeholder="vitalik.eth or 0x..." 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading || !address.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}


