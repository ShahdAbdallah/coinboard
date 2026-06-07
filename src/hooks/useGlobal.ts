import { useEffect, useState } from 'react';
import { getGlobalStats, getTrendingCoins } from '../api/coingecko';
import type { GlobalMarketStats, TrendingCoin } from '../types/market';
import { getCache, setCache } from '../utils/cache';

const GLOBAL_CACHE_KEY = 'global-dashboard-data';
const GLOBAL_CACHE_TTL = 5 * 60 * 1000;

interface GlobalDashboardData {
  stats: GlobalMarketStats;
  trending: TrendingCoin[];
}

export function useGlobal(reloadKey = 0) {
  const [data, setData] = useState<GlobalMarketStats | null>(null);
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const cached = getCache<GlobalDashboardData>(GLOBAL_CACHE_KEY);

        if (cached && reloadKey === 0) {
          setData(cached.stats);
          setTrending(cached.trending);
          setLoading(false);
          return;
        }

        const [globalStats, trendingCoins] = await Promise.all([
          getGlobalStats(),
          getTrendingCoins(),
        ]);

        setData(globalStats);
        setTrending(trendingCoins);

        setCache(
          GLOBAL_CACHE_KEY,
          {
            stats: globalStats,
            trending: trendingCoins,
          },
          GLOBAL_CACHE_TTL
        );
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [reloadKey]);

  return {
    data,
    trending,
    loading,
    error,
  };
}