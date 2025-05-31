import React from "react";
import Chart from "react-apexcharts";
import { mockPieData as data } from "../data/mockData";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const options = {
    labels: data.map((item) => item.label),
    colors: ["#FF5733", "#33FF57", "#3380FF", "#FFC733", "#A633FF"], // Chọn bảng màu tùy chỉnh
    chart: { type: "donut" },
    legend: {
      position: "bottom", // Di chuyển thanh menu xuống dưới
      labels: { colors: colors.grey[100] }, // Đổi màu chữ thành xám đậm (hoặc màu khác)
      itemMargin: { horizontal: 8 },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: { show: true },
            value: { show: true },
          },
        },
      },
    },
  };

  const series = data.map((item) => item.value);

  return <Chart options={options} series={series} type="donut" height={300} />;
};

export default PieChart;
