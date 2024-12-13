"use client";

import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import react-apexcharts, chỉ chạy trên client
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IRevenueChart {
  revenueData: number[];
  revenueCategories: string[];
}

const RevenueChart = (props: IRevenueChart) => {
  const {revenueData, revenueCategories} = props
  const [dataChart, setDataChart] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [
      {
        name: "Revenue",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Revenue Overview",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // alternating row colors
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Months",
        },
      },
      yaxis: {
        title: {
          text: "Revenue",
        },
      },
    },
  });

  // Update chart data on mount or when props change
  useEffect(() => {
    if (revenueData && revenueCategories && revenueData?.length && revenueCategories?.length) {
      setDataChart((prevState) => ({
        ...prevState,
        series: [
          {
            name: "Revenue",
            data: revenueData,
          },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: revenueCategories,
          },
        },
      }));
    }
  }, [revenueData, revenueCategories]);

  // If there's no data to display, show a message
  if (!revenueData?.length || !revenueCategories?.length) {
    return (
      <Box textAlign="center" mt={8}>
        <Text>No data available for the chart</Text>
      </Box>
    );
  }

  return (
    <Box width="full" mx="auto" mt={8}>
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
