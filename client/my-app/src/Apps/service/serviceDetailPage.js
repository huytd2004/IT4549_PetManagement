import Header from "../../components/header";
import Breadcrumb from "../../components/BreadCrumb";
import { tokens } from "../../theme";
import { useTheme, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { getListService } from "../../service/service.service";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
const ServiceDetailPage = () => {
    const { id } = useParams();
    console.log(id)
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Dịch vụ/chi tiết', path: null }
    ];
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    // lấy thông tin chi tiết dịch vụ
    const [dataServices, setDataServices] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListService();
            setDataServices(response);
        }
        fetchApi();
    }, []);
    // console.log(dataServices)
    const service = dataServices.find(s => s.list_id === id);
    console.log(service)
    if (!service) return <p>Không tìm thấy dịch vụ</p>;

    const thumbImages = [service.images, ...(service.detail?.thumbline || [])];
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="5px 20px">
                <Header subtitle={service.title} />
            </Box>

            {/* Row1_nội dung */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" m="5px 20px" mb="20px">
                <Box sx={{ gridColumn: { xs: "span 8", sm: "span 8", md: "span 8", lg: "span 8" } }}
                    backgroundColor={colors.primary[400]}
                >
                    <Swiper
                        style={{
                            "--swiper-navigation-color": colors.grey[100],
                            "--swiper-pagination-color": colors.grey[100]
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2"
                    >
                        {thumbImages.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <img
                                    src={img}
                                    alt={`main-${idx}`}
                                    style={{
                                        width: '100%',
                                        maxHeight:450,
                                        objectFit: 'cover',
                                        borderRadius: 10
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                        style={{ marginTop: 10 }}
                    >
                        {thumbImages.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <img
                                    src={img}
                                    alt={`thumb-${idx}`}
                                    style={{
                                        width: '100%',
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 6,
                                        cursor: 'pointer'
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box sx={{ gridColumn: { xs: "span 4", sm: "span 4", md: "span 4", lg: "span 4" } }} backgroundColor={colors.primary[400]}>
                    <Box elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}  backgroundColor={colors.primary[400]}>
                        <Typography variant="h3" fontWeight="bold" mb={2}>
                            {service.title}
                        </Typography>
                        <Typography mb={2} variant="h5" fontWeight="300">
                            Mô tả: {service.detail?.description || "Không có mô tả"}
                        </Typography>
                        <Typography fontWeight="bold" color={colors.greenAccent[500]} mb={3} variant="h5">
                            Giá: {service.detail?.price || "Liên hệ"}
                        </Typography>

                        <Button
                            mt="30px"
                            color="secondary" 
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => navigate(`/service/register`)}
                        >
                            Đăng ký dịch vụ
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
export default ServiceDetailPage;