import { Card, CardContent, CardHeader, Avatar, Typography, Stack } from '@mui/material'
import type { WalletInfo } from '../api'

interface Props {
  walletData: WalletInfo | null
}

export default function WalletSummaryCard({ walletData }: Props) {
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


