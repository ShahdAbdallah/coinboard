import { useEffect, useState } from 'react';
import { getCoinsMarket } from '../api/coingecko';
import type { CoinMarket } from '../types/market';
import { getCache, setCache } from '../utils/cache';

const COINS_CACHE_TTL = 3 * 60 * 1000;
const PER_PAGE = 10;

export function useCoins(page: number, reloadKey = 0) {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `coins-market-page-${page}`;
        const cached = getCache<CoinMarket[]>(cacheKey);

        if (cached && reloadKey === 0) {
          setCoins(cached);
          setLoading(false);
          return;
        }

        const data = await getCoinsMarket(page, PER_PAGE);

        setCoins(data);
        setCache(cacheKey, data, COINS_CACHE_TTL);
      } catch {
        setError('Failed to load coins');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, reloadKey]);

  return { coins, loading, error };
}