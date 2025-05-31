import { useState } from "react";
import Header from "../../components/header";
import { Box, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import Person2Icon from '@mui/icons-material/Person2';
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../../components/LineChart";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
function Dashboard() {
    const [tabValue, setTabValue] = useState(0); // 0 = Ngày, 1 = Tuần, 2 = Tháng
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <>
            <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

                    {/* Tab ngày tuần tháng */}
                    <Box
                        sx={{
                            bgcolor: colors.primary[400],
                            borderRadius: '8px',
                            display: 'inline-block',
                            p: '4px',
                        }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)} 
                            TabIndicatorProps={{ style: { display: 'none' } }}
                            sx={{
                                minHeight: 0,
                                '& .MuiTab-root': {
                                    fontSize:16,
                                    textTransform: 'none',
                                    minHeight: 0,
                                    minWidth: 64,
                                    px: 2,
                                    py: 1,
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    color: colors.grey[200],
                                    
                                },
                                '& .Mui-selected': {
                                    bgcolor: colors.primary[300],
                                    color:  colors.grey[800],
                                },
                            }}
                        >
                            <Tab label="Ngày"/>
                            <Tab label="Tuần" />
                            <Tab label="Tháng" />
                        </Tabs>
                    </Box>
                </Box>
                {/* GRID & CHARTS */}
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                    {/* ROW1 */}
                    <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" } }} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <Box width="100%" m="0 85px 0 30px">
                            <Box display="flex" justifyContent="space-between">
                                <MonetizationOnIcon sx={{ color: colors.greenAccent[600], fontSize: "60px" }} />
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }} >
                                        {tabValue === 0 && "5,000$"}
                                        {tabValue === 1 && "10,000$"}
                                        {tabValue === 2 && "100,000$"}
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: colors.greenAccent[500], mt: 1 }} >
                                        Doanh thu
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" } }} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <Box width="100%" m="0 85px 0 30px">
                            <Box display="flex" justifyContent="space-between">
                                <LegendToggleIcon sx={{ color: colors.greenAccent[600], fontSize: "60px" }} />
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }} >
                                        {tabValue === 0 && "+ 5.67%"}
                                        {tabValue === 1 && "+ 14.68%"}
                                        {tabValue === 2 && "+ 25.69%"}
                                       
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: colors.greenAccent[500], mt: 1 }} >
                                        Lợi nhuận
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" } }} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <Box width="100%" m="0 85px 0 30px">
                            <Box display="flex" justifyContent="space-between">
                                <InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "60px" }} />
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }} >
                                        {tabValue === 0 && "100"}
                                        {tabValue === 1 && "1,393"}
                                        {tabValue === 2 && "10,309"}
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: colors.greenAccent[500], mt: 1 }} >
                                        Đặt hàng
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" } }} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <Box width="100%" m="0 85px 0 30px">
                            <Box display="flex" justifyContent="space-between">
                                <Person2Icon sx={{ color: colors.greenAccent[600], fontSize: "60px" }} />
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }} >
                                        {tabValue === 0 && "89"}
                                        {tabValue === 1 && "503"}
                                        {tabValue === 2 && "4675"}
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: colors.greenAccent[500], mt: 1 }} >
                                        Khánh hàng
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* ROW-2 */}
                    <Box
                        sx={{
                            gridColumn: {
                                xs: "span 12",
                                sm: "span 12",
                                md: "span 8",
                                lg: "span 8"
                            },
                            height: "600px"
                        }}
                        backgroundColor={colors.primary[400]}
                    >
                        <Box
                            mt="35px"
                            p="0 50px"
                            display="flex "
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="600"
                                    color={colors.grey[100]}
                                >
                                    Doanh thu theo tuần
                                </Typography>
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color={colors.greenAccent[500]}
                                >
                                    5000000VND
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton>
                                    <DownloadOutlinedIcon
                                        sx={{ fontSize: "40px", color: colors.greenAccent[500] }}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <BarChart mb="0px" />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            gridColumn: {
                                xs: "span 12",
                                sm: "span 12",
                                md: "span 4",
                                lg: "span 4"
                            },
                            display: "grid",
                            gridTemplateRows: "1fr 1fr",
                            flexDirection: "column",
                            gap: "20px",
                            height: { xs: "auto", md: "400px" }
                        }}
                    >
                        {/* Top item in right column */}
                        <Box
                            display="flex"
                            backgroundColor={colors.primary[400]}
                            alignItems="center"
                            justifyContent="center"
                            p="15px"
                        >
                            <Box height="300px">
                                <PieChart />
                            </Box>
                        </Box>

                        {/* Bottom item in right column */}
                        <Box
                            display="flex"
                            backgroundColor={colors.primary[400]}
                            alignItems="center"
                            justifyContent="center"
                            p="15px"
                        >
                            <Box height="305px" width="100%" mt="5px">
                                <LineChart />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

        </>
    )
}
export default Dashboard;