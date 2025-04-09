"use client"
import { Box, HStack, ToastOptionProvider, VStack } from "@chakra-ui/react";
import RevenueChart from "./RevenueChart";
import StatsOverview from "./StatsOverview";
import TopToursList from "./TopToursList";
import { observer } from "mobx-react";
import { rootStore } from "stores";
import { useEffect, useState } from "react";


const DashBoardManagement = () => {
  const {statisticsStore} = rootStore
  const {revenues} = statisticsStore
  const [filters, setFilters] = useState<string>('')
  const [revenueStats, setRevenueStats] = useState<{
    data: number[];
    categories: string[];
  }>({
    data: [],
    categories: []
  });

  useEffect(() => {
    statisticsStore.fetchRevenue(filters)
  },[filters])

  useEffect(() => {
    if (revenues && revenues.length > 0) {
      setRevenueStats({
        data: revenues.map((revenue) => revenue.revenue),
        categories: revenues.map((revenue) => revenue.date),
      });
    }
  }, [revenues]);  

  return (
    <HStack width='full' alignItems='start'>
      <Box width='full' flex={2} alignItems="start">
        <RevenueChart revenueData={revenueStats.data} revenueCategories={revenueStats.categories}/>
        <StatsOverview />
      </Box>
      <Box flex={1}>
        <TopToursList /> 
      </Box>
    </HStack>
  );
}

export default observer(DashBoardManagement)