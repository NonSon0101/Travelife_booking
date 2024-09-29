import { useMediaQuery } from '@chakra-ui/react'
import { EBreakPoint } from 'enums/theme'
const useBreakPoint = (breakpoint: EBreakPoint): boolean => {
  const [isLargerThan] = useMediaQuery(`(min-width: ${getBreakPointValue(breakpoint)})`)
  return isLargerThan
}

const getBreakPointValue = (breakpoint: EBreakPoint): string => {
  switch (breakpoint) {
    case EBreakPoint.SM:
      return '30em' // 480px
    case EBreakPoint.MD:
      return '48em' // 768px
    case EBreakPoint.LG:
      return '62em' // 992px
    case EBreakPoint.XL:
      return '80em' // 1280px
    default:
      return '0em'
  }
}

export default useBreakPoint
