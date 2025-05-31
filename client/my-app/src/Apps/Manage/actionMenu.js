// ActionMenu.jsx
import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';


const ActionMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleMenuOpen}
        endIcon={<ArrowDropDownIcon sx={{ fontSize: '16px' }} />}
        sx={{
          padding: '2px 8px',
          fontSize: '13px',
          minWidth: 'unset',
          textTransform: 'none',
          lineHeight: '1',
          height: '30px',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Thao tác
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose} component={NavLink} to="/chinh-sua-thong-tin">
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa thông tin
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PeopleIcon fontSize="small" sx={{ mr: 1 }} /> Xem chi tiết khách hàng
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DescriptionIcon fontSize="small" sx={{ mr: 1 }} /> Xóa khách hàng
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionMenu;