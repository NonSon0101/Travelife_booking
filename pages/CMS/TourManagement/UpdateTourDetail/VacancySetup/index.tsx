import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    chakra,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Box,
    Button,
    useToast,
    HStack,
    Divider
} from '@chakra-ui/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState, useEffect } from 'react'

interface IVacancySetupProps {
    isOpen: boolean
    onClose: () => void
    methods: any
}

export const ManageText = chakra(Text, {
    baseStyle: () => ({
        color: 'teal',
        fontSize: 'lg',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: 4,
    })
})

const VacancySetup = (props: IVacancySetupProps) => {
    const { isOpen, onClose, methods } = props
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [defaultAppliedDate, setDefaultAppliedDate] = useState<Date>(new Date())
    const [updateTrigger, setUpdateTrigger] = useState(0)
    const [tempDefaultVacancies, setTempDefaultVacancies] = useState(20)
    const [tempCustomVacancies, setTempCustomVacancies] = useState(20)
    const toast = useToast()

    useEffect(() => {
        if (methods) {
            const defaultVacancies = methods.getValues('defaultVacancies')
            if (defaultVacancies) {
                setTempDefaultVacancies(defaultVacancies)
            }
        }
    }, [methods, isOpen])

    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
        const dateString = formatDate(date)
        const currentVacancies = methods?.getValues('vacancies') || {}
        setTempCustomVacancies(currentVacancies[dateString] || methods?.getValues('defaultVacancies') || 20)
    }

    const onSubmit = () => {
        if (selectedDate) {
            const dateString = formatDate(selectedDate)
            const currentVacancies = methods?.getValues('vacancies') || {}
            const newVacancies = {
                ...currentVacancies,
                [dateString]: tempCustomVacancies
            }
            methods?.setValue('vacancies', newVacancies)
            setUpdateTrigger(prev => prev + 1)
        }
    }

    const handleApplyDefault = () => {
        methods?.setValue('defaultVacancies', tempDefaultVacancies)
        // Reset all vacancies to new default value
        const currentVacancies = methods?.getValues('vacancies') || {}
        const newVacancies = Object.entries(currentVacancies).reduce((acc, [date, value]) => {
            const dateObj = new Date(date)
            if (dateObj < defaultAppliedDate) {
                acc[date] = value
            } else {
                acc[date] = tempDefaultVacancies
            }
            return acc
        }, {})
        methods?.setValue('vacancies', newVacancies)
        setDefaultAppliedDate(new Date())
        setUpdateTrigger(prev => prev + 1)
    }

    const tileContent = ({ date }: { date: Date }) => {
        const dateString = formatDate(date)
        const currentVacancies = methods?.getValues('vacancies') || {}
        const defaultValue = methods?.getValues('defaultVacancies') || 20
        const vacancyCount = currentVacancies[dateString] ?? defaultValue
        
        if (date < defaultAppliedDate) {
            return null
        }
        
        return (
            <Box textAlign="center" fontSize="12px" color="gray.600">
                <Text 
                    color={vacancyCount <= 10 ? "red.500" : "teal.400"}
                    fontWeight={currentVacancies[dateString] ? "bold" : "normal"}
                >
                    {vacancyCount}
                </Text>
            </Box>
        )
    }

    return (
        <Modal size="md" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent top={10} borderRadius={8} marginTop={0}>
                <ModalHeader color="gray.800" fontSize="18px" fontWeight={500} lineHeight={7}>
                    Vacancy Setup
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody border="1px solid #E2E8F0" borderRadius={8} padding={6}>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Default Vacancies (Applied to all dates)</FormLabel>
                            <HStack>
                                <Input
                                    type="number"
                                    value={tempDefaultVacancies}
                                    onChange={(e) => setTempDefaultVacancies(Number(e.target.value))}
                                    min={0}
                                    style={{ width: '30%' }}
                                />
                                <Button
                                    colorScheme="teal"
                                    onClick={handleApplyDefault}
                                >
                                    Apply
                                </Button>
                            </HStack>
                        </FormControl>

                        <Divider />

                        <Box>
                            <FormLabel>Select date to set custom vacancies:</FormLabel>
                            <Box 
                                border="1px solid" 
                                borderColor="gray.200" 
                                borderRadius="md" 
                                p={4}
                                bg="white"
                            >
                                <Calendar
                                    key={updateTrigger}
                                    onChange={handleDateClick}
                                    value={selectedDate}
                                    tileContent={tileContent}
                                    minDate={new Date()}
                                    className="custom-calendar"
                                />
                            </Box>
                        </Box>

                        {selectedDate && (
                            <FormControl>
                                <FormLabel>Custom Vacancies for {selectedDate.toLocaleDateString()}</FormLabel>
                                <HStack>
                                    <Input
                                        type="number"
                                        value={tempCustomVacancies}
                                        onChange={(e) => setTempCustomVacancies(Number(e.target.value))}
                                        min={0}
                                    />
                                    <Button
                                        colorScheme="teal"
                                        onClick={onSubmit}
                                    >
                                        Apply
                                    </Button>
                                </HStack>
                            </FormControl>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default VacancySetup