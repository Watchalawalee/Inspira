"use client";

import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, InputBase, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation'; // สำหรับ App Router

const SearchBox = styled(Paper)(({ theme }) => ({
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
        {/* Logo Image */}
        <Box component="img" src="/logo.jpg" alt="Logo" sx={{ height: 40 }} />

        {/* Search Bar */}
        <SearchBox elevation={0}>
          <StyledInput placeholder="Find your Exhibition" />
          <SearchIcon sx={{ color: '#000' }} />
        </SearchBox>

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HomeIcon
            sx={{ color: '#ffffff', fontSize: 32 }}
            onClick={() => router.push('/')}
          />
          <AccountCircleIcon
            sx={{ color: '#ffffff', fontSize: 32 }}
            onClick={() => router.push('/profile')}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default InspiraNavbar;
