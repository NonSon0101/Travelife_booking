"use client";
import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface IRevenueChart {
  revenueData: number[];
  revenueCategories: string[];
}

const RevenueChart = (props: IRevenueChart) => {
  const { revenueData, revenueCategories } = props;

  const [dataChart, setDataChart] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [
      {
        name: "Month",
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
        curve: "straight",
      },
      title: {
        text: "Revenue",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(() => {
    if(dataChart.options.xaxis?.categories.length || dataChart.series[0].data.length) return

    setDataChart((prevState) => ({
      ...prevState,
      series: [
        {
          ...prevState.series[0],
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
  }, [revenueData, revenueCategories]);
  console.log('dataChart', dataChart)

  if (!dataChart.series[0].data.length) {
    return <Box>No data to display</Box>;
  }

  return (
    <Box width="full" mx="auto" mt={8}>
      <div id="chart">
        <Chart
          options={dataChart.options}
          series={dataChart.series}
          type="line"
          height={350}
        />
      </div>
    </Box>
  );
};

export default RevenueChart;
