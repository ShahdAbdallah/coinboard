import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { CoinMarket } from '../types/market';
import { formatCurrency } from '../utils/format';

interface MarketsTableProps {
  coins: CoinMarket[];
}

export default function MarketsTable({ coins }: MarketsTableProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 56 }}>#</TableCell>
            <TableCell>Coin</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>24H %</TableCell>
            <TableCell>7D %</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell sx={{ width: 170 }}>7D Chart</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {coins.map((coin) => {
            const change24h = coin.price_change_percentage_24h ?? 0;
            const change7d = coin.price_change_percentage_7d_in_currency ?? 0;

            const chartData = coin.sparkline_in_7d.price.map((price, index) => ({
              index,
              price,
            }));

            return (
              <TableRow
                key={coin.id}
                hover
                onClick={() => navigate(`/markets/${coin.id}${location.search}`)}
                sx={{ cursor: 'pointer', height: 72 }}
              >
                <TableCell>{coin.market_cap_rank}</TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={coin.image} alt={coin.name} sx={{ width: 34, height: 34 }} />

                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{coin.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {coin.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  {formatCurrency(coin.current_price)}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={`${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`}
                    variant={change24h >= 0 ? 'priceUp' : 'priceDown'}
                  />
                </TableCell>

                <TableCell sx={{ color: change7d >= 0 ? 'success.main' : 'error.main', fontWeight: 700 }}>
                  {change7d >= 0 ? '+' : ''}
                  {change7d.toFixed(2)}%
                </TableCell>

                <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(coin.market_cap)}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(coin.total_volume)}</TableCell>

                <TableCell sx={{ width: 170, height: 70 }}>
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={chartData}>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={change7d >= 0 ? '#10B981' : '#EF4444'}
                        fill={change7d >= 0 ? '#D1FAE5' : '#FEE2E2'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}