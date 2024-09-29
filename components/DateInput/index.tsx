import React, { ForwardedRef } from 'react';
import { Flex, chakra, Input as ChakraInput } from '@chakra-ui/react';
import Icon from 'components/Icon';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

// Custom wrapper for Chakra styling
const DatePickerWrapper = chakra(Flex, {
  baseStyle: {
    height: 10,
    paddingX: '1rem',
    paddingY: '8px',
    borderRadius: '6px',
    border: 'solid 1px #E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center', // To align the icon vertically
  },
});

interface DateInputProps extends NumericFormatProps {
  onClick?: () => void; // Allow for the custom onClick event
}

// The DateInput component using forwardRef to properly handle refs
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ onClick, ...props }, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <DatePickerWrapper onClick={onClick}>
        <NumericFormat
          {...props}
          getInputRef={ref} // Use getInputRef for NumericFormat
          customInput={ChakraInput}
          format="##/##/####"
          placeholder="MM/DD/YYYY"
          mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
          size="sm"
          fontSize="md"
        />
        <Icon iconName="date.svg" size={20} />
      </DatePickerWrapper>
    );
  }
);

export default DateInput;
