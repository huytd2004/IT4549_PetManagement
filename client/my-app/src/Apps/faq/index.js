import { Box, useTheme } from "@mui/material";
import Header from "../../components/header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Breadcrumb from "../../components/BreadCrumb";
const FAQ = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'faq', path: null }
    ];
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="20px">
                <Header subtitle="Các câu hỏi thường gặp về vấn đề thú cưng" />
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            Thú cưng nên khám sức khỏe định kỳ bao lâu một lần?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Thú cưng nên được kiểm tra sức khỏe định kỳ mỗi 6 tháng đến 1 năm để phát hiện sớm các vấn đề tiềm ẩn và tiêm phòng đầy đủ theo lịch trình.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            Cắt tỉa lông thú cưng có cần thiết không?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Việc cắt tỉa lông định kỳ giúp thú cưng sạch sẽ, giảm nguy cơ ve rận, rối lông và giữ cho thú thoải mái hơn, đặc biệt trong thời tiết nóng.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            Dịch vụ spa cho thú cưng bao gồm những gì?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Gói spa bao gồm tắm gội, massage, vệ sinh tai, cắt móng, làm thơm và có thể thêm các dịch vụ chăm sóc da, dưỡng lông tùy theo nhu cầu.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            Khi nào nên đưa thú cưng đến bác sĩ thú y?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Nếu thú cưng có biểu hiện mệt mỏi, bỏ ăn, tiêu chảy, sốt, thay đổi hành vi hoặc bất kỳ dấu hiệu lạ nào kéo dài hơn 24 giờ, hãy đưa đến bác sĩ thú y ngay.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            Tôi có thể đặt lịch chăm sóc cho thú cưng như thế nào?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Bạn có thể đăng ký lịch trực tuyến tại mục "Đăng ký dịch vụ" trên hệ thống, chọn dịch vụ mong muốn, thời gian phù hợp và để lại thông tin liên hệ.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

            </Box>
        </>
    );

};

export default FAQ;
