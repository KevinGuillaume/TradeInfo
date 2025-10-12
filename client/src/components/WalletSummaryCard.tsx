import { Card, CardContent, CardHeader, Avatar, Typography, Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function WalletSummaryCard() {
  const walletData = useSelector((state: RootState) => state.wallet.data)
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>Ξ</Avatar>}
        title="Wallet Summary"
        subheader={walletData?.address || "No wallet selected"}
      />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h5">
            ETH Balance — {walletData ? `${walletData.balance} ETH` : '0.00 ETH'}
          </Typography>
          <Typography color="text.secondary">
            Last updated — {walletData ? new Date().toLocaleTimeString() : '--'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}


