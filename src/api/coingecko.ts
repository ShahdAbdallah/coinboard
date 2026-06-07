import axios from 'axios';
import type {
  CoinDetail,
  CoinMarket,
  GlobalMarketStats,
  TrendingCoin,
} from '../types/market';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export async function getGlobalStats(): Promise<GlobalMarketStats> {
  const response = await api.get('/global');

  const data = response.data.data;

  return {
  totalMarketCapUsd: data.total_market_cap.usd,
  totalVolumeUsd: data.total_volume.usd,
  btcDominance: data.market_cap_percentage.btc,
  activeCoins: data.active_cryptocurrencies,
  marketCapChange24h: data.market_cap_change_percentage_24h_usd,
};
}

export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  const response = await api.get('/search/trending');

  return response.data.coins.slice(0, 4).map((item: {
    item: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      market_cap_rank: number;
    };
  }) => ({
    id: item.item.id,
    name: item.item.name,
    symbol: item.item.symbol,
    image: item.item.thumb,
    marketCapRank: item.item.market_cap_rank,
  }));
}

export async function getCoinsMarket(
  page = 1,
  perPage = 10
): Promise<CoinMarket[]> {
  const response = await api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: '7d',
    },
  });

  return response.data;
}

export async function getCoinDetails(id: string): Promise<CoinDetail> {
  const response = await api.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
    },
  });

  return response.data;
}
export async function getCoinPriceHistory(id: string) {
  const response = await api.get(
    `/coins/${id}/market_chart`,
    {
      params: {
        vs_currency: 'usd',
        days: 30,
      },
    }
  );

  return response.data;
}