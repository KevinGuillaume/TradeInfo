import { Card, CardContent, CardHeader } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'token', headerName: 'Token', flex: 1 },
  { field: 'symbol', headerName: 'Symbol', width: 120 },
  { field: 'balance', headerName: 'Balance', width: 140 },
  { field: 'price', headerName: 'Price', width: 140 },
  { field: 'value', headerName: 'Value', width: 160 },
]

interface Row { id: string }
const rows: Row[] = []

export default function HoldingsDashboard() {
  return (
    <Card>
      <CardHeader title="Current Holdings" />
      <CardContent>
        <div style={{ height: 360, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
        </div>
      </CardContent>
    </Card>
  )
}


