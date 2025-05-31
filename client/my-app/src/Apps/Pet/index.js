import {
    Box, useTheme, Card, CardMedia, CardContent,
    Typography, IconButton, FormControl, InputLabel, Select, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, CircularProgress
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/header";
import Breadcrumb from "../../components/BreadCrumb";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { getListPet, editListPet, createListPet, deleteListPet } from "../../service/petList.service";

function Pet() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Pet', path: null }
    ];

    // State management
    const [petList, setPetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: "", age: "", weight: "", breed: "", dob: "", image: ""
    });
    const [submitting, setSubmitting] = useState(false); // Thêm state cho trạng thái submitting

    // Fetch pets data
    const fetchPets = async () => {
        try {
            setLoading(true);
            const data = await getListPet();
            setPetList(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thú cưng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    // Dialog handlers
    const handleOpenAdd = () => {
        setCurrentPet(null);
        setEditMode(false);
        setOpenDialog(true);
    };

    const handleOpenEdit = (pet) => {
        setCurrentPet(pet);
        setEditMode(true);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setCurrentPet(null);
        setOpenDialog(false);
    };

    // Form handlers
    useEffect(() => {
        if (editMode && currentPet) {
            setFormData(currentPet);
        } else {
            setFormData({ name: "", age: "", weight: "", breed: "", dob: "", image: "" });
        }
    }, [editMode, currentPet]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit handler với delay 3 giây
    const handleSubmit = async () => {
        setSubmitting(true); // Bắt đầu hiển thị loading
        
        try {
            // Thêm delay 3 giây trước khi thực hiện lưu
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            if (editMode) {
                await editListPet(currentPet.id, formData);
            } else {
                await createListPet(formData);
            }
            
            setOpenDialog(false);
            fetchPets(); // reload data
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false); // Kết thúc hiển thị loading
        }
    };

    // Delete handlers
    const handleOpenDelete = (id) => {
        setConfirmDeleteId(id);
    };

    const handleCloseDelete = () => {
        setConfirmDeleteId(null);
    };

    const handleDeletePet = async () => {
        try {
            await deleteListPet(confirmDeleteId);
            handleCloseDelete();
            fetchPets();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="5px 20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="PET" subtitle="Welcome to your pet" />
                    <Box display="flex" alignItems="center" gap={2}>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel xs={{ color: colors.grey[100] }}>Sắp xếp</InputLabel>
                            <Select xs={{ color: colors.grey[100] }} label="Sắp xếp">
                                <MenuItem value="default" color={colors.grey[100]}>Mặc định</MenuItem>
                                <MenuItem value="a-z" color={colors.grey[100]}>A → Z</MenuItem>
                                <MenuItem value="z-a" color={colors.grey[100]}>Z → A</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Pet List Grid */}
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
                    {/* Add Pet Card */}
                    <Box
                        sx={{
                            gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" },
                            backgroundColor: colors.primary[400],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            height: "100%"
                        }}
                        onClick={handleOpenAdd}
                    >
                        <IconButton
                            color="primary"
                            sx={{
                                width: 80,
                                height: 80,
                                border: "2px dashed #1976d2",
                                borderRadius: "50%",
                                backgroundColor: "#ffffff80",
                                animation: "spin 12s linear infinite",
                                "&:hover": {
                                    backgroundColor: "#ffffff"
                                },
                                "@keyframes spin": {
                                    from: { transform: "rotate(0deg)" },
                                    to: { transform: "rotate(360deg)" }
                                },
                            }}
                        >
                            <AddIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    </Box>

                    {/* Pet Cards */}
                    {petList.map((item, index) => (
                        <Box
                            sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3", lg: "span 3" } }}
                            backgroundColor={colors.primary[400]}
                            display="flex" alignItems="center"
                            justifyContent="center"
                            key={index}
                        >
                            <Card sx={{ backgroundColor: colors.primary[400], width: "100%", position: "relative", overflow: "hidden" }}>
                                <Box sx={{ position: "relative", "&:hover .hover-actions": { opacity: 1 } }}>
                                    <CardMedia
                                        component="img"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Box
                                        className="hover-actions"
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            bgcolor: "rgba(0,0,0,0.4)",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            opacity: 0,
                                            transition: "opacity 0.3s",
                                        }}
                                    >
                                        <IconButton
                                            component={Link} 
                                            to={`/pet/${item.id}`}
                                        >
                                            <VisibilityIcon sx={{ color: "#fff", transition: "transform 0.2s", "&:hover": { transform: "scale(1.2)" } }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenEdit(item)}>
                                            <EditIcon sx={{ color: "#fff", transition: "transform 0.2s", "&:hover": { transform: "scale(1.2)" } }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDelete(item.id)}>
                                            <DeleteIcon sx={{ color: "#fff", transition: "transform 0.2s", "&:hover": { transform: "scale(1.2)" } }} />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <CardContent>
                                    <Typography variant="h4" component="div">
                                        Tên: {item.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? "Chỉnh sửa thú cưng" : "Thêm thú cưng"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" name="name" label="Tên" value={formData.name} onChange={handleFormChange} />
                    <TextField fullWidth margin="dense" name="age" label="Tuổi" value={formData.age} onChange={handleFormChange} />
                    <TextField fullWidth margin="dense" name="weight" label="Cân nặng" value={formData.weight} onChange={handleFormChange} />
                    <TextField fullWidth margin="dense" name="breed" label="Giống" value={formData.breed} onChange={handleFormChange} />
                    <TextField fullWidth margin="dense" name="dob" label="Ngày sinh" type="date" value={formData.dob} onChange={handleFormChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="dense" name="image" label="URL ảnh" value={formData.image} onChange={handleFormChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>Hủy</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {submitting ? "Đang xử lý..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!confirmDeleteId} onClose={handleCloseDelete}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa thú cưng này không?</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Hủy</Button>
                    <Button onClick={handleDeletePet} variant="contained" color="error">Xóa</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Pet;