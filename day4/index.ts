const lines = (await Bun.file('example').text())
  .split('\n')
  .filter(line => line.length > 0);

const cardMap = new Array(lines.length)
  .fill(1);

lines
  .map(line => line.split(':')[1])
  .map(line => line.split('|').map(list => list.trim()))
  .map(list => [list[0].split(' '), list[1].split(/\s+/)])
  .map(([win, numbers]) => numbers.filter(n => win.includes(n)))
  .map(num => num.length)
  .forEach((num, i) => {
    const factor = cardMap[i];
    const start = i + 1;

    for (let j = start; j < Math.min(start + num, cardMap.length); j++) {
      cardMap[j] += factor;
    }
  });

const sum = cardMap.reduce((a, b) => a + b, 0);

console.log(sum);
