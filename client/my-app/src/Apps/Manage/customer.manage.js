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
import { getCustomersManage, deleteCustomersManage } from "../../service/customer.service";
import ActionMenu from "./actionMenu";
const CustomerManage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: "Dashboard", path: "/" },
        { label: "Quản lý khách hàng", path: null },
    ];
    //dữ liệu cột
    const columns = [
        { field: "id", headerName: "ID", minWidth: 60, disableSearch: "search" },
        { field: "tenKhachHang", headerName: "Tên khách hàng", minWidth: 160, disableSearch: "search" },
        { field: "tenDangNhap", headerName: "Tên đăng nhập", minWidth: 140, disableSearch: "search" },
        { field: "sdt", headerName: "SĐT", minWidth: 120, disableSearch: "search" },
        { field: "diaChi", headerName: "Địa chỉ", minWidth: 160},
        { field: "thanhPho", headerName: "Thành phố", minWidth: 120 },
        { field: "quocTich", headerName: "Quốc tịch", minWidth: 100 },
        {
            field: "thaoTac",
            headerName: "Thao tác",
            renderCell: (row) => <ActionMenu row={row} />
        }
    ]
    //DỮ liệu hàng
    const [customers, setCustomers] = useState([]);
    const fetchData = async () => {
        const res = await getCustomersManage();
        setCustomers(res || []);
    };

    useEffect(() => {
        fetchData();
    }, []);
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
                    Quản lý khách hàng
                </Typography>
                <Button
                    variant="contained"

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
                    Thêm khách hàng mới
                </Button>
            </Box>
            <Box p={2}>
                <ClassTable columns={columns} rows={customers} allowSearching />
            </Box>
        </>
    )
}
export default CustomerManage;