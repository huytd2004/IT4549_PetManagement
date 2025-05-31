import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Typography, useTheme,
    MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
import {
    getAccounts, createAccounts, editAccounts, deleteAccounts
} from "../../service/accounts.service";
import ClassTable from "../../components/Table";

function AccountManage() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", phone: "", dob: "", address: "", role: "user"
    });

    const fetchData = async () => {
        try {
            const res = await getAccounts();
            setData(res);
        } catch (e) {
            console.error("Lỗi khi lấy tài khoản:", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (item) => {
        if (item) {
            setEditMode(true);
            setSelectedId(item.id);
            setFormData({
                name: item.name || "",
                email: item.email || "",
                password: item.password || "",
                phone: item.phone || "",
                dob: item.dob || "",
                address: item.address || "",
                role: item.role || "user"
            });
        } else {
            setEditMode(false);
            setFormData({
                name: "", email: "", password: "", phone: "",
                dob: "", address: "", role: "user"
            });
            setSelectedId(null);
        }
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSubmit = async () => {
        try {
            if (editMode && selectedId) {
                await editAccounts(selectedId, formData);
            } else {
                await createAccounts(formData);
            }
            handleClose();
            fetchData();
        } catch (e) {
            console.error("Lỗi khi lưu:", e);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAccounts(id);
            fetchData();
        } catch (e) {
            console.error("Lỗi khi xóa:", e);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const columns = [
        { field: "name", headerName: "Tên" },
        { field: "email", headerName: "Email" },
        { field: "role", headerName: "Vai trò" },
        { field: "phone", headerName: "SĐT" },
        { field: "dob", headerName: "Giới tính" },
        { field: "address", headerName: "Địa chỉ" },
        {
            field: "thaoTac", headerName: "Thao tác", flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" gap="15px" sx={{ cursor: 'pointer' }} alignItems="center">
                    <EditIcon sx={{ color: '#0D81ED' }} onClick={() => handleOpen(params.row)} />
                    <DeleteIcon sx={{ color: "#C02135" }} onClick={() => handleDelete(params.row.id)} />
                </Box>
            )
        }
    ];

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', margin: "5px 12px", borderRadius: '8px', gap: '12px', bgcolor: colors.primary[400] }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}>
                    Quản lý quyền truy cập
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => handleOpen(null)}
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
                         Thêm mới
                </Button>
            </Box>

            <Box padding="14px" gap="12px" borderRadius="8px" bgcolor={colors.primary[400]} marginTop="20px" m="12px">
                <ClassTable columns={columns} rows={data} allowSearching />
            </Box>

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Họ tên" name="name" value={formData.name} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Email" name="email" value={formData.email} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Mật khẩu" name="password" value={formData.password} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Giới tính" name="dob" value={formData.dob} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="role-label">Vai trò</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            label="Vai trò"
                            onChange={handleChange}
                        >
                            <MenuItem value="admin">admin</MenuItem>
                            <MenuItem value="staff">STAFF</MenuItem>
                            <MenuItem value="user">user</MenuItem>
                            <MenuItem value="doctor">DOCTOR</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AccountManage;
