const input = await Bun.file('input').text();

const sum = input.split('\n')
  .map(line => convertToDigits(line))
  .map(line => {
    console.log(line);
    return line;
  })
  .filter(digits => digits.length > 0)
  .map(digits => parseInt(digits[0] + digits[digits.length - 1]))
  .reduce((a, b) => a + b, 0);

console.log(sum);

function convertToDigits(line: string): string {
  let digits = '';

  for (let i = 0; i < line.length; i++) {
    if (/\d/.test(line[i])) {
      digits += line[i];
    }
    digits += convertDigit(line, i, 'one', '1');
    digits += convertDigit(line, i, 'two', '2');
    digits += convertDigit(line, i, 'three', '3');
    digits += convertDigit(line, i, 'four', '4');
    digits += convertDigit(line, i, 'five', '5');
    digits += convertDigit(line, i, 'six', '6');
    digits += convertDigit(line, i, 'seven', '7');
    digits += convertDigit(line, i, 'eight', '8');
    digits += convertDigit(line, i, 'nine', '9');
  }

  return digits;
}

function convertDigit(line: string,
                      i: number,
                      spelledDigit: string,
                      digit: string): string {
  if (line.slice(i, i + spelledDigit.length) === spelledDigit) {
    return digit;
  }

  return '';
}
