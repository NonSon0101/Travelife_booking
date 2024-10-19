import { IOption } from 'components/Dropdown'
import { PLATFORM } from 'enums/common'
import get from 'lodash/get'

export function checkValidArray<T>(array?: T[]): boolean {
  return array ? Array.isArray(array) && array?.length > 0 : false
}

export function getValidArray<T>(array?: T[]): T[] {
  return checkValidArray<T>(array) ? array || [] : []
}

export function getAccessToken(platform: PLATFORM): string {
  if (typeof window !== 'undefined') {
    // Running in the browser, safe to access localStorage and sessionStorage
    return localStorage.getItem(`${platform}Token`) ?? sessionStorage.getItem(`${platform}Token`) ?? '';
  }
  // Return an empty string or a default value when not in the browser
  return '';
}

export function getOptions<T>(array: T[], labelKey: string, valueKey: string): IOption[] {
  return getValidArray(array).map(option => ({
    label: get(option, labelKey ?? ''),
    value: get(option, valueKey ?? '')
  }))
}

export function formatCurrency(amount: number): string {
  const amountString = amount.toString();
  const amountArray = amountString.split('');
  const reversedArray = amountArray.reverse();
  let resultArray: string[] = [];
  for (let i = 0; i < reversedArray.length; i++) {
    if (i > 0 && i % 3 === 0) {
      resultArray.push('.');
    }
    resultArray.push(reversedArray[i]);
  }

  const formattedAmount = resultArray.reverse().join('');
  return formattedAmount + ' VNĐ';
}