import React, { ForwardedRef } from 'react';
import { Flex, chakra, Input as ChakraInput } from '@chakra-ui/react';
import Icon from 'components/Icon';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

dayjs.extend(advancedFormat);

const DatePickerWrapper = chakra(Flex, {
  baseStyle: () => ({
    height: 10,
    paddingX: '1rem',
    paddingY: '8px',
    borderRadius: '6px',
    paddingBottom: '10px',
    border: 'solid 1px #E2E8F0',
    justifyContent: 'space-between',
  }),
});

interface DateInputProps extends NumericFormatProps {
  onClick?: () => void;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <DatePickerWrapper onClick={props?.onClick}>
        <NumericFormat
          {...props}
          getInputRef={ref}
          customInput={ChakraInput}
          format="##/##/####"
          placeholder="MM/DD/YYYY"
          mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
          variant="unstyled"
          size="sm"
          fontSize="md"
        />
        <Icon iconName="date.svg" size={20} />
      </DatePickerWrapper>
    );
  }
);

export default DateInput;
