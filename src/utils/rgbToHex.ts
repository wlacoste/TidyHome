export function rgbToHex(rgb) {
  // Extract the numbers from the string
  const result = rgb.match(/\d+/g);

  if (result) {
    // Convert each number to a two-digit hexadecimal string
    const r = parseInt(result[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(result[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(result[2], 10).toString(16).padStart(2, '0');

    // Concatenate the hex strings and prepend with #
    return `#${r}${g}${b}`;
  }

  // Return null if the input string is not in the expected format
  return 'red';
}
