export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface GlobalMarketStats {
  totalMarketCapUsd: number;
  totalVolumeUsd: number;
  btcDominance: number;
  activeCoins: number;
  marketCapChange24h: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCapRank: number;
}
export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  image: {
    large: string;
  };
  links: {
    homepage: string[];
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    circulating_supply: number;
    max_supply: number | null;
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
}
export interface CoinPricePoint {
  date: string;
  price: number;
}