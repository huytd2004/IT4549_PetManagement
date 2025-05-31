import { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import {
    Box, Typography, useTheme, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Radio, FormControl, FormControlLabel, RadioGroup, FormLabel
} from "@mui/material";
import { tokens } from "../../theme";
import AddIcon from '@mui/icons-material/Add';
import ClassTable from "../../components/Table";
import { getServiceManage, createServiceManage, editServiceManage, deleteServiceManage } from "../../service/serviceManage.service";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const ServiceManage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Quản lý dịch vụ', path: null }
    ];

    const [services, setServices] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        tenDichVu: "",
        image: "",
        moTa: "",
        loaiDichVu: "",
        gia: "",
        donViTinh: "",
        thoiGianUocTinh: "",
        trangThai: "Đang hoạt động", // default
    });

    const fetchData = async () => {
        const res = await getServiceManage();
        setServices(res || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (row = null) => {
        setIsEditMode(!!row);
        setSelectedService(row);
        setFormData(row || {
            tenDichVu: "",
            image: "",
            moTa: "",
            loaiDichVu: "Spa",
            gia: "",
            donViTinh: "lượt",
            thoiGianUocTinh: "",
            trangThai: "Đang hoạt động"
        });
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedService(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            await editServiceManage(selectedService.id, formData);
        } else {
            await createServiceManage(formData);
        }
        fetchData();
        handleClose();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
            await deleteServiceManage(id);
            fetchData();
        }
    };

    const columns = [
        { field: "id", headerName: "ID", minWidth: 50 },
        { field: "tenDichVu", headerName: "Tên dịch vụ", minWidth: 80 },
        { field: "loaiDichVu", headerName: "Loại dịch vụ", minWidth: 120 },
        { field: "gia", headerName: "Giá (VNĐ)", minWidth: 100 },
        { field: "donViTinh", headerName: "Đơn vị", minWidth: 80 },
        { field: "thoiGianUocTinh", headerName: "Thời gian (phút)", minWidth: 130 },
        { field: "trangThai", headerName: "Trạng thái", minWidth: 120 },
        {
            field: "thaoTac", headerName: "Thao tác", renderCell: (row) => (
                <Box display="flex" justifyContent="center" gap="15px" sx={{ cursor: 'pointer' }} textAlign="center" alignItems="center">
                    <RemoveRedEyeIcon sx={{ color: "#5C606D" }} />
                    <EditIcon sx={{ color: '#0D81ED' }} onClick={() => handleOpen(row)} />
                    <DeleteIcon
                        sx={{ color: "#C02135" }}
                        onClick={() => handleDelete(row.id)}
                    />
                </Box>
            )
        }
    ];

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
                    Quản lý dịch vụ
                </Typography>
                {/* Nút Thêm lớp học mới */}
                <Button
                    variant="contained"
                    onClick={() => handleOpen()}
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
                    Thêm dịch vụ mới
                </Button>
            </Box>
            <Box p={2}>
                <ClassTable columns={columns} rows={services} allowSearching />
            </Box>

            <Dialog open={openDialog} onClose={handleClose} fullWidth>
                <DialogTitle>{isEditMode ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField name="tenDichVu" label="Tên dịch vụ" value={formData.tenDichVu} onChange={handleChange} fullWidth />
                    <TextField name="image" label="Link ảnh" value={formData.image} onChange={handleChange} fullWidth />
                    {formData.image && (
                        <Box mt={1}>
                            <img
                                src={formData.image}
                                alt="Preview"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 8 }}
                            />
                        </Box>
                    )}
                    <TextField name="moTa" label="Mô tả" value={formData.moTa} onChange={handleChange} fullWidth multiline rows={2} />
                    <TextField select name="loaiDichVu" label="Loại dịch vụ" value={formData.loaiDichVu} onChange={handleChange} fullWidth>
                        <MenuItem value="Spa">Spa</MenuItem>
                        <MenuItem value="Khám bệnh">Khám bệnh</MenuItem>
                        <MenuItem value="Lưu trú">Lưu trú</MenuItem>
                    </TextField>
                    <TextField name="gia" label="Giá" type="number" value={formData.gia} onChange={handleChange} fullWidth />
                    <TextField name="donViTinh" label="Đơn vị tính" value={formData.donViTinh} onChange={handleChange} fullWidth />
                    <TextField name="thoiGianUocTinh" label="Thời gian (phút)" type="number" value={formData.thoiGianUocTinh} onChange={handleChange} fullWidth />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>Trạng thái</FormLabel>
                        <RadioGroup
                            row
                            name="trangThai"
                            value={formData.trangThai || "Đang hoạt động"}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="Đang hoạt động" control={<Radio />} label="Đang hoạt động" />
                            <FormControlLabel value="Ngừng hoạt động" control={<Radio />} label="Ngừng hoạt động" />
                        </RadioGroup>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>{isEditMode ? "Cập nhật" : "Thêm"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ServiceManage;
