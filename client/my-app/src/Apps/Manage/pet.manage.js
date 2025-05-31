import Breadcrumb from "../../components/BreadCrumb";
import {
    Box, Typography, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControlLabel, Radio, FormControl, FormLabel, RadioGroup, DialogContentText
} from "@mui/material";
import { tokens } from "../../theme";
import AddIcon from '@mui/icons-material/Add';
import ClassTable from "../../components/Table";
import { Edit as EditIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState, useEffect } from "react";
import { getPetManage, createPetManage, deletePetManage, editPetManage } from "../../service/pet.service";
const PetManage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //Phần chuyển trang
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Quản lý thú cưng', path: null }
    ];
    // lấy dữ liệu cột
    const dataHeader = [
        { field: "id", headerName: "id" },
        { field: "tenThuCung", headerName: "Tên thú cưng", disableSearch: 'search' },
        { field: "chungLoai", headerName: "Chủng loại" },
        { field: "tuoi", headerName: "Tuổi" },
        { field: "gioiTinh", headerName: "Gioi tính" },
        { field: "canNang", headerName: "Cân nặng" },
        { field: "idKhachHang", headerName: "ID khách hàng" },
        {
            field: 'thaoTac',
            headerName: 'Thao tác',
            renderCell: (row) => (
                <Box display="flex" justifyContent="center" gap="15px" sx={{ cursor: 'pointer' }} textAlign="center" alignItems="center">
                    <RemoveRedEyeIcon sx={{ color: "#5C606D" }} />
                    <EditIcon sx={{ color: '#0D81ED' }} onClick={() => handleOpenEditDialog(row)} />
                    <DeleteIcon
                        sx={{ color: "#C02135" }}
                        onClick={() => handleOpenDeleteDialog(row.id)}
                    />
                </Box>
            )
        }
    ]
    // lấy dữ liệu hàng
    const [dataPet, setDataPet] = useState([]);
    const fetchApi = async () => {
        const response = await getPetManage();
        setDataPet(response);
    };

    useEffect(() => {
        fetchApi();
    }, []);
    console.log(dataPet)
    //-----------------
    // hiển thị dialog tạo mới thus cưng
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        tenThuCung: "",
        image: "",
        chungLoai: "",
        tuoi: "",
        gioiTinh: "Đực",
        canNang: "",
        idKhachHang: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddPet = async () => {
        try {
            await createPetManage(formData);
            setOpenDialog(false);
            setFormData({ // ✅ Reset form
                tenThuCung: '',
                image: '',
                chungLoai: '',
                tuoi: '',
                gioiTinh: '',
                canNang: '',
                idKhachHang: ''
            });
            // Gọi lại API để cập nhật bảng
            const updatedList = await getPetManage();
            setDataPet(updatedList);
        } catch (error) {
            console.error("Lỗi khi thêm thú cưng:", error);
        }

    };
    //--------------xóa 1 thú cưng--------------
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    //mở và đóng dialog xóa thú cưng
    const handleOpenDeleteDialog = (id) => {
        setSelectedPetId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedPetId(null);
    };
    //hàm xác nhận xóa
    const handleDelete = async () => {
        if (selectedPetId) {
            await deletePetManage(selectedPetId);
            setDataPet((prev) => prev.filter((pet) => pet.id !== selectedPetId));
            handleCloseDeleteDialog();
        }
    };
    //----------------chỉnh sửa pet-----------------
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: '',
        tenThuCung: '',
        pet_image: '',
        chungLoai: '',
        tuoi: '',
        gioiTinh: '',
        canNang: '',
        idKhachHang: '',
    });
    // mở đóng dialog chỉnh sửa
    const handleOpenEditDialog = (pet) => {
        setEditFormData(pet);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setEditFormData({
            id: '',
            tenThuCung: '',
            pet_image: '',
            chungLoai: '',
            tuoi: '',
            gioiTinh: '',
            canNang: '',
            idKhachHang: '',
        });
    };
    // xử lý thay đổi và chỉnh sửa cập nhật
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEdit = async () => {
        const res = await editPetManage(editFormData.id, editFormData);
        //     if (res?.success) {
        //         // Nếu API trả về thành công
        //         setDataPet((prev) =>
        //             prev.map((pet) =>
        //                 pet.id === editFormData.id ? editFormData : pet
        //             )
        //         );
        //         handleCloseEditDialog();
        //         // Thông báo
        //         alert("Cập nhật thành công!");
        //     } else {
        //         alert("Cập nhật thất bại. Vui lòng thử lại.");
        //     }
        // } catch (error) {
        //     console.error("Error editing pet:", error);
        //     alert("Có lỗi xảy ra. Vui lòng thử lại.");
        // }
        // Cập nhật bảng
        setDataPet((prev) =>
            prev.map((pet) =>
                pet.id === editFormData.id ? editFormData : pet
            )
        );
        handleCloseEditDialog();
    };
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', margin: "5px 12px", borderRadius: '8px', gap: '12px', bgcolor: colors.primary[400] }}
            >
                {/* Tiêu đề onClick={() => handleOpen()}*/}
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}
                >
                    Quản lý vật nuôi
                </Typography>
                {/* Nút Thêm lớp học mới */}
                <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        textTransform: 'none',
                        borderRadius: '999px',
                        paddingX: 2,
                        fontWeight: 400,
                        fontSize: "16px"
                    }}
                >
                    <AddIcon sx={{ fontSize: 20, mr: 1 }} />
                    Thêm thú cưng mới
                </Button>
            </Box>
            <Box padding="14px" gap="12px" borderRadius="8px" bgcolor={colors.primary[400]} marginTop="20px" m="12px">
                <ClassTable columns={dataHeader} rows={dataPet} allowSearching />
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ fontSize: "20px" }}>Thêm thú cưng mới</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Tên thú cưng" name="tenThuCung" value={formData.tenThuCung} onChange={handleInputChange} />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>URL ảnh thú cưng</FormLabel>
                        <TextField
                            name="pet_image"
                            value={formData.pet_image}
                            onChange={handleInputChange}
                            placeholder="Dán đường dẫn hình ảnh"
                            size="small"
                        />
                    </FormControl>
                    {formData.pet_image && (
                        <Box mt={1}>
                            <img
                                src={formData.pet_image}
                                alt="Preview"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 8 }}
                            />
                        </Box>
                    )}
                    <TextField fullWidth margin="dense" label="Chủng loại" name="chungLoai" value={formData.chungLoai} onChange={handleInputChange} />
                    <TextField fullWidth margin="dense" label="Tuổi" name="tuoi" value={formData.tuoi} onChange={handleInputChange} type="number" />
                    <TextField fullWidth margin="dense" label="Cân nặng (kg)" name="canNang" value={formData.canNang} onChange={handleInputChange} type="number" />
                    <TextField fullWidth margin="dense" label="ID khách hàng" name="idKhachHang" value={formData.idKhachHang} onChange={handleInputChange} type="number" />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>Giới tính</FormLabel>
                        <RadioGroup
                            row
                            name="gioiTinh"
                            value={formData.gioiTinh}
                            onChange={handleInputChange}
                        >
                            <FormControlLabel value="Đực" control={<Radio />} label="Đực" />
                            <FormControlLabel value="Cái" control={<Radio />} label="Cái" />
                            <FormControlLabel value="Không xác định" control={<Radio />} label="Không xác định" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleAddPet}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* xóa thú cưng */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle sx={{ fontSize: "24px" }}>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: "20px" }}>
                        Bạn có chắc chắn muốn xóa thú cưng này? <br />
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* edit thú cưng */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: "20x" }}>Chỉnh sửa thú cưng</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="tenThuCung"
                        label="Tên thú cưng"
                        fullWidth
                        value={editFormData.tenThuCung}
                        onChange={handleEditInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>URL ảnh thú cưng</FormLabel>
                        <TextField
                            name="pet_image"
                            value={editFormData.pet_image}
                            onChange={handleEditInputChange}
                            placeholder="Dán đường dẫn hình ảnh"
                            size="small"
                            fullWidth
                        />
                    </FormControl>

                    {editFormData.pet_image && (
                        <Box mt={1}>
                            <img
                                src={editFormData.pet_image}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>
                                {editFormData.pet_image}
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        margin="dense"
                        name="chungLoai"
                        label="Chủng loại"
                        fullWidth
                        value={editFormData.chungLoai}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="tuoi"
                        label="Tuổi"
                        fullWidth
                        value={editFormData.tuoi}
                        onChange={handleEditInputChange}
                    />

                    <TextField
                        margin="dense"
                        name="canNang"
                        label="Cân nặng"
                        fullWidth
                        value={editFormData.canNang}
                        onChange={handleEditInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="idKhachHang"
                        label="ID khách hàng"
                        fullWidth
                        value={editFormData.idKhachHang}
                        onChange={handleEditInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>Giới tính</FormLabel>
                        <RadioGroup
                            row
                            name="gioiTinh"
                            value={editFormData.gioiTinh}
                            onChange={handleEditInputChange}

                        >
                            <FormControlLabel value="Đực" control={<Radio />} label="Đực" />
                            <FormControlLabel value="Cái" control={<Radio />} label="Cái" />
                            <FormControlLabel value="Không xác định" control={<Radio />} label="Không xác định" />
                        </RadioGroup>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Hủy</Button>
                    <Button onClick={handleSubmitEdit} variant="contained" color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default PetManage;