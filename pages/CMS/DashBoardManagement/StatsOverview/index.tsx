import { Box, Flex, Stat, StatLabel, StatNumber, StatHelpText, Icon, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { rootStore } from "stores";
import { formatCurrency } from "utils/common";

const StatsCard = ({ title, stat, change, positive }: { title: string; stat: string; change?: string; positive?: boolean }) => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const statColor = positive ? "green.400" : "red.400";

  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={5}
      shadow="lg"
      bg = 'white'
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.500")}
      rounded="lg"
    >
      <StatLabel fontWeight="medium" isTruncated color={textColor}>
        {title}
      </StatLabel>
      <StatNumber fontSize="2xl" fontWeight="bold" color={useColorModeValue("black", "white")}>
        {stat}
      </StatNumber>
      {change && (
        <StatHelpText>
          <Flex alignItems="center" color={statColor}>
            <Icon as={positive ? FaArrowUp : FaArrowDown} mr={1} />
            {change}
          </Flex>
        </StatHelpText>
      )}
    </Stat>
  );
};

const StatsOverview = () => {
  const { statisticsStore } = rootStore
  const { currentProfit, totalUsers, totalRevenue } = statisticsStore;

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // yyyy-mm
    statisticsStore.fetchCurrentProfit(currentMonth);
    statisticsStore.fetchTotalUsers();
    statisticsStore.fetchTotalRevenue();
  }, [])

  const formatProfitTitle = (profit: number) => {
    if (profit > 0) {
      return `+${profit.toLocaleString()}% from last month`
    }
    return `-${Math.abs(profit).toLocaleString()}% from last month`
  }

  return (
    <Flex width='full' justifyContent="space-between" direction={{ base: "column", md: "row" }} gap={8} p={5}>
      <StatsCard title="Revenue This Month" stat={formatCurrency(currentProfit.currentRevenue, "VND")} change={formatProfitTitle(currentProfit.profitPercentage)} positive />
      <StatsCard title="Total Revenue" stat={formatCurrency(totalRevenue, "VND")} />
      <StatsCard title="Total Users" stat={`${totalUsers} Active Users`} />
    </Flex>
  );
};

export default StatsOverview;
