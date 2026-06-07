import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import MarketsTable from '../components/MarketsTable';
import { useCoins } from '../hooks/useCoins';
import CoinDetails from './CoinDetails';

export default function Markets() {
  const navigate = useNavigate();
  const { coinId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadKey, setReloadKey] = useState(0);

  const pageFromUrl = Number(searchParams.get('page') ?? '1');
  const searchFromUrl = searchParams.get('search') ?? '';
  const sortFromUrl = searchParams.get('sort') ?? 'market_cap';
  const categoryFromUrl = searchParams.get('category') ?? 'all';

  const [searchInput, setSearchInput] = useState(searchFromUrl);

  const { coins, loading, error } = useCoins(pageFromUrl, reloadKey);

  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        nextParams.set('search', searchInput.trim());
      } else {
        nextParams.delete('search');
      }

      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredCoins = useMemo(() => {
    const search = searchFromUrl.toLowerCase();

    let result = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );

    if (categoryFromUrl === 'stablecoins') {
      result = result.filter((coin) =>
        ['usdt', 'usdc', 'dai', 'usde', 'usd1'].includes(coin.symbol.toLowerCase())
      );
    }

    if (categoryFromUrl === 'layer1') {
      result = result.filter((coin) =>
        ['btc', 'eth', 'sol', 'bnb', 'trx', 'ton'].includes(coin.symbol.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      if (sortFromUrl === 'price') return b.current_price - a.current_price;
      if (sortFromUrl === 'volume') return b.total_volume - a.total_volume;
      if (sortFromUrl === 'change_24h') {
        return (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0);
      }

      return b.market_cap - a.market_cap;
    });

    return result;
  }, [coins, searchFromUrl, sortFromUrl, categoryFromUrl]);

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === 'all' || value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({ page: '1' });
  };

  const isDrawerOpen = Boolean(coinId);
  const hasFilters =
    Boolean(searchFromUrl) || sortFromUrl !== 'market_cap' || categoryFromUrl !== 'all';

  return (
    <>
      <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
        Markets
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Real-time prices for 10,000+ cryptocurrencies
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Search by name or symbol"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          sx={{ flex: 1, minWidth: 260 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={categoryFromUrl}
            onChange={(event) => updateParam('category', event.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="stablecoins">Stablecoins</MenuItem>
            <MenuItem value="layer1">Layer 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            label="Sort"
            value={sortFromUrl}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            <MenuItem value="market_cap">Market Cap</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="volume">Volume</MenuItem>
            <MenuItem value="change_24h">24h Change</MenuItem>
          </Select>
        </FormControl>

        <Chip label="10 coins" color="success" variant="outlined" />
      </Paper>

      {hasFilters && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            ACTIVE:
          </Typography>

          {searchFromUrl && <Chip label={`Search: ${searchFromUrl}`} onDelete={() => updateParam('search', '')} />}
          {categoryFromUrl !== 'all' && <Chip label={`Category: ${categoryFromUrl}`} onDelete={() => updateParam('category', 'all')} />}
          {sortFromUrl !== 'market_cap' && <Chip label={`Sort: ${sortFromUrl}`} onDelete={() => updateParam('sort', 'market_cap')} />}

          <Button size="small" onClick={clearFilters}>
            Clear all
          </Button>
        </Box>
      )}

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['#', 'Coin', 'Price', '24H %', '7D %', 'Market Cap', 'Volume', '7D Chart'].map(
                  (header) => (
                    <TableCell key={header}>{header}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 8 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton height={32} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setReloadKey((value) => value + 1)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : filteredCoins.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No coins found
          </Typography>
          <Typography color="text.secondary">
            {searchFromUrl
              ? `No results for "${searchFromUrl}". Try another search.`
              : 'No market data is available right now.'}
          </Typography>
        </Paper>
      ) : (
        <MarketsTable coins={filteredCoins} />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={50}
          page={pageFromUrl}
          color="primary"
          onChange={(_, value) => {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set('page', String(value));
            setSearchParams(nextParams);
          }}
        />
      </Box>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => navigate(`/markets?${searchParams.toString()}`)}
      >
        <Box sx={{ width: 480 }}>
          <CoinDetails />
        </Box>
      </Drawer>
    </>
  );
}