import {
    Box, Typography, Paper, Table, TableBody,
    TableCell, TableHead, TableRow,
    List, ListItemButton, ListItemIcon, ListItemText,
    Avatar, CircularProgress, useTheme
} from '@mui/material';
import { tokens } from "../../theme";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPetDetail } from '../../service/petList.service';
import Breadcrumb from '../../components/BreadCrumb';

// Import icon
import PetsIcon from '@mui/icons-material/Pets';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const menuItems = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: <PetsIcon /> },
    { id: 'medical', label: 'Hồ sơ bệnh án', icon: <MedicalInformationIcon /> },
    { id: 'status', label: 'Tình trạng hiện tại', icon: <MonitorHeartIcon /> },
    { id: 'diet', label: 'Chế độ ăn uống', icon: <RestaurantIcon /> }
];

function PetDetail() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    const breadcrumbItems = [
        { label: 'Thú cưng', path: '/pet' },
        { label: 'Thông tin chi tiết thú cưng', path: null }
    ];

    useEffect(() => {
        const fetchPetDetail = async () => {
            try {
                const data = await getPetDetail(id);
                setPet(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin thú cưng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPetDetail();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) {
        return <Typography>Không tìm thấy thú cưng</Typography>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <Box>
                        <Typography variant="h3" gutterBottom mb="30px">Thông tin chung</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ fontSize: "16px" }}><b>Tên:</b> {pet.name}</Typography>
                            <Typography sx={{ fontSize: "16px" }}><b>Giống:</b> {pet.breed}</Typography>
                            <Typography sx={{ fontSize: "16px" }}><b>Giới tính:</b> {pet.gender}</Typography>
                            <Typography sx={{ fontSize: "16px" }}><b>Ngày sinh:</b> {pet.dob}</Typography>
                        </Box>
                    </Box>
                );
            case 'medical':
                return (
                    <Box>
                        <Typography variant="h3" gutterBottom>Hồ sơ bệnh án</Typography>

                        {pet.ho_so_benh_an.map((record, idx) => (
                            <Box key={idx} sx={{ mb: 5, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h4" gutterBottom >
                                    Lần khám {idx + 1} -<span style={{ fontSize: '1.2rem', fontWeight: 'normal',color:colors.greenAccent[500] }}> Ngày khám: {record.ngay_kham}</span> 
                                </Typography>
                                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                                    <Typography sx={{fontSize:"16px"}}><b>Triệu chứng:</b><span style={{fontSize:"15px",marginLeft:"10px"}}> {record.trieu_chung}</span></Typography>
                                    <Typography sx={{fontSize:"16px"}}><b>Chuẩn đoán:</b><span style={{fontSize:"15px",marginLeft:"10px"}}>{record.chuan_doan}</span> </Typography>
                                    <Typography sx={{fontSize:"16px"}}><b>Tiền sử bệnh lý:</b><span style={{fontSize:"15px",marginLeft:"10px"}}>{record.tien_su_benh_ly}</span>  </Typography>
                                    <Typography sx={{fontSize:"16px"}}><b>Note:</b><span style={{fontSize:"15px",marginLeft:"10px"}}> {record.note}</span></Typography>
                                </Box>

                                <Typography variant="h4" gutterBottom mt={3}>Đơn thuốc</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontSize:"14px"}}><b>STT</b></TableCell>
                                            <TableCell sx={{fontSize:"14px"}}><b>Tên thuốc</b></TableCell>
                                            <TableCell sx={{fontSize:"14px"}}><b>Mô tả</b></TableCell>
                                            <TableCell sx={{fontSize:"14px"}}><b>Số lượng</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {record.don_thuoc.map((thuoc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{thuoc.stt}</TableCell>
                                                <TableCell>{thuoc.ten_thuoc}</TableCell>
                                                <TableCell>{thuoc.mo_ta}</TableCell>
                                                <TableCell>{thuoc.so_luong}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        ))}
                    </Box>
                );

            case 'status':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Tình trạng hiện tại</Typography>
                        <Typography>Chưa cập nhật</Typography>
                    </Box>
                );
            case 'diet':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>Chế độ ăn uống</Typography>
                        <Typography><b>Chế độ:</b> {pet.diet.mode}</Typography>
                        <Typography><b>Áp dụng:</b> {pet.diet.applyTime}</Typography>

                        {['sáng', 'trưa', 'tối'].map((bua) => (
                            <Box key={bua} mt={2}>
                                <Typography fontWeight="bold">{`Bữa ${bua}:`}</Typography>
                                {pet.diet.meals[bua].length > 0 ? (
                                    <ul>
                                        {pet.diet.meals[bua].map((item) => (
                                            <li key={item.id}>
                                                {item.tenThucPham} - {item.soLuong} {item.donViTinh} ({item.moTa})
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Thông tin chi tiết của thú cưng</Typography>

                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        mt: 3,
                        borderRadius: 3,
                        overflow: 'hidden',
                        minHeight: 400
                    }}
                >
                    {/* Cột trái */}
                    <Box
                        sx={{
                            width: 280,
                            bgcolor: colors.primary[400],
                            borderRight: '1px solid #ddd',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 3,
                            px: 2
                        }}
                    >
                        <Avatar
                            src={pet.image}
                            sx={{ width: 230, height: 230, mb: 2 }}
                        />
                        <List sx={{ width: '100%' }}>
                            {menuItems.map((item) => (
                                <ListItemButton
                                    key={item.id}
                                    selected={activeTab === item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    sx={{
                                        borderRight: activeTab === item.id ? '4px solid #1976d2' : '4px solid transparent',
                                        borderRadius: 1,
                                        mb: 1,
                                        '& .MuiListItemIcon-root': {
                                            color: activeTab === item.id ? '#1976d2' : 'inherit'
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: activeTab === item.id ? '#1976d2' : 'inherit',
                                            fontWeight: activeTab === item.id ? 'bold' : 'normal'
                                        }
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>

                    {/* Cột phải */}
                    <Box sx={{ flex: 1, p: 4, bgcolor: colors.primary[400] }}>
                        {renderContent()}
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default PetDetail;
