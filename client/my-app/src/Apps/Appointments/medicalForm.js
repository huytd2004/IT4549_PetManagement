import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TextField, Box, Button, Typography, Divider, IconButton, useTheme,Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow } from '@mui/material';
import { tokens } from "../../theme";
import { getPetDetail, editListPet } from "../../service/petList.service";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
const MedicalForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { petId } = useParams();
    const [pet, setPet] = useState(null);

    const [formData, setFormData] = useState({
        ngay_kham: '',
        trieu_chung: '',
        chuan_doan: '',
        note: '',
        don_thuoc: [
            {
                stt: 1,
                ten_thuoc: '',
                mo_ta: '',
                so_luong: 1
            }
        ]
    });

    useEffect(() => {
        const fetchPet = async () => {
            const data = await getPetDetail(petId);
            setPet(data);
        };
        fetchPet();
    }, [petId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMedicineChange = (index, field, value) => {
        const newList = [...formData.don_thuoc];
        newList[index][field] = value;
        setFormData({ ...formData, don_thuoc: newList });
    };

    const handleAddMedicine = () => {
        setFormData({
            ...formData,
            don_thuoc: [
                ...formData.don_thuoc,
                {
                    stt: formData.don_thuoc.length + 1,
                    ten_thuoc: '',
                    mo_ta: '',
                    so_luong: 1
                }
            ]
        });
    };

    const handleRemoveMedicine = (index) => {
        const newList = [...formData.don_thuoc];
        newList.splice(index, 1);
        setFormData({ ...formData, don_thuoc: newList });
    };

    const handleSubmit = async () => {
        const newRecord = { ...formData };
        const updatedHoSo = [...(pet.ho_so_benh_an || []), newRecord];

        const updatedPet = {
            ...pet,
            ho_so_benh_an: updatedHoSo
        };

        try {
            await editListPet(petId, updatedPet);
            alert("Lưu hồ sơ thành công!");
            navigate('/appointments');
            setFormData({
                ngay_kham: '',
                trieu_chung: '',
                chuan_doan: '',
                note: '',
                don_thuoc: [
                    {
                        stt: 1,
                        ten_thuoc: '',
                        mo_ta: '',
                        so_luong: 1
                    }
                ]
            });
        } catch (error) {
            console.error("Lỗi khi lưu hồ sơ:", error);
            alert("Có lỗi xảy ra khi lưu!");
        }
    };

    return (
        <Box p={4} display="flex" gap={4}>
            {/* BÊN TRÁI - THÔNG TIN & ẢNH */}
            <Box width="40%">
                {pet && (
                    <>
                        <img
                            src={pet.image}
                            alt={pet.name}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                        <Typography variant="h6" mt={2}>
                            {pet.name} - {pet.species}
                        </Typography>
                        <Typography>Chủ: {pet.ower}</Typography>
                    </>
                )}
            </Box>

            {/* GẠCH NGĂN CÁCH */}
            <Divider orientation="vertical" flexItem />

            {/* BÊN PHẢI - FORM KHÁM BỆNH */}
            <Box flex={1}>
                <Typography variant="h4" gutterBottom>
                    Tạo hồ sơ khám bệnh
                </Typography>

                <Box display="flex" flexDirection="column" gap={2} mt={3}>
                    <TextField label="Ngày khám" name="ngay_kham" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                    <TextField label="Triệu chứng" name="trieu_chung" multiline onChange={handleChange} />
                    <TextField label="Chuẩn đoán" name="chuan_doan" multiline onChange={handleChange} />
                    <TextField label="Ghi chú" name="note" multiline onChange={handleChange} />
                    <Box display="flex" justifyContent="space-between" textAlign="center" alignItems="center">
                        <Typography variant="h5" mt={3} color={colors.greenAccent[500]}>
                            Kê đơn thuốc
                        </Typography>
                        <Button
                            color={colors.greenAccent[500]}
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddMedicine}
                        >
                            Thêm thuốc
                        </Button>
                    </Box>


                    <TableContainer component={Box} sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên thuốc</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell align="center">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData.don_thuoc.map((thuoc, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <TextField
                                                value={thuoc.ten_thuoc}
                                                onChange={(e) => handleMedicineChange(index, 'ten_thuoc', e.target.value)}
                                                fullWidth
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={thuoc.mo_ta}
                                                onChange={(e) => handleMedicineChange(index, 'mo_ta', e.target.value)}
                                                fullWidth
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={thuoc.so_luong}
                                                onChange={(e) => handleMedicineChange(index, 'so_luong', parseInt(e.target.value))}
                                                variant="standard"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleRemoveMedicine(index)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>



                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Lưu hồ sơ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MedicalForm;
