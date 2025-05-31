import { Box, IconButton, Button } from "@mui/material";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/header";
import ClassTable from "../../components/Table";
import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { getListServiceRegister } from "../../service/service.service";
import { deleteServiceRegisterById } from "../../service/service.service";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from "@mui/material";
function ServiceHistory() {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Dịch vụ/lịch sử-đăng ký', path: "/service/register" }
    ];
    // dữ liệu ở phần header của bảng
    const dataHeader = [
        { field: "id", headerName: " " },
        { field: "petService", headerName: "Tên dịch vụ" },
        { field: "petName", headerName: "Tên vật nuôi", disableSearch: 'search' },
        // { field: "email", headerName: "Email",disableSearch:'search' },
        // { field: "phone", headerName: "Số điện thoại" },
        { field: "roomType", headerName: "Loại phòng" },
        { field: "date", headerName: "Thời gian" },
        { field: "startDate", headerName: "Thời gian bắt đầu" },
        { field: "endDate", headerName: "Thời gian kết thúc" },
        { field: "status", headerName: "Trạng thái" },
        { field: "total", headerName: "Tổng tiền" },
        // { field: "message", headerName: "Ghi chú"},
        {
            field: 'thaoTac',
            headerName: 'Thao tác',
            renderCell: (row) => (
                <IconButton>
                    <DeleteIcon onClick={() => {
                        setSelectedItem(row);
                        setOpenDialog(true);
                    }} sx={{ color: "#C02135", cursor: 'pointer' }} />
                </IconButton>

            )
        }
    ]

    const [dataServicesRegister, setDataServicesRegister] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListServiceRegister();
            setDataServicesRegister(response);
        }
        fetchApi();
    }, []);
    console.log(dataServicesRegister)
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="5px 20px" sx={{ display: "flex", justifyContent: "space-between" }}>
                <Header subtitle="Lịch sử đăng ký dịch vụ" />

            </Box>
            <Box m="5px 20px">
                <ClassTable columns={dataHeader} rows={dataServicesRegister} />
            </Box>


            {/* // Trong JSX */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận xoá đăng ký</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc muốn xoá đăng ký dịch vụ <strong>{selectedItem?.petService}</strong> cho <strong>{selectedItem?.petName}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Huỷ
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                await deleteServiceRegisterById(selectedItem.id);
                                setOpenDialog(false);
                                setDataServicesRegister((prev) =>
                                    prev.filter((item) => item.id !== selectedItem.id)
                                );
                            } catch (error) {
                                console.error("Lỗi khi xoá:", error);
                            }
                        }}
                        color="error"
                        variant="contained"
                    >
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default ServiceHistory;