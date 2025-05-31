import React from "react";
import ReactECharts from "echarts-for-react";
import { mockLineData as data } from "../data/mockData";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const LineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Trích xuất danh sách các phương tiện giao thông
  const categories = data[0].data.map((item) => item.x);

  // Chuẩn bị dữ liệu cho từng quốc gia
  const seriesData = data.map((countryData) => ({
    name: countryData.id,
    type: "line",
    smooth: true,
    data: countryData.data.map((item) => item.y),
    itemStyle: { color: countryData.color },
  }));

  // Cấu hình biểu đồ
  const option = {
    backgroundColor: colors.primary[400],
    tooltip: { trigger: "axis" },
    legend: { textStyle: { color: colors.grey[100] }, bottom: 0 },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: { color: colors.grey[100] },
    },
    yAxis: { type: "value", axisLabel: { color: colors.grey[100] } },
    series: seriesData,
  };

  return (
    <>      
      <ReactECharts option={option} style={{ height: 300, width: "100%" }} />;
    </>
  )
 
};

export default LineChart;
