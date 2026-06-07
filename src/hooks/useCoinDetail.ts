import { useEffect, useState } from 'react';
import { getCoinDetails, getCoinPriceHistory } from '../api/coingecko';
import type { CoinDetail, CoinPricePoint } from '../types/market';
import { getCache, setCache } from '../utils/cache';

const COIN_DETAIL_TTL = 3 * 60 * 1000;
const COIN_CHART_TTL = 10 * 60 * 1000;

interface PriceHistoryResponse {
  prices: [number, number][];
}

export function useCoinDetail(coinId: string | undefined,reloadKey = 0) {
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [priceHistory, setPriceHistory] = useState<CoinPricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coinId) {
      setLoading(false);
      return;
    }

    async function loadCoin(id: string) {
      try {
        setLoading(true);
        setError(null);

        const coinCacheKey = `coin-detail-${id}`;
        const chartCacheKey = `coin-chart-${id}`;

        const cachedCoin = getCache<CoinDetail>(coinCacheKey);
        const cachedChart = getCache<CoinPricePoint[]>(chartCacheKey);

        if (cachedCoin && cachedChart && reloadKey === 0 ) {
          setCoin(cachedCoin);
          setPriceHistory(cachedChart);
          setLoading(false);
          return;
        }

        const [coinData, chartData] = await Promise.all([
          cachedCoin ?? getCoinDetails(id),
          cachedChart ?? getCoinPriceHistory(id),
        ]);

        const mappedChart = cachedChart
          ? cachedChart
          : (chartData as PriceHistoryResponse).prices.map(([timestamp, price]) => ({
              date: new Date(timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              price,
            }));

        setCoin(coinData as CoinDetail);
        setPriceHistory(mappedChart);

        if (!cachedCoin) {
          setCache(coinCacheKey, coinData as CoinDetail, COIN_DETAIL_TTL);
        }

        if (!cachedChart) {
          setCache(chartCacheKey, mappedChart, COIN_CHART_TTL);
        }
      } catch {
        setError('Failed to load coin details');
      } finally {
        setLoading(false);
      }
    }

    loadCoin(coinId);
  }, [coinId,reloadKey]);

  return {
    coin,
    priceHistory,
    loading,
    error,
  };
}