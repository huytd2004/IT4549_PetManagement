import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumb from "../../components/BreadCrumb";
import { tokens } from "../../theme";
import ClassTable from "../../components/Table";

import {
    getStaffManage,
    createStaffManage,
    deleteStaffManage,
    editStaffManage,
} from "../../service/staff.service";

const StaffManage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    //dữ liệu hàng
    const [rows, setRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        tenNhanVien: "",
        tenDangNhap: "",
        email: "",
        sdt: "",
        diaChi: "",
        thanhPho: "",
        quocTich: "",
    });
    const [selectedId, setSelectedId] = useState(null);

    const fetchData = async () => {
        const res = await getStaffManage();
        setRows(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (staff = null) => {
        if (staff) {
            setFormData(staff);
            setSelectedId(staff.id);
        } else {
            setFormData({
                tenNhanVien: "",
                tenDangNhap: "",
                email: "",
                sdt: "",
                diaChi: "",
                thanhPho: "",
                quocTich: "",
            });
            setSelectedId(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (selectedId) {
            await editStaffManage(selectedId, formData);
        } else {
            await createStaffManage(formData);
        }
        handleCloseDialog();
        fetchData();
    };

    //--------------------hàm xóa nhân viên---------------
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    // mở dialog
    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteId(null);
        setOpenDeleteDialog(false);
    };
    //hàm xác nhận xóa
    const handleConfirmDelete = async () => {
        await deleteStaffManage(deleteId);
        fetchData();
        handleCloseDeleteDialog();
    };

    //dữ liệu cột
    const columns = [
        { field: "id", headerName: "ID", disableSearch: "search", minWidth: 70 },
        { field: "tenNhanVien", headerName: "Tên nhân viên", disableSearch: "search", minWidth: 160 },
        { field: "tenDangNhap", headerName: "Tên đăng nhập", disableSearch: "search", minWidth: 140 },
        { field: "email", headerName: "Email", disableSearch: "search", minWidth: 180 },
        { field: "sdt", headerName: "SĐT", disableSearch: "search", minWidth: 120 },
        { field: "diaChi", headerName: "Địa chỉ", minWidth: 180 },
        { field: "thanhPho", headerName: "Thành phố", minWidth: 120 },
        { field: "quocTich", headerName: "Quốc tịch", minWidth: 120 },
        {
            field: "thaoTac",
            headerName: "Thao tác",
            minWidth: 150,
            renderCell: (row) => (
                <Box display="flex" gap={1}>
                    <Button variant="outlined" color={colors.primary[400]} size="small" onClick={() => handleOpenDialog(row)}>
                        Sửa
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleOpenDeleteDialog(row.id)}>
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const breadcrumbItems = [
        { label: "Dashboard", path: "/" },
        { label: "Quản lý nhân viên", path: null },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: "12px", margin: "5px 12px", borderRadius: "8px", gap: "12px", bgcolor: colors.primary[400] }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                    Quản lý nhân viên
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        textTransform: "none",
                        borderRadius: "999px",
                        paddingX: 2,
                        fontWeight: 400,
                        fontSize: "16px",
                    }}
                >
                    <AddIcon sx={{ fontSize: 20, mr: 1 }} />
                    Thêm nhân viên mới
                </Button>
            </Box>

            <Box padding="14px" gap="12px" borderRadius="8px" bgcolor={colors.primary[400]} marginTop="20px" m="12px">
                <ClassTable columns={columns} rows={rows} allowSearching />
            </Box>

            {/* Dialog thêm/sửa */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{fontSize:"20px"}}>{selectedId ? "Cập nhật nhân viên" : "Thêm nhân viên"}</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField label="Tên nhân viên" name="tenNhanVien" value={formData.tenNhanVien} onChange={handleChange} fullWidth />
                    <TextField label="Tên đăng nhập" name="tenDangNhap" value={formData.tenDangNhap} onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                    <TextField label="Số điện thoại" name="sdt" value={formData.sdt} onChange={handleChange} fullWidth />
                    <TextField label="Địa chỉ" name="diaChi" value={formData.diaChi} onChange={handleChange} fullWidth />
                    <TextField label="Thành phố" name="thanhPho" value={formData.thanhPho} onChange={handleChange} fullWidth />
                    <TextField label="Quốc tịch" name="quocTich" value={formData.quocTich} onChange={handleChange} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {selectedId ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* xóa nhân viên */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{fontSize:"20px"}}>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa nhân viên này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StaffManage;
