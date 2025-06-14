import { Box, Text } from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ICustomCalendar {
  selectedDate: Value;
  setSelectedDate: React.Dispatch<React.SetStateAction<Value>>;
  vacancies?: { [key: string]: number };
  defaultVacancies?: number;
}

const CustomCalendar = (props: ICustomCalendar) => {
  const { selectedDate, setSelectedDate, vacancies = {}, defaultVacancies = 20 } = props;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  const tileContent = ({ date }: { date: Date }) => {
    if (isPastDate(date)) {
      return null;
    }

    const dateString = formatDate(date);
    const vacancyCount = vacancies[dateString] ?? defaultVacancies;
    
    return (
      <Box textAlign="center" fontSize="12px" color="gray.600">
        <Text 
          textDecoration={vacancyCount === 0 ? "line-through" : "none"}
          color={vacancyCount === 0 ? "black.400" : "black.400"}
        >
          Slots:
        </Text>
        <Text 
          textDecoration={vacancyCount === 0 ? "line-through" : "none"}
          color={vacancyCount === 0 ? "teal.400" : vacancyCount <= 10 ? "red.500" : "teal.400"}
          fontWeight={vacancyCount <= 10 ? "bold" : "normal"}
        >
          {vacancyCount}
        </Text>
      </Box>
    );
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    if (isPastDate(date)) {
      return true;
    }

    const dateString = formatDate(date);
    const vacancyCount = vacancies[dateString] ?? defaultVacancies;
    return vacancyCount === 0;
  };

  return (
    <Box
      maxW="400px"
      p="20px"
      boxShadow="0 4px 6px rgba(0,0,0,0.1)"
      borderRadius="8px"
      bg="#fff"
      border="none"
    >
      <Calendar 
        onChange={setSelectedDate} 
        value={selectedDate}
        tileContent={tileContent}
        tileDisabled={tileDisabled}
        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
      />
    </Box>
  );
};

export default CustomCalendar;
