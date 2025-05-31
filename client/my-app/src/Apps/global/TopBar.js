import { Box, IconButton, useTheme,Button,Stack } from "@mui/material";
import { useContext} from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { getCookie } from "../../helper/cookies.helper";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountMenu from "../../components/menu";
function TopBar() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const isDarkMode = theme.palette.mode === "dark";

    const token = getCookie("token");
    console.log(token)
  return (
    <>
    <Box 
       display="flex" 
       justifyContent="space-between" p={2} 
       sx={{
        borderBottom: `1px solid ${colors.grey[500]}`
       }} 
    >
      
      {/* SEARCH BAR */}
      <Box display="flex" gap="10px">
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      

      {/* ICONS */}
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <Box display="flex" gap="10px 0">
          <IconButton onClick={colorMode.toggleColorMode}>
            {isDarkMode ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <AccountMenu sx={{m:0,p:0}}/>
        </Box>

        {token ? (<></>):(
          <Box ml="10px">
              {/* Login */}
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color={colors.primary[400]} component={Link} to="/login">
                  Login
                </Button>
                <Button variant="contained" color={colors.primary[400]} component={Link} to="/register">
                  Register
                </Button>
              </Stack>
          </Box>
        )}
      </Box>
      
    </Box>
    </>
    
  );
}

export default TopBar;
