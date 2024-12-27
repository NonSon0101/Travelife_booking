import React from 'react'
import Select from 'react-select'
import { FormControl, FormLabel } from '@chakra-ui/react'

export interface IOption {
  label: string
  value: string
}

interface IDropdownProps {
  name: string
  label: string
  options: IOption[]
  placeholder?: string
  setValue: any // Nhận setValue từ react-hook-form
  value?: IOption | null // Giá trị hiện tại của dropdown
}

const Dropdown = ({ name, label, options, placeholder, setValue, value }: IDropdownProps) => {
  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        id={name}
        name={name}
        value={value}
        options={options}
        placeholder={placeholder}
        onChange={(option) => setValue(name, option)} // Gọi setValue khi chọn
        styles={{
          container: (base) => ({
            ...base,
            width: '100%',
          }),
          control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#3182CE' : '#CBD5E0',
            boxShadow: state.isFocused ? '0 0 0 1px #3182CE' : 'none',
            '&:hover': {
              borderColor: '#3182CE',
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isFocused ? '#E2E8F0' : isSelected ? '#3182CE' : 'white',
            color: isSelected ? 'white' : '#1A202C',
            '&:hover': {
              backgroundColor: '#E2E8F0',
            },
          }),
        }}
      />
    </FormControl>
  )
}

export default Dropdown
