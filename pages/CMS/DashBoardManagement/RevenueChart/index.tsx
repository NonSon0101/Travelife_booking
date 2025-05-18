"use client";

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IRevenueChart {
  revenueData: number[];
  revenueCategories: string[];
}

const RevenueChart = ({ revenueData, revenueCategories }: IRevenueChart) => {
  const textColor = useColorModeValue("#2D3748", "#E2E8F0");
  const gridColor = useColorModeValue("#E2E8F0", "#4A5568");
  const lineColor = "#3182CE"; // Blue.500 của Chakra

  const [dataChart, setDataChart] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [{ name: "Revenue", data: [] }],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      stroke: {
        curve: "straight", // hoặc "smooth" nếu muốn mềm mại
        width: 3,
        colors: [lineColor],
      },
      colors: [lineColor],
      markers: {
        size: 5,
        colors: ["white"],
        strokeColors: lineColor,
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      dataLabels: { enabled: false },
      title: {
        text: "Revenue Overview",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: textColor,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: textColor,
          },
        },
        title: {
          text: "Months",
          style: { color: textColor },
        },
      },
      yaxis: {
        title: {
          text: "Revenue (VND)",
          style: { color: textColor },
        },
        labels: {
          style: {
            colors: textColor,
          },
        },
      },
      grid: {
        borderColor: gridColor,
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.2,
        },
      },
      tooltip: {
        theme: "light",
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: textColor,
        },
      },
    },
  });

  useEffect(() => {
    if (revenueData?.length && revenueCategories?.length) {
      setDataChart((prev) => ({
        ...prev,
        series: [{ name: "Revenue", data: revenueData }],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: revenueCategories,
          },
        },
      }));
    }
  }, [revenueData, revenueCategories]);

  if (!revenueData?.length || !revenueCategories?.length) {
    return (
      <Box textAlign="center" mt={8}>
        <Text>No data available for the chart</Text>
      </Box>
    );
  }

  return (
    <Box
      width="full"
      maxW="100%"
      mx="auto"
      mt={8}
      p={4}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="md"
      borderRadius="md"
    >
      <Chart
        options={dataChart.options}
        series={dataChart.series}
        type="line"
        height={350}
      />
    </Box>
  );
};

export default RevenueChart;
