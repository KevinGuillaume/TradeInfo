import { Alert } from '@mui/material'

export default function LiveStatusBar() {
  return (
    <Alert severity="info" variant="outlined">Disconnected — WebSocket not connected</Alert>
  )
}


