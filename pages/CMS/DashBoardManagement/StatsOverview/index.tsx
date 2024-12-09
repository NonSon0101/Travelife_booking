import { Box, Flex, Stat, StatLabel, StatNumber, StatHelpText, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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
  return (
    <Flex width='full' justifyContent="space-between" direction={{ base: "column", md: "row" }} gap={8} p={5}>
      <StatsCard title="Revenue This Month" stat="$12,345" change="+15% from last month" positive />
      <StatsCard title="Profit Comparison" stat="$10,000" change="-5% from last month" positive={false} />
      <StatsCard title="Users Today" stat="1,234" />
    </Flex>
  );
};

export default StatsOverview;
