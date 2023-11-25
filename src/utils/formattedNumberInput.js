const PATTERN = /[^0-9]/g;
const PATTERN_STARTSWITH = /^0+/;
export const getInputNumbersValue = (value) => {
  if (value) {
    const newValue = value.replace(PATTERN, "").replace(PATTERN_STARTSWITH, "");
    return newValue;
  }
  return "";
};

export const currenciesFormatted = (value) => {
  if (value !== null) {
    return value + " ₽";
  }
  return "";
};
