import { Card, CardContent, CardHeader, Avatar, Typography, Stack } from '@mui/material'

export default function WalletSummaryCard() {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>Ξ</Avatar>}
        title="Wallet Summary"
        subheader="Address/ENS and totals"
      />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h5">Total Value — $0.00</Typography>
          <Typography color="text.secondary">Last updated — --</Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}


