import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import { tokens } from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { getCookie } from "../../helper/cookies.helper";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import BadgeIcon from '@mui/icons-material/Badge';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      component={
        <NavLink
          to={to}
          style={({ isActive }) => ({
            color: isActive ? colors.blueAccent[100] : colors.grey[100],
            textDecoration: 'none',
          })}
          onClick={() => setSelected(title)}
        />
      }
      icon={icon}
      active={selected === title}
    >
      <Typography sx={{ fontSize: '15px' }}>{title}</Typography>
    </MenuItem>
  );
};

const NavBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const role = getCookie("role");
  // console.log(role)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box sx={{
      "& .ps-sidebar-container": {
        background: `${colors.primary[400]} !important`,
      },
      "& .ps-menu-button": {
        backgroundColor: "transparent !important",
      },
      "& .ps-menu-button:hover": {
        color: "#868dfb !important",
      },
      "& .ps-menu-button.active": {
        color: "#6870fa !important",
      },
      "& .ps-submenu-content": { // Thêm style cho nội dung SubMenu
        backgroundColor: `${colors.primary[400]} !important`,
      },
      "& .ps-submenu-root": { // Thêm style cho root của SubMenu
        backgroundColor: "transparent !important",
      },
      display: "flex",
      height: "100vh"
    }}>
      <Sidebar
        collapsed={isCollapsed}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box>
                  <img src="../../assets/logo.png" alt="logo" width="120px" />
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "5%"} fontSize="15px">
            {role === "admin" && (
              <>
                <Item
                  title="Dashboard"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <SubMenu label="Quản lý" icon={<AdminPanelSettingsIcon />}>
                  <Item
                    title="Quản lý khách hàng"
                    to="/manage/customers"
                    icon={<GroupIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Quản lý nhân viên"
                    to="/manage/staff"
                    icon={<BadgeIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Quản lý thú cưng"
                    to="/manage/pets"
                    icon={<PetsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Quản lý dịch vụ"
                    to="/manage/service"
                    icon={<DesignServicesIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
                <Item
                  title="Lịch dịch vụ"
                  to="/calendar"
                  icon={<CalendarMonthOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Quản lý lưu trú"
                  to="/stay-manage"
                  icon={<HotelOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Lịch sử khám bệnh"
                  to="/medical-history"
                  icon={<VaccinesOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Đơn đăng ký dịch vụ"
                  to="/service-requests"
                  icon={<AssignmentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Thống kê - Báo cáo"
                  to="/statistics"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Phân quyền / Tài khoản"
                  to="/account-manage"
                  icon={<ManageAccountsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {role === "user" && (
              <>
                <Item
                  title="Thú cưng"
                  to="/pet"
                  icon={<PetsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <SubMenu label="Dịch vụ" icon={<MiscellaneousServicesIcon />}>
                  <Item
                    title="Đăng ký dịch vụ"
                    to="/service/list"
                    icon={<HowToRegIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Lịch sử đăng ký"
                    to="/service/history"
                    icon={<HistoryIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Bảng giá dịch vụ"
                    to="/service/price"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
                <Item
                  title="Contacts Information"
                  to="/contacts"
                  icon={<ContactsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Calendar"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="FAQ Page"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {role === "DOCTOR" && (
              <>
                <Item
                  title="Lịch khám"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Danh sách lịch hẹn"
                  to="/appointments"
                  icon={<EventNoteOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Khám bệnh"
                  to="/examinations"
                  icon={<LocalHospitalOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Hồ sơ thú cưng"
                  to="/pets"
                  icon={<PetsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Chủ nuôi"
                  to="/owners"
                  icon={<PersonOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Báo cáo khám"
                  to="/reports"
                  icon={<AssignmentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

              </>
            )}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default NavBar;
