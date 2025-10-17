import { Container, Typography, Box, List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material'
import { useAppSelector } from '../store/hooks';
import { alchemyAPI, type TokenBalance } from '../api';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';







export default function ProfilePage() {
    const { address, chainId, connected, error } = useAppSelector((state) => state.currentAddress);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

  const fetchTokenBalances = async (address: string, chainId: number) => {
    if (!address || chainId !== 1) { // Ensure Ethereum mainnet
      setApiError(chainId !== 1 ? 'Please switch to Ethereum mainnet' : 'No address provided');
      return;
    }
    setLoading(true);
    setApiError(null);

    try {
      const balances = await alchemyAPI.getTokenBalances(address);
      console.log("balances: ", balances)

      setTokenBalances(balances);
    } catch (err) {
      console.error('Error fetching token balances:', err);
      setApiError('Failed to fetch token balances. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Fetch balances when address or chainId changes
  useEffect(() => {
    if (address && chainId) {
      fetchTokenBalances(address, chainId);
    } else {
      setTokenBalances([]); // Clear balances if no address
      setApiError(null);
    }
  }, [address, chainId]);


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
             {
                tokenBalances.length > 0 &&
                    <List sx={{ maxWidth: 400, mx: 'auto' }}>
                      {tokenBalances.map((token) => (
                        <ListItem key={token.tokenSymbol}>
                            <ListItemAvatar>
                        <Avatar
                          src={token.logo || 'https://via.placeholder.com/40?text=Token'}
                          alt={`${token.tokenName} logo`}
                          sx={{ width: 40, height: 40 }}
                        />
                      </ListItemAvatar>
                          <ListItemText
                            primary={`${token.tokenName} (${token.tokenSymbol})`}
                            secondary={`${Number(ethers.formatUnits(token.balance, Number(token.decimals))).toFixed(4)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
             }
          </div>

          }
        </Box>
      </Container>
    </Box>
  )
}
