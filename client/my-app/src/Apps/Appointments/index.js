import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from "@mui/material";
import { tokens } from "../../theme";
import ClassTable from "../../components/Table";
import { getListPet, getPetDetail } from "../../service/petList.service";
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const Appointments = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    //điều hướng sang trang khám bệnh
    const handleMedicalExamination = (id) => {
        navigate(`/medical-form/${id}`); // trang tạo hồ sơ khám bệnh
    };
    // Dữ liệu cột
    const dataHeader = [
        { field: "id", headerName: "id" },
        { field: "name", headerName: "Tên thú cưng", disableSearch: 'search' },
        { field: "ower", headerName: "Chủ nuôi" },
        { field: "time", headerName: "Giờ hẹn" },
        {
            field: 'thaoTac',
            headerName: 'Thao tác',
            renderCell: (params) => {
                const rowId = params.id;
                const row = dataListPet.find((item) => item.id === rowId);
                if (!row) return null;

                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                        gap="15px"
                        sx={{ cursor: 'pointer' }}
                        textAlign="center"
                        alignItems="center"
                    >
                        <VisibilityIcon
                            sx={{ color: '#0D81ED' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(row.id);
                            }}
                        />
                        <LocalHospitalIcon
                            sx={{ color: '#C02135' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMedicalExamination(row.id);
                            }}
                        />
                    </Box>
                );
            }

        }
    ];

    // State
    const [dataListPet, setDataListPet] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [petDetail, setPetDetail] = useState(null);

    // Lấy dữ liệu danh sách thú cưng
    const fetchApi = async () => {
        try {
            const response = await getListPet();
            setDataListPet(response);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thú cưng:", error);
        }
    };
    console.log(dataListPet)
    useEffect(() => {
        fetchApi();
    }, []);

    // Mở dialog xem chi tiết
    const handleOpenDetail = async (id) => {
        try {
            const detail = await getPetDetail(id);
            setPetDetail(detail);
            setOpenDialog(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết thú cưng:", error);
        }
    };

    // Đóng dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPetDetail(null);
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', margin: "20px 12px", borderRadius: '8px', gap: '12px', bgcolor: colors.primary[400] }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}
                >
                    Danh sách lịch hẹn
                </Typography>
            </Box>

            <Box padding="14px" gap="12px" borderRadius="8px" bgcolor={colors.primary[400]} marginTop="20px" m="12px">
                <ClassTable
                    columns={dataHeader}
                    rows={dataListPet}
                    allowSearching
                />
            </Box>

            {/* Dialog xem chi tiết */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Hồ sơ bệnh án</DialogTitle>
                <DialogContent>
                    {petDetail && (
                        <Box display="flex" flexDirection="column" gap={4}>
                            {petDetail.ho_so_benh_an?.map((hoSo, index) => (
                                <Box key={index} display="flex" gap={3} flexDirection="row">
                                    {/* Bên trái: Ảnh thú cưng */}
                                    <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                                        <img
                                            src={petDetail.image}
                                            alt="pet"
                                            style={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                borderRadius: "12px",
                                                objectFit: "cover",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                    </Box>

                                    {/* Gạch dọc ngăn cách */}
                                    <Divider orientation="vertical" flexItem />

                                    {/* Bên phải: Thông tin bệnh án */}
                                    <Box flex="2" display="flex" flexDirection="column" gap={2}>
                                        <Typography variant="h6" fontWeight="bold">Hồ sơ bệnh án {index + 1}</Typography>
                                        <Typography><strong>Ngày khám:</strong> {hoSo.ngay_kham}</Typography>
                                        <Typography><strong>Triệu chứng:</strong> {hoSo.trieu_chung}</Typography>
                                        <Typography><strong>Chuẩn đoán:</strong> {hoSo.chuan_doan}</Typography>
                                        <Typography><strong>Tiền sử bệnh lý:</strong> {hoSo.tien_su_benh_ly}</Typography>
                                        <Typography><strong>Ghi chú:</strong> {hoSo.note}</Typography>

                                        {/* Bảng thuốc */}
                                        {hoSo.don_thuoc && (
                                            <Box mt={2}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Đơn thuốc
                                                </Typography>
                                                <Box component="table" width="100%" sx={{ borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>STT</th>
                                                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tên thuốc</th>
                                                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mô tả</th>
                                                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Số lượng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {hoSo.don_thuoc.map((thuoc) => (
                                                            <tr key={thuoc.stt}>
                                                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{thuoc.stt}</td>
                                                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{thuoc.ten_thuoc}</td>
                                                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{thuoc.mo_ta}</td>
                                                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{thuoc.so_luong}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Appointments;