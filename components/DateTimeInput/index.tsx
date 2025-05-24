import React, { ForwardedRef } from 'react';
import { Flex, chakra, Input as ChakraInput } from '@chakra-ui/react';
import Icon from 'components/Icon';
import { NumericFormatProps, PatternFormat } from 'react-number-format';

// Custom wrapper for Chakra styling
const DatePickerWrapper = chakra(Flex, {
  baseStyle: {
    height: 10,
    paddingX: '1rem',
    paddingY: '8px',
    borderRadius: '6px',
    border: 'solid 1px #E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface DateInputProps extends NumericFormatProps {
  onClick?: () => void;
}


export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ onClick, ...props }, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <DatePickerWrapper onClick={onClick}>
        <PatternFormat
          {...props}
          getInputRef={ref}
          customInput={ChakraInput}
          format="##/##/#### ##:##"
          placeholder="MM/DD/YYYY HH:mm"
          mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y', 'H', 'H', 'M', 'M']}
          size="sm"
          fontSize="md"
          border="none"
          padding={0}
        />
        <Icon iconName="date.svg" size={20} />
      </DatePickerWrapper>
    );
  }
);

export default DateInput;
