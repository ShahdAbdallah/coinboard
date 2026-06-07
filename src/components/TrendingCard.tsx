import { Avatar, Box, Card, CardContent, Chip, Typography } from '@mui/material';

interface TrendingCardProps {
  name: string;
  symbol: string;
  image: string;
  price: string;
  change: number;
}

export default function TrendingCard({
  name,
  symbol,
  image,
  price,
  change,
}: TrendingCardProps) {
  const isUp = change >= 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={image} alt={name} />

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>
              {symbol.toUpperCase()}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: '#94A3B8',
                    fontWeight: 500,
                }}
                >
                {name}
            </Typography>
              
            

            <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
              {price}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={`${isUp ? '+' : ''}${change.toFixed(2)}%`}
            variant={isUp ? 'priceUp' : 'priceDown'}
          />
        </Box>
      </CardContent>
    </Card>
  );
}