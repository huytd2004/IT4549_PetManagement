import {
  Box, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  getAccommodations,
  createAccommodations,
  editAccommodations,
  deleteAccommodations
} from "../../service/accommodations.service";

function AccommodationManage() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petName: "", ownerName: "", room: "", checkIn: "",
    checkOut: "", notes: "", status: ""
  });
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAccommodations();
      setData(res);
    } catch (e) {
      console.error("Lỗi khi lấy dữ liệu:", e);
    }
  };

  const handleOpen = (item) => {
    if (item) {
      setEditMode(true);
      setSelectedId(item.id);
      setFormData(item);
    } else {
      setEditMode(false);
      setFormData({
        petName: "", ownerName: "", room: "", checkIn: "",
        checkOut: "", notes: "", status: ""
      });
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await editAccommodations(selectedId, formData);
      } else {
        await createAccommodations(formData);
      }
      handleClose();
      fetchData();
    } catch (e) {
      console.error("Lỗi khi lưu dữ liệu:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAccommodations(id);
      fetchData();
    } catch (e) {
      console.error("Lỗi khi xóa:", e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Quản lý lưu trú</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen(null)}>
          Thêm mới
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thú cưng</TableCell>
            <TableCell>Chủ nuôi</TableCell>
            <TableCell>Phòng</TableCell>
            <TableCell>Ngày vào</TableCell>
            <TableCell>Ngày ra</TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.petName}</TableCell>
              <TableCell>{item.ownerName}</TableCell>
              <TableCell>{item.room}</TableCell>
              <TableCell>{item.checkIn}</TableCell>
              <TableCell>{item.checkOut}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(item.id)}><DeleteIcon color="error" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Chỉnh sửa lưu trú" : "Thêm lưu trú"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Tên thú cưng" name="petName" value={formData.petName} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Chủ nuôi" name="ownerName" value={formData.ownerName} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Phòng" name="room" value={formData.room} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Ngày vào" name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="dense" label="Ngày ra" name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="dense" label="Ghi chú" name="notes" value={formData.notes} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Trạng thái" name="status" value={formData.status} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AccommodationManage;
