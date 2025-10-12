import { Container, Typography, Box } from '@mui/material'

export default function ProfilePage() {
  return (
    <Box sx={{ pt: 8, pb: 4, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Profile page coming soon...
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
