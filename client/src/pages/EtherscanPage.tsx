import { Container, Box } from '@mui/material'
import AddressSearch from '../components/AddressSearch'
import WalletSummaryCard from '../components/WalletSummaryCard'
import TransactionsDashboard from '../components/TransactionsDashboard'

export default function EtherscanPage() {
  return (
    <Box sx={{ pt: 8, pb: 4, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <AddressSearch />
        </Box>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 3
        }}>
          <Box>
            <WalletSummaryCard />
          </Box>
          <Box>
            <TransactionsDashboard />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
