import { Paper, Box, TextField, Button, Stack } from '@mui/material'

export default function AddressSearch() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box component="form" noValidate>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField fullWidth label="Enter ETH address or ENS" placeholder="vitalik.eth or 0x..." />
          <Button variant="contained" color="primary">Search</Button>
        </Stack>
      </Box>
    </Paper>
  )
}


