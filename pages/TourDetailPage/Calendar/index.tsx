import { Box } from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ICustomCalendar {
  selectedDate: Value;
  setSelectedDate: React.Dispatch<React.SetStateAction<Value>>;
}

const CustomCalendar = (props: ICustomCalendar) => {
  const { selectedDate, setSelectedDate } = props;

  return (
    <Box
      maxW="400px"
      p="20px"
      boxShadow="0 4px 6px rgba(0,0,0,0.1)"
      borderRadius="8px"
      bg="#fff"
      border="none"
    >
      <Calendar onChange={setSelectedDate} value={selectedDate} />
    </Box>
  );
};

export default CustomCalendar;
