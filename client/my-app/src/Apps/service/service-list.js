
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/header";
import { Box, CardMedia, useTheme, Card, Button, CardActions } from "@mui/material";
import { useState, useEffect } from "react";
import { getListService } from "../../service/service.service";
import { tokens } from "../../theme";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
function ServiceList() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Dịch vụ', path: null }
    ];
    const navigate = useNavigate();
    //goị API lấy dánh sách dịch vụ
    const [dataServices, setDataServices] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListService();
            setDataServices(response);
        }
        fetchApi();
    }, []);
    // console.log(dataServices)
    

    // ---------------Phần phân trang dịch vụ-----------------------
    const limit = 6;
    //đặt 1 biến để khi click sang các trang,ví dụ như trang 1,2,3
    const [pageActive,setPageActive] = useState(0);

    //đặt 1 biến chứa số lượng các trang
    const [qualityPage,setQualityPage] = useState(0)


    useEffect(()=>{
        const fetchApi = async()=>{
            fetch(`http://localhost:4000/service_list?_start=${pageActive*limit}&_limit=${limit}`)
            .then(res =>res.json())
            .then(data =>{
                setDataServices(data);
                setQualityPage(Math.ceil(10/limit));
            })
        }
        fetchApi();
    },[pageActive]);
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="5px 20px">
                <Header subtitle="Dịch vụ của chúng tôi" />
            </Box>
            {/* danh sách các dịch vụ */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" m="5px 20px">
                {dataServices.map((item, index) => (
                    <Box
                        sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 4", lg: "span 4" } }}
                        backgroundColor={colors.primary[400]}
                        display="flex" alignItems="center"
                        justifyContent="center"
                        key={index}
                    >
                        <Card sx={{ backgroundColor: colors.primary[400], width: "100%", position: "relative", overflow: "hidden" }}>
                            <CardMedia
                                component="img"
                                image={item.images}
                                alt="title"
                                sx={{ height: "200px", objectFit: "cover" }}
                            />
                            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 1,paddingTop:'25px' }}>
                                <Button
                                    variant="outlined"
                                    color={colors.greenAccent[500]}
                                    size="medium"
                                    sx={{ textTransform: "none", fontWeight: 500,fontSize:'14px'}}
                                    onClick={() => navigate(`/service/${item.list_id}`)}
                                >
                                    Xem chi tiết
                                </Button>
                                <Button
                                    variant="contained"
                                    color={colors.primary[400]}
                                    size="medium"
                                    sx={{ textTransform: "none", fontWeight: 500,fontSize:'14px' }}
                                    onClick={() => navigate(`/service/register`)}
                                >
                                    Đăng ký
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </Box>
            {/* end danh sách dịch vụ */}
            
            {/* Pagination */}
            <Stack spacing={2} margin="25px 0" alignItems="center">
                <Pagination
                    count={qualityPage}
                    page={pageActive + 1} // Vì Pagination page bắt đầu từ 1
                    onChange={(event, value) => setPageActive(value - 1)} // Trừ 1 vì state pageActive đang bắt đầu từ 0
                    size="large"
                />
            </Stack>
            {/* end pagination */}

        </>
    )
}
export default ServiceList;