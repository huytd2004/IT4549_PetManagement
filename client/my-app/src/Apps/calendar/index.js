import { getListServiceRegister } from "../../service/service.service";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/header";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box, Dialog, DialogTitle, DialogContent, IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from "../../theme";
const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  //Phần chuyển trang
  const breadcrumbItems = [
    { label: 'Thú cưng', path: '/pet' },
    { label: 'Calendar', path: null }
  ];
  const [serviceEvents, setServiceEvents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListServiceRegister();

        const mappedEvents = data.map((item) => {
          // Dịch vụ khách sạn: có startDate và endDate
          if (item.startDate && item.endDate) {
            return {
              id: item.id,
              title: `${item.petName} - ${item.petService}`,
              start: item.startDate,
              allDay: true,
              extendedProps: {
                roomType: item.roomType,
                total: item.total,
                status: item.status,
                email: item.email,
                phone: item.phone,
                petName: item.petName,
                service: item.petService
              },
            };
          }

          // Dịch vụ như spa hoặc khám bệnh: chỉ có date (giờ cụ thể)
          if (item.date) {
            return {
              id: item.id,
              title: `${item.petName} - ${item.petService}`,
              start: item.date, // vẫn giữ nguyên
              display: 'block',
              allDay: false,
              extendedProps: {
                phone: item.phone,
                email: item.email,
                message: item.message,
                petName: item.petName,
                service: item.petService
              },
            };
          }

          return null;
        }).filter(Boolean); // lọc bỏ null

        setServiceEvents(mappedEvents);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu lịch:", error);
      }
    };

    fetchData();
  }, []);


  console.log(serviceEvents)
  const renderEventContent = (eventInfo) => {
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
        {startTime} {eventInfo.event.title}
      </Typography>
    );
  };
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalAnchorEl, setModalAnchorEl] = useState(null);
  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.start,
      props: info.event.extendedProps,
    });
    setModalAnchorEl(info.jsEvent.currentTarget); // dùng để định vị modal gần event được click
  };
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Box m="5px 20px">
        <Header subtitle="Lịch đăng ký dịch vụ của bạn!" />
        <Box display="flex" justifyContent="space-between">
          {/* CALENDAR SIDEBAR */}
          <Box
            flex="1 1 20%"
            backgroundColor={colors.primary[400]}
            p="15px"
            borderRadius="4px"
          >
            <Typography variant="h5">Events</Typography>
            <List>
              {currentEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    margin: "10px 0",
                    borderRadius: "2px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* CALENDAR */}
          <Box flex="1 1 100%" ml="15px">
            <FullCalendar
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventsSet={(events) => setCurrentEvents(events)}
              events={serviceEvents}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
            />
          </Box>
        </Box>
      </Box>
      {/* phần Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        anchorEl={modalAnchorEl}
        PaperProps={{
          sx: {
            position: 'absolute',
            top: modalAnchorEl?.getBoundingClientRect().top + 30 || 100,
            left: modalAnchorEl?.getBoundingClientRect().left || 100,
          },
        }}
      >
        <DialogTitle>
          {selectedEvent?.title}
          <IconButton
            aria-label="close"
            onClick={() => setSelectedEvent(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            ⏰ <strong>Thời gian:</strong> {new Date(selectedEvent?.start).toLocaleString()}
          </Typography>
          <Typography gutterBottom>
            📞 <strong>SĐT:</strong> {selectedEvent?.props.phone}
          </Typography>
          <Typography gutterBottom>
            📧 <strong>Email:</strong> {selectedEvent?.props.email}
          </Typography>
          {selectedEvent?.props.message && (
            <Typography gutterBottom>
              💬 <strong>Ghi chú:</strong> {selectedEvent.props.message}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
export default Calendar;