import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // Điều hướng về trang dashboard hoặc trang chính
    navigate('/'); 
    // navigate(-1); // Quay lại trang trước đó
  };

  return (
    <Box display="flex" alignItems="center" textAlign="center" mt="5px">
      <IconButton onClick={handleHomeClick}>
        <HomeIcon sx={{fontSize:"30px"}}/>
      </IconButton>
      {items.map((item, index) => (
        <Typography variant='h5' key={index}>
          {index > 0 ? ' / ' : ''}
          {item.path ? (
            <span 
              style={{ cursor: 'pointer', direction:'none' }} 
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ) : (
            item.label
          )}
        </Typography>
      ))}
    </Box>
  );
};

export default Breadcrumb;