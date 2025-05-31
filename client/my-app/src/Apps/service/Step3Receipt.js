import { Box, Button, Typography, Divider } from "@mui/material";
import { jsPDF } from "jspdf";

const Step3Receipt = ({ formData }) => {
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("PHIẾU ĐĂNG KÝ DỊCH VỤ", 70, 20);

    doc.setFontSize(12);
    let y = 40;
    const lines = [
      `Tên dịch vụ: ${formData.petService}`,
      `Tên thú cưng: ${formData.petName}`,
      `Email: ${formData.email}`,
      `Số điện thoại: ${formData.phone}`,
      `Ngày đăng ký: ${formData.date || "Không rõ"}`,
      formData.startDate ? `Thời gian bắt đầu: ${formData.startDate}` : "",
      formData.endDate ? `Thời gian kết thúc: ${formData.endDate}` : "",
      `Loại phòng: ${formData.roomType || "Không áp dụng"}`,
      `Lời nhắn: ${formData.message || "Không có"}`,
      `Số tiền: 500.000 VNĐ`,
      `Trạng thái thanh toán: ${formData.paymentStatus}`,
      `Phương thức thanh toán: ${formData.paymentMethod}`,
    ];

    lines.forEach((line) => {
      if (line) {
        doc.text(line, 20, y);
        y += 10;
      }
    });

    doc.save("phieu-dang-ky.pdf");
  };

  return (
    <Box 
      maxWidth={550}
      mx="auto"
      p={3}
      display="flex"
      flexDirection="column"
      gap={2}
      border="1px solid #ccc"
      borderRadius={2}
      boxShadow={2}
    >
      <Typography variant="h5" gutterBottom>
        Phiếu đăng ký dịch vụ
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography><strong>Tên dịch vụ:</strong> {formData.petService}</Typography>
      <Typography><strong>Tên thú cưng:</strong> {formData.petName}</Typography>
      <Typography><strong>Email:</strong> {formData.email}</Typography>
      <Typography><strong>Số điện thoại:</strong> {formData.phone}</Typography>
      {formData.startDate && <Typography><strong>Thời gian bắt đầu:</strong> {formData.startDate}</Typography>}
      {formData.endDate && <Typography><strong>Thời gian kết thúc:</strong> {formData.endDate}</Typography>}
      {formData.roomType && <Typography><strong>Loại phòng:</strong> {formData.roomType}</Typography>}
      <Typography><strong>Ngày đăng ký:</strong> {formData.date}</Typography>
      <Typography><strong>Lời nhắn:</strong> {formData.message || "Không có"}</Typography>
      <Typography><strong>Số tiền:</strong> 500.000 VNĐ</Typography>
      <Typography><strong>Trạng thái thanh toán:</strong> {formData.paymentStatus}</Typography>
      <Typography><strong>Phương thức thanh toán:</strong> {formData.paymentMethod}</Typography>

      <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
        <Button variant="outlined" color="secondary">
          Quay lại
        </Button>
        <Button variant="outlined" color="secondary"  onClick={handleDownloadInvoice}>
          Tải hóa đơn
        </Button>
      </Box>
    </Box>
  );
};

export default Step3Receipt;
