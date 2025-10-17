import { Container, Typography, Box } from '@mui/material'
import { useAppSelector } from '../store/hooks';

export default function ProfilePage() {
    const { address, chainId, connected, error } = useAppSelector((state) => state.currentAddress);

  return (
    <Box sx={{ pt: 8, pb: 4, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          { !address ?
          <Typography variant="body1" color="text.secondary">
            Profile page coming soon...
          </Typography>
          :
          <div>
              <div>This is yo address: {address}</div>
             <div>You are currently connected to: {chainId}</div>
          </div>

          }
        </Box>
      </Container>
    </Box>
  )
}
