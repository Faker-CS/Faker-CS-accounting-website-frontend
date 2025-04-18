import { parsePhoneNumber } from 'react-phone-number-input';

import { countries } from 'src/assets/data/countries';

// ----------------------------------------------------------------------

export function getCountryCode(inputValue, countryCode) {
  if (inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);

    if (phoneNumber) {
      return phoneNumber?.country;
    }
  }

  return countryCode ?? 'US';
}

// ----------------------------------------------------------------------

export function getCountry(countryCode) {
  const option = countries.filter((country) => country.code === countryCode)[0];
  return option;
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, query }) {
  if (!query) return inputData;

  const lowerCaseQuery = query.toLowerCase();

  return inputData.filter(({ label, code, phone }) =>
    [label, code, phone].some((field) => field.toLowerCase().includes(lowerCaseQuery))
  );
}
