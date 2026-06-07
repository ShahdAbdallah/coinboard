import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useCoinDetail } from '../hooks/useCoinDetail';
import { formatCurrency, formatNumber } from '../utils/format';

export default function CoinDetails() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reloadKey, setReloadKey] = useState(0);

  const { coin, priceHistory, loading, error } = useCoinDetail(
    coinId,
    reloadKey
  );

  const closeDrawer = () => {
    navigate(`/markets?${searchParams.toString()}`);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', pb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1.5 }} />

          <Box sx={{ flex: 1 }}>
            <Skeleton width="50%" height={28} />
            <Skeleton width="25%" height={22} />
          </Box>

          <Skeleton variant="circular" width={36} height={36} />
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Skeleton width="70%" height={56} />
          <Skeleton width="40%" height={32} sx={{ mt: 1 }} />
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Skeleton width="45%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={230} sx={{ borderRadius: 2 }} />
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Skeleton width="45%" height={24} sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={6} key={index}>
                <Skeleton width="70%" />
                <Skeleton width="85%" height={28} />
              </Grid>
            ))}
          </Grid>

          <Skeleton variant="rectangular" height={42} sx={{ mt: 4, borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!coin) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No coin found</Typography>
      </Box>
    );
  }

  const change24h = coin.market_data.price_change_percentage_24h;
  const isPriceUp = change24h >= 0;
  const chartColor = isPriceUp ? '#10B981' : '#EF4444';

  const interval =
    priceHistory.length > 0 ? Math.ceil(priceHistory.length / 5) : 0;

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar
          src={coin.image.large}
          alt={coin.name}
          sx={{ width: 40, height: 40, mr: 1.5 }}
        />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {coin.name}
            </Typography>

            <Chip label={`#${coin.market_cap_rank}`} size="small" />
          </Box>

          <Typography color="text.secondary">
            {coin.symbol.toUpperCase()}
          </Typography>
        </Box>

        <IconButton onClick={closeDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 3, bgcolor: isPriceUp ? '#ECFDF5' : '#FEF2F2' }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {formatCurrency(coin.market_data.current_price.usd)}
        </Typography>

        <Chip
          label={`${isPriceUp ? '↑ +' : '↓ '}${change24h.toFixed(2)}% vs 24h ago`}
          variant={isPriceUp ? 'priceUp' : 'priceDown'}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 2,
            color: 'text.secondary',
            mb: 2,
          }}
        >
          30D PRICE CHART
        </Typography>

        <Box sx={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceHistory}
              margin={{ top: 10, right: 8, left: 8, bottom: 10 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                interval={interval}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />

              <YAxis hide domain={['auto', 'auto']} />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                fill="url(#priceGradient)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 2,
            color: 'text.secondary',
            mb: 3,
          }}
        >
          KEY STATISTICS
        </Typography>

        <Grid container spacing={0}>
          <Grid size={6} sx={{ pb: 2 }}>
            <Typography color="text.secondary">Market Cap</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {formatCurrency(coin.market_data.market_cap.usd)}
            </Typography>
          </Grid>

          <Grid size={6} sx={{ pb: 2 }}>
            <Typography color="text.secondary">Circulating Supply</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {formatNumber(coin.market_data.circulating_supply)}{' '}
              {coin.symbol.toUpperCase()}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={6} sx={{ py: 2 }}>
            <Typography color="text.secondary">24h Volume</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {formatCurrency(coin.market_data.total_volume.usd)}
            </Typography>
          </Grid>

          <Grid size={6} sx={{ py: 2 }}>
            <Typography color="text.secondary">Max Supply</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {coin.market_data.max_supply
                ? `${formatNumber(coin.market_data.max_supply)} ${coin.symbol.toUpperCase()}`
                : 'Unlimited'}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={6} sx={{ pt: 2 }}>
            <Typography color="text.secondary">All-Time High</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {formatCurrency(coin.market_data.ath.usd)}
            </Typography>
          </Grid>

          <Grid size={6} sx={{ pt: 2 }}>
            <Typography color="text.secondary">All-Time Low</Typography>
            <Typography sx={{ fontWeight: 800 }}>
              {formatCurrency(coin.market_data.atl.usd)}
            </Typography>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          fullWidth
          href={coin.links.homepage[0]}
          target="_blank"
          sx={{ mt: 4 }}
        >
          View on CoinGecko ↗
        </Button>
      </Box>
    </Box>
  );
}