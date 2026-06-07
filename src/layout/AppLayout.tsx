
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: 2,
          py: 1.5,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}