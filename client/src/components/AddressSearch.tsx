import { Paper, Box, TextField, Button, Stack, CircularProgress } from '@mui/material'
import { useState } from 'react'

interface Props {
  onSearch: (address: string) => void
  loading: boolean
}

export default function AddressSearch({ onSearch, loading }: Props) {
  const [address, setAddress] = useState('')

  const handleSubmit = async () => {
    if (address.trim()) {
      onSearch(address.trim())
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


