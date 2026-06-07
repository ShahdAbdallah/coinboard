import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import KPICard from '../components/KPICard';
import TrendingCard from '../components/TrendingCard';
import { useCoins } from '../hooks/useCoins';
import { useGlobal } from '../hooks/useGlobal';
import { formatCurrency, formatNumber } from '../utils/format';

const COLORS = [
  '#6C63FF',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#06B6D4',
  '#EC4899',
  '#8b5cf6',
];

export default function Dashboard() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data, loading, error } = useGlobal(reloadKey);
  const { coins, loading: coinsLoading } = useCoins(1);
  const [moversTab, setMoversTab] = useState(0);

  if (loading || coinsLoading) {
  return (
    <Box>
      <Skeleton width={260} height={40} />
      <Skeleton width={420} height={24} sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid size={{ xs: 12, md: 3 }} key={index}>
            <Paper sx={{ p: 2, height: 120 }}>
              <Skeleton width="60%" />
              <Skeleton width="80%" height={36} />
              <Skeleton width="45%" />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2, height: 345 }}>
            <Skeleton width="40%" />
            <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', mt: 3 }} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2, height: 345 }}>
            <Skeleton width="40%" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height={42} sx={{ mt: 1 }} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

if (error) {
  return (
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
  );
}
  if (!data) return <Typography>No dashboard data found</Typography>;

  const topCoins = coins.slice(0, 7);

  const dominanceData = topCoins.map((coin) => ({
    name: coin.symbol.toUpperCase(),
    value:
      coin.market_cap > 0
        ? (coin.market_cap / data.totalMarketCapUsd) * 100
        : 0,
  }));

  const gainers = [...coins]
    .filter((coin) => coin.price_change_percentage_24h !== null)
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h ?? 0) -
        (a.price_change_percentage_24h ?? 0)
    )
    .slice(0, 5);

  const losers = [...coins]
    .filter((coin) => coin.price_change_percentage_24h !== null)
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h ?? 0) -
        (b.price_change_percentage_24h ?? 0)
    )
    .slice(0, 5);

  const movers = moversTab === 0 ? gainers : losers;
  const trendingCoins = coins.slice(0, 4);

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Market Overview
        </Typography>

        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          Global cryptocurrency market · Auto-refreshes every 2 minutes
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard
            title="Total Market Cap"
            value={formatCurrency(data.totalMarketCapUsd)}
            change={data.marketCapChange24h}
            accentColor="#6C63FF"
            icon={<ShowChartIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard
            title="24h Volume"
            value={formatCurrency(data.totalVolumeUsd)}
            accentColor="#10B981"
            icon={<SwapHorizIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard
            title="BTC Dominance"
            value={`${data.btcDominance.toFixed(2)}%`}
            accentColor="#F59E0B"
            icon={<CurrencyBitcoinIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <KPICard
            title="Active Coins"
            value={formatNumber(data.activeCoins)}
            accentColor="#06B6D4"
            icon={<GridViewRoundedIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              p: 2.25,
              bgcolor: 'background.paper',
              borderRadius: 3,
              height: 345,
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Market Dominance
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: 13 }}
            >
              Top coins by market cap share
            </Typography>

            <Box sx={{ height: 225 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dominanceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={94}
                    paddingAngle={2}
                  >
                    {dominanceData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      typeof value === 'number'
                        ? `${value.toFixed(2)}%`
                        : value
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'nowrap',
                gap: 1.2,
              }}
            >
              {dominanceData.map((item, index) => (
                <Box
                  key={item.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: COLORS[index % COLORS.length],
                    }}
                  />

                  <Typography variant="caption">{item.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              p: 2.25,
              bgcolor: 'background.paper',
              borderRadius: 3,
              height: 345,
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Top Movers
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: 13 }}
            >
              24-hour price change
            </Typography>

            <Tabs
              value={moversTab}
              onChange={(_, value) => setMoversTab(value)}
              sx={{
                minHeight: 28,
                mb: 0.5,
                '& .MuiTab-root': {
                  minHeight: 28,
                  px: 2,
                  fontSize: 12,
                  fontWeight: 700,
                },
              }}
            >
              <Tab label="Gainers" />
              <Tab label="Losers" />
            </Tabs>

            <Divider />

            <Box sx={{ height: 235, overflow: 'hidden' }}>
              {movers.map((coin) => {
                const change = coin.price_change_percentage_24h ?? 0;
                const isUp = change >= 0;

                return (
                  <Box
                    key={coin.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 46,
                      borderBottom: '1px solid #EEF0F4',
                    }}
                  >
                    <Avatar
                      src={coin.image}
                      alt={coin.name}
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1.2,
                      }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 13,
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {coin.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          lineHeight: 1.1,
                        }}
                      >
                        {coin.symbol.toUpperCase()}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right', ml: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                        {formatCurrency(coin.current_price)}
                      </Typography>

                      <Chip
                        size="small"
                        label={`${isUp ? '+' : ''}${change.toFixed(2)}%`}
                        variant={isUp ? 'priceUp' : 'priceDown'}
                        sx={{
                          height: 19,
                          fontSize: 11,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="overline"
        sx={{
          display: 'block',
          fontWeight: 800,
          color: 'text.secondary',
          mt: 2.5,
          mb: 1,
          lineHeight: 1,
        }}
      >
        Trending Now
      </Typography>

      <Grid container spacing={2}>
        {trendingCoins.map((coin) => (
          <Grid size={{ xs: 12, md: 3 }} key={coin.id}>
            <TrendingCard
              name={coin.name}
              symbol={coin.symbol}
              image={coin.image}
              price={formatCurrency(coin.current_price)}
              change={coin.price_change_percentage_24h ?? 0}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}