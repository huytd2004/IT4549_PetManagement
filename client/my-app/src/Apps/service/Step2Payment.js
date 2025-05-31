import { Box, Button, Typography, Divider, RadioGroup, FormControlLabel, Radio, Snackbar, Alert } from "@mui/material";
import { useState } from "react";

const Step2Payment = ({ formData, setFormData, onNext }) => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handlePayNow = () => {
    setFormData({
      ...formData,
      paymentMethod,
      paymentStatus: "Đã thanh toán"
    });

    setSnackbar({ open: true, message: "Thanh toán thành công!", severity: "success" });

    setTimeout(() => {
      onNext();
    }, 1500);
  };

  const handleNextWithoutPayment = () => {
    setFormData({
      ...formData,
      paymentMethod,
      paymentStatus: "Chưa thanh toán"
    });

    onNext(); // không cần delay nếu không thanh toán
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
      <Typography variant="h4" gutterBottom>
        Thanh toán dịch vụ
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Typography variant="body1"><strong>Tên dịch vụ:</strong> {formData.petService}</Typography>
      <Typography variant="body1"><strong>Tên thú cưng:</strong> {formData.petName}</Typography>
      <Typography variant="body1"><strong>Số tiền:</strong> 300.000 VNĐ</Typography>

      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>Chọn phương thức thanh toán:</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="momo" control={<Radio />} label="Ví MoMo" />
          <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
          <FormControlLabel value="cash" control={<Radio />} label="Tiền mặt khi đến" />
        </RadioGroup>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
        <Button variant="outlined" color="secondary" onClick={handlePayNow}>
          Thanh toán ngay
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextWithoutPayment}>
          Tiếp tục
        </Button>
        
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Step2Payment;
