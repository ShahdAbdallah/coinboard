import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const expandedWidth = 232;
const collapsedWidth = 64;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <GridViewRoundedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Markets', path: '/markets', icon: <ShowChartIcon sx={{ fontSize: 20 }} /> },
  { label: 'Portfolio', path: '/portfolio', icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} /> },
  { label: 'News', path: '/news', icon: <ArticleIcon sx={{ fontSize: 20 }} /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    setCollapsed(saved === 'true');
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const nextValue = !prev;
      localStorage.setItem('sidebar-collapsed', String(nextValue));
      return nextValue;
    });
  };

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? collapsedWidth : expandedWidth,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: '1px solid #E5E7EB',
        transition: 'width 240ms ease',
        display: 'flex',
        flexDirection: 'column',
        px: 1.5,
        py: 2,
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 1.5,
          mb: 3,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          C
        </Avatar>

        {!collapsed && (
          <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
            CoinBoard
          </Typography>
        )}
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <Tooltip
            key={item.path}
            title={collapsed ? item.label : ''}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: '#6B7280',
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                minHeight: 48,
                '&.active': {
                  bgcolor: '#F0EFFF',
                  color: 'primary.main',
                  border: '1px solid #DDD9FF',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />

        <Tooltip title={collapsed ? 'Settings' : ''} placement="right">
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 2,
              color: '#6B7280',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              minHeight: 48,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                color: 'inherit',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>

            {!collapsed && <ListItemText primary="Settings" />}
          </ListItemButton>
        </Tooltip>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: collapsed ? 'center' : 'flex-start',
            mb: 2,
          }}
        >
          <Avatar sx={{ width: 36, height: 36 }}>S</Avatar>

          {!collapsed && (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                Shahd
              </Typography>
              <Typography sx={{ fontSize: 12 }}>
                Frontend Engineer
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            sx={{
              bgcolor: '#F3F4F6',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: '#E5E7EB',
              },
            }}
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}