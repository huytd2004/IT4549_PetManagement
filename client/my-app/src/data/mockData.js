// eslint-disable-next-line
 // eslint-disable-next-line 
import { tokens } from "../theme";

export const mockBarData = [
   {
    country: "Thứ 2",
    "Khám tổng quát": 137,
    "Khám tổng quátColor": "hsl(229, 70%, 50%)",
    "Tiêm phòng": 96,
    "Tiêm phòngColor": "hsl(296, 70%, 50%)",
    "Spa & Grooming": 72,
    "Spa & GroomingColor": "hsl(97, 70%, 50%)",
    "Xét nghiệm": 140,
    "Xét nghiệmColor": "hsl(340, 70%, 50%)",
    "Khách sạn lưu trú": 65,
    "Khách sạn lưu trúColor": "hsl(15, 70%, 50%)"
  },
  {
    country: "Thứ 3",
    "Khám tổng quát": 55,
    "Khám tổng quátColor": "hsl(307, 70%, 50%)",
    "Tiêm phòng": 28,
    "Tiêm phòngColor": "hsl(111, 70%, 50%)",
    "Spa & Grooming": 58,
    "Spa & GroomingColor": "hsl(273, 70%, 50%)",
    "Xét nghiệm": 29,
    "Xét nghiệmColor": "hsl(275, 70%, 50%)",
    "Khách sạn lưu trú": 41,
    "Khách sạn lưu trúColor": "hsl(50, 70%, 50%)"
  },
  {
    country: "Thứ 4",
    "Khám tổng quát": 109,
    "Khám tổng quátColor": "hsl(72, 70%, 50%)",
    "Tiêm phòng": 23,
    "Tiêm phòngColor": "hsl(96, 70%, 50%)",
    "Spa & Grooming": 34,
    "Spa & GroomingColor": "hsl(106, 70%, 50%)",
    "Xét nghiệm": 152,
    "Xét nghiệmColor": "hsl(256, 70%, 50%)",
    "Khách sạn lưu trú": 70,
    "Khách sạn lưu trúColor": "hsl(20, 70%, 50%)"
  },
  {
    country: "Thứ 5",
    "Khám tổng quát": 133,
    "Khám tổng quátColor": "hsl(257, 70%, 50%)",
    "Tiêm phòng": 52,
    "Tiêm phòngColor": "hsl(326, 70%, 50%)",
    "Spa & Grooming": 43,
    "Spa & GroomingColor": "hsl(110, 70%, 50%)",
    "Xét nghiệm": 83,
    "Xét nghiệmColor": "hsl(9, 70%, 50%)",
    "Khách sạn lưu trú": 38,
    "Khách sạn lưu trúColor": "hsl(100, 70%, 50%)"
  },
  {
    country: "Thứ 6",
    "Khám tổng quát": 81,
    "Khám tổng quátColor": "hsl(190, 70%, 50%)",
    "Tiêm phòng": 80,
    "Tiêm phòngColor": "hsl(325, 70%, 50%)",
    "Spa & Grooming": 112,
    "Spa & GroomingColor": "hsl(54, 70%, 50%)",
    "Xét nghiệm": 35,
    "Xét nghiệmColor": "hsl(285, 70%, 50%)",
    "Khách sạn lưu trú": 92,
    "Khách sạn lưu trúColor": "hsl(230, 70%, 50%)"
  },
  {
    country: "Thứ 7",
    "Khám tổng quát": 66,
    "Khám tổng quátColor": "hsl(208, 70%, 50%)",
    "Tiêm phòng": 111,
    "Tiêm phòngColor": "hsl(334, 70%, 50%)",
    "Spa & Grooming": 167,
    "Spa & GroomingColor": "hsl(182, 70%, 50%)",
    "Xét nghiệm": 18,
    "Xét nghiệmColor": "hsl(76, 70%, 50%)",
    "Khách sạn lưu trú": 105,
    "Khách sạn lưu trúColor": "hsl(180, 70%, 50%)"
  },
  {
    country: "Chủ nhật",
    "Khám tổng quát": 80,
    "Khám tổng quátColor": "hsl(87, 70%, 50%)",
    "Tiêm phòng": 47,
    "Tiêm phòngColor": "hsl(141, 70%, 50%)",
    "Spa & Grooming": 158,
    "Spa & GroomingColor": "hsl(224, 70%, 50%)",
    "Xét nghiệm": 49,
    "Xét nghiệmColor": "hsl(274, 70%, 50%)",
    "Khách sạn lưu trú": 78,
    "Khách sạn lưu trúColor": "hsl(200, 70%, 50%)"
  }
  ];
  
export const mockPieData = [
    {
    id: "Khám bệnh",
    label: "Khám bệnh",
    value: 350,
    color: "hsl(104, 70%, 50%)"
  },
  {
    id: "Tiêm ngừa",
    label: "Tiêm ngừa",
    value: 200,
    color: "hsl(162, 70%, 50%)"
  },
  {
    id: "Spa - Làm đẹp",
    label: "Spa - Làm đẹp",
    value: 180,
    color: "hsl(291, 70%, 50%)"
  },
  {
    id: "Lưu trú - Khách sạn",
    label: "Lưu trú - Khách sạn",
    value: 120,
    color: "hsl(229, 70%, 50%)"
  },
  {
    id: "Tư vấn dinh dưỡng",
    label: "Tư vấn dinh dưỡng",
    value: 95,
    color: "hsl(344, 70%, 50%)"
  }
];
export const mockLineData = [
   {
    id: "Chó",
    color: tokens("dark").greenAccent[500],
    data: [
      { x: "Tiêu hóa", y: 101 },
      { x: "Da liễu", y: 75 },
      { x: "Hô hấp", y: 36 },
      { x: "Cơ xương khớp", y: 216 },
      { x: "Nhiễm trùng", y: 35 },
      { x: "Dinh dưỡng kém", y: 236 },
      { x: "Béo phì", y: 88 },
      { x: "Thiếu cân", y: 232 },
      { x: "Tâm lý", y: 281 },
      { x: "Ký sinh trùng", y: 1 },
      { x: "Vệ sinh răng miệng", y: 35 },
      { x: "Khác", y: 14 }
    ]
  },
  {
    id: "Mèo",
    color: tokens("dark").blueAccent[300],
    data: [
      { x: "Tiêu hóa", y: 212 },
      { x: "Da liễu", y: 190 },
      { x: "Hô hấp", y: 270 },
      { x: "Cơ xương khớp", y: 9 },
      { x: "Nhiễm trùng", y: 75 },
      { x: "Dinh dưỡng kém", y: 175 },
      { x: "Béo phì", y: 33 },
      { x: "Thiếu cân", y: 189 },
      { x: "Tâm lý", y: 97 },
      { x: "Ký sinh trùng", y: 87 },
      { x: "Vệ sinh răng miệng", y: 299 },
      { x: "Khác", y: 251 }
    ]
  },
  {
    id: "Thỏ",
    color: tokens("dark").redAccent[200],
    data: [
      { x: "Tiêu hóa", y: 191 },
      { x: "Da liễu", y: 136 },
      { x: "Hô hấp", y: 91 },
      { x: "Cơ xương khớp", y: 190 },
      { x: "Nhiễm trùng", y: 211 },
      { x: "Dinh dưỡng kém", y: 152 },
      { x: "Béo phì", y: 189 },
      { x: "Thiếu cân", y: 152 },
      { x: "Tâm lý", y: 8 },
      { x: "Ký sinh trùng", y: 197 },
      { x: "Vệ sinh răng miệng", y: 107 },
      { x: "Khác", y: 170 }
    ]
  }
];
