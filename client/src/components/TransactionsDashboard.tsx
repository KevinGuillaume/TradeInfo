import { Card, CardContent, CardHeader } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'hash', headerName: 'Tx Hash', flex: 1 },
  { field: 'method', headerName: 'Method', width: 160 },
  { field: 'direction', headerName: 'Direction', width: 140 },
  { field: 'value', headerName: 'Value', width: 160 },
  { field: 'timestamp', headerName: 'Time', width: 180 },
]

interface Row { id: string }
const rows: Row[] = []

export default function TransactionsDashboard() {
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


