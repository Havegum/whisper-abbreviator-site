export default function btFormatNumber(number: number) {
  return number
    .toLocaleString('nb-NO')
    .replace(/\s/g, Math.abs(number) >= 10_000 ? '.' : '');
}
