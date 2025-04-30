'use client';

import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, InputBase, Paper, Menu, MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';

const SearchBox = styled(Paper)(() => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 30,
  padding: '4px 16px',
  width: '100%',
  maxWidth: 500,
  backgroundColor: '#fff',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(1),
  color: '#555',
}));

const InspiraNavbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    handleMenuClose();
    router.push('/'); // กลับไปหน้าแรกหลังออกจากระบบ
  };
  

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile'); 
  };

  const handleChangePassword = () => {
    handleMenuClose();
    router.push('/changepassword');
  };

  const handleRefer = () => {
    handleMenuClose();
    router.push('/refer'); 
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#5b78a4',
        boxShadow: 'none',
        width: '100%',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box
          component="img"
          src="/logo.svg"
          alt="Logo"
          sx={{
            height: { xs: 24, sm: 32, md: 40 },
            maxWidth: { xs: 100, sm: 150, md: 200 },
            width: '100%',
            filter: 'invert(1)',
            objectFit: 'contain',
          }}
        />

        {/* Search Bar */}
        <SearchBox elevation={0}>
          <StyledInput placeholder="Find your Exhibition" />
          <SearchIcon sx={{ color: '#000' }} />
        </SearchBox>

        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HomeIcon
            sx={{ color: '#ffffff', fontSize: 32, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          />
          <IconButton onClick={isLoggedIn ? handleMenuOpen : handleLoginRedirect}>
            <AccountCircleIcon sx={{ color: '#ffffff', fontSize: 32 }} />
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>ดูข้อมูลของฉัน</MenuItem>
          <MenuItem onClick={handleRefer}>แนะนำนิทรรศการใหม่</MenuItem>
          <MenuItem onClick={handleChangePassword}>เปลี่ยนรหัสผ่าน</MenuItem>
          <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default InspiraNavbar;
