/**
 * Checks if value is within provided range. Range should be string with format
 * `x,y` where x and y are integers. Function returns true if value is within
 * range [x, y]. If x or y are omitted, compares value against the provided
 * limit only, e.g. range `x,` will return true if value greater or equal to
 * 'x'.
 */
export default (value: number, range: string) => {
  if (!range) {
    return true;
  }

  if (isNaN(value)) {
    return false;
  }

  const [lowerLimit, upperLimit] = range.split(',').map(l => parseInt(l, 10));

  if (!isNaN(lowerLimit) && value < lowerLimit) {
    return false;
  }

  if (!isNaN(upperLimit) && value > upperLimit) {
    return false;
  }

  return true;
}
