import { Paper, Box, TextField, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { etherscanAPI } from '../api'

export default function AddressSearch() {

  const [address, setAddress] = useState('')

  const handleSubmit = async () => {
    const response = await etherscanAPI.getWalletInfo(address)
    console.log(response)
    // Need to display result in wallet sumarry card

  }

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box component="form" noValidate>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField fullWidth label="Enter ETH address or ENS" placeholder="vitalik.eth or 0x..." onChange={(e) => setAddress(e.target.value)}/>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Search</Button>
        </Stack>
      </Box>
    </Paper>
  )
}


