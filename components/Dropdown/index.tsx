"use client";
import { FormControl, FormLabel } from '@chakra-ui/react'
import { GroupBase, MultiValue, Select } from 'chakra-react-select'
import get from 'lodash/get'
import { useFormContext, useWatch } from 'react-hook-form'

export interface IOption {
  label: string
  value: string
}

interface IDropdownProps {
  name: string
  label: string
  options: IOption[]
  placeholder?: string
  setValue: any
  gridColumn?: string
  isRequired?: boolean
  isMulti?: boolean
  isClearable?: boolean
}

const Dropdown = (props: IDropdownProps) => {
  const { name, label, options, placeholder, setValue, gridColumn, isRequired, isMulti, isClearable = true } = props
  const { control } = useFormContext()
  const value = useWatch({ control, name })

  const handleChange = (option: MultiValue<IOption>) => {
    if (isMulti) {
      setValue(name, option)
    } else {
      setValue(name, { label: get(option, 'label', ''), value: get(option, 'value', '') })
    }
  }

  return (
    <FormControl gridColumn={gridColumn} isRequired={isRequired}>
      <FormLabel color="gray.700" marginBottom={2}>
        {label}
      </FormLabel>
      <Select<IOption, boolean, GroupBase<IOption>>
        size="md"
        name={name}
        value={value}
        options={options}
        colorScheme="teal"
        placeholder={placeholder}
        isClearable={isClearable}
        isMulti={isMulti}
        onChange={handleChange}
        chakraStyles={{
          container: (provided: Record<string, unknown>) => ({
            ...provided,
            width: 'full',
            cursor: 'pointer',
          }),
          dropdownIndicator: (provided: Record<string, unknown>) => ({
            ...provided,
            bg: 'transparent',
            px: 2,
            cursor: 'pointer',
            color: 'gray.700',
          }),
          indicatorSeparator: (provided: Record<string, unknown>) => ({
            ...provided,
            display: 'none',
          }),
          clearIndicator: (provided: Record<string, unknown>) => ({
            ...provided,
            display: 'none',
          }),
          menu: (provided: Record<string, unknown>) => ({
            ...provided,
            zIndex: 9999,
            boxShadow: 'md',
          }),
          option: (provided: Record<string, unknown>, { isSelected }) => ({
            ...provided,
            cursor: 'pointer',
            color: 'gray.800',
            _hover: {
              background: 'teal.100',
            },
            _selected: {
              background: isSelected ? 'teal.100' : 'auto'
            }
          }),
          multiValue: (provided: Record<string, unknown>) => ({
            ...provided,
            backgroundColor: 'teal.100',
            borderRadius: '4px',
            margin: '2px',
          }),
          multiValueLabel: (provided: Record<string, unknown>) => ({
            ...provided,
            color: 'teal.700',
            padding: '2px 6px',
          }),
          multiValueRemove: (provided: Record<string, unknown>) => ({
            ...provided,
            color: 'teal.700',
            _hover: {
              backgroundColor: 'teal.200',
              color: 'teal.800',
            },
          }),
        }}
      />
    </FormControl>
  )
}

export default Dropdown
