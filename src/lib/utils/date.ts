/**
 * @param {string | object} input - Input string will be parsed. Input objects gets forwarded to the Date constructor.
 * @return {Date} This is the result
 */
export function parseDateISOString(input: string): Date {
  if (typeof input === 'object') return new Date(input);
  // If no string, or format doesnt fit YYYY-MM-DD, return `Date(NaN)`
  if (typeof input !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(input))
    return new Date(NaN);
  const string = input;
  // https://stackoverflow.com/a/42626876
  const date: number[] = string
    .split(/\D+/)
    .map(digit => parseInt(digit))
    .slice(0, 6);
  date[1] = date[1] - 1; // adjust month
  return new Date(date[0], date[1], date[2], date[3], date[4], date[4]);
}

const pad = (num: number) => num.toString().padStart(2, '0');

export function formatDate(
  date,
  { time = true, long = false, year = false } = {}
) {
  if (isNaN(date)) return '';

  let str = date.toLocaleString('nb-NO', {
    day: 'numeric',
    month: long ? 'long' : 'short',
  });

  if (year) {
    str += ` ${date.getFullYear()}`;
  }

  if (time) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    str += ` kl. ${pad(hours)}.${pad(minutes)}.${pad(seconds)}`;
  }

  return str;
}
