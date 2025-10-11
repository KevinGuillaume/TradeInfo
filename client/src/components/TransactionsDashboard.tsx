import { Card, CardContent, CardHeader } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import type { WalletInfo } from '../api'

interface Props {
  walletData: WalletInfo | null
}

const columns: GridColDef[] = [
  { field: 'hash', headerName: 'Tx Hash', flex: 1 },
  { field: 'functionName', headerName: 'Method', width: 160 },
  { field: 'value', headerName: 'Value (ETH)', width: 160 },
  { field: 'timeStamp', headerName: 'Time', width: 180 },
]

export default function TransactionsDashboard({ walletData }: Props) {
  const rows = walletData?.transactions.map((tx) => ({
    id: tx.hash,
    hash: tx.hash,
    functionName: tx.functionName || 'Transfer',
    value: tx.value,
    timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()
  })) || []

  return (
    <Card>
      <CardHeader title="Transaction History" />
      <CardContent>
        <div style={{ height: 420, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
        </div>
      </CardContent>
    </Card>
  )
}


