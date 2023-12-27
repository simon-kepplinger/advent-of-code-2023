import { Direction, DIRECTIONS, Grid, move, Point } from '../core';

const Mirrors = {
  '.': {
    'LEFT': ['LEFT'],
    'RIGHT': ['RIGHT'],
    'UP': ['UP'],
    'DOWN': ['DOWN'],
  },
  '/': {
    'LEFT': ['DOWN'],
    'RIGHT': ['UP'],
    'UP': ['RIGHT'],
    'DOWN': ['LEFT'],
  },
  '\\': {
    'LEFT': ['UP'],
    'RIGHT': ['DOWN'],
    'UP': ['LEFT'],
    'DOWN': ['RIGHT'],
  },
  '-': {
    'LEFT': ['LEFT'],
    'RIGHT': ['RIGHT'],
    'UP': ['LEFT', 'RIGHT'],
    'DOWN': ['LEFT', 'RIGHT'],
  },
  '|': {
    'LEFT': ['UP', 'DOWN'],
    'RIGHT': ['UP', 'DOWN'],
    'UP': ['UP'],
    'DOWN': ['DOWN'],
  },
};

type Energy = {
  amount: number;
  from: Direction[];
}

class Field {
  public mirrors: Grid<string>;
  public energy: Grid<Energy>;

  public constructor(mirrors: string[][]) {
    this.mirrors = new Grid(mirrors);
    this.energy = new Grid(mirrors.map(r => r.map(() => ({ amount: 0, from: [] }))));
  }

  public beam(point: Point,
              direction: Direction): void {
    if (this.energy.isWithin(point)) {
      const energy = this.energy.at(point);

      if (energy.from.includes(direction)) {
        return;
      }

      energy.amount += 1;
      energy.from.push(direction);
    }

    const next = move(point, DIRECTIONS[direction]);

    if (this.mirrors.isWithin(next)) {
      const mirror = this.mirrors.at(next);

      for (const dir of Mirrors[mirror][direction]) {
        this.beam(next, dir);
      }
    }

    return;
  }
}

const input = (await Bun.file('input').text())
  .trim()
  .split('\n')
  .map((line) => line.split(''));

const leftStart = new Array(input.length).fill(0).map((_, i) => ({ x: -1, y: i }));
const rightStart = new Array(input.length).fill(0).map((_, i) => ({ x: input[0].length, y: i }));
const upStart = new Array(input[0].length).fill(0).map((_, i) => ({ x: i, y: -1 }));
const downStart = new Array(input[0].length).fill(0).map((_, i) => ({ x: i, y: input.length }));

const fields = [
  ...leftStart.map((p) => createField(p, 'RIGHT')),
  ...rightStart.map((p) => createField(p, 'LEFT')),
  ...upStart.map((p) => createField(p, 'DOWN')),
  ...downStart.map((p) => createField(p, 'UP')),
];

const sums = fields.map((field) => {
  let sum = 0;
  field.energy.grid.forEach((row) => row.forEach(e => sum += e.amount ? 1 : 0));
  return sum;
});

console.log(Math.max(...sums));

function createField(start: Point, direction: Direction): Field {
  const field = new Field(input);
  field.beam(start, direction);
  return field;
}
