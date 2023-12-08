const input = await Bun.file('input').text();

const list = input.split('\n')
  .filter(l => !!l)
  .map(l => l.split(':')[1].replace(/\s+/g, '').trim())
  .map(v => Number(v));

console.log(list);

const wins = getWins(list[0], list[1]);
console.log(wins);

function getWins(time: number,
                 record: number): number {
  let wins = 0;

  for (const distance of getDistances(time)) {
    if (record < distance) {
      wins++;
    } else if (wins > 0) {
      return wins; // exit early if no wins are possible anymore
    }
  }

  return wins;
}

function* getDistances(total: number): Generator<number> {
  for (let i = 0; i < total; i++) {
    yield getDistance(i, total);
  }
}

function getDistance(hold: number,
                     total: number): number {
  const travel = total - hold;

  return travel * hold;
}
