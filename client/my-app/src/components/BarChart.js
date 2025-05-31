import React from "react";
import ReactECharts from "echarts-for-react";
import { mockBarData as data } from "../data/mockData"; 
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Trích xuất danh sách các quốc gia
  const countries = data.map((item) => item.country);

  // Trích xuất danh sách các danh mục sản phẩm (hot dog, burger, kebab, donut)
  const categories = Object.keys(data[0]).filter((key) => key !== "country" && !key.includes("Color"));

  // Chuẩn bị dữ liệu cho từng danh mục sản phẩm
  const seriesData = categories.map((category) => ({
    name: category,
    type: "bar",
    stack: "total",
    data: data.map((item) => item[category]),
  }));

  // Cấu hình biểu đồ
  const option = {
    backgroundColor: colors.primary[400], // Màu nền tối
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { textStyle: { color:colors.grey[100] }, bottom: 0  },
    xAxis: {
      type: "category",
      data: countries,
      axisLabel: { color: colors.grey[100] },
    },
    yAxis: { type: "value", axisLabel: { color: colors.grey[100]  } },
    series: seriesData,
  };

  return (
    <>
      <ReactECharts option={option} style={{ height: 600, width: "100%" }} />;
    </>
  )
  
};

export default BarChart;
