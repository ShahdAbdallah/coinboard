import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: number;
  accentColor: string;
}

export default function KPICard({
  title,
  value,
  icon,
  change,
  accentColor,
}: KPICardProps) {
  const hasChange = typeof change === 'number';
  const isUp = (change ?? 0) >= 0;

  return (
    <Card
      sx={{
        position: 'relative',
        minHeight: 128,
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
              {value}
            </Typography>

            {hasChange ? (
              <Chip
                size="small"
                icon={isUp ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                label={`${Math.abs(change).toFixed(2)}% vs 24h ago`}
                variant={isUp ? 'priceUp' : 'priceDown'}
                sx={{ mt: 1 }}
              />
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 13,
                  color: 'text.secondary',
                }}
              >
                No change data
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: `${accentColor}18`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}