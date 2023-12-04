type Field = {
  x: number;
  y: number;
};

class Grid {
  public grid: string[][];

  public get length(): number {
    return this.grid.length;
  }

  public get width(): number {
    return this.grid[0].length;
  }

  public constructor(lines: string[]) {
    this.grid = lines.map(line => line.split(''));
  }

  public get(field: Field): string | null {
    if (field.y < 0 || field.y >= this.length) {
      return null;
    }

    if (field.x < 0 || field.x >= this.width) {
      return null;
    }

    return this.grid[field.y][field.x];
  }

  public isDigit(field: Field): boolean {
    const value = this.get(field);

    return !!value
      && /\d/.test(value);
  }

  public isSymbol(field: Field): boolean {
    const value = this.get(field);

    return !!value
      && /[^\\.|\d]/.test(value);
  }
}

class Sequence {
  public from: Field;
  public to: Field;

  public constructor(from: Field,
                     to: Field) {
    this.from = from;
    this.to = to;
  }

  public getValue(grid: Grid): string {
    let value = '';

    for (let x = this.from.x; x <= this.to.x; x++) {
      value += grid.get({ y: this.from.y, x });
    }

    return value;
  }

  public getNeighbours(): Field[] {
    const neighbours: Field[] = [
      { x: this.from.x - 1, y: this.from.y - 1 },
      { x: this.from.x - 1, y: this.from.y },
      { x: this.from.x - 1, y: this.from.y + 1 },
      { x: this.to.x + 1, y: this.to.y - 1 },
      { x: this.to.x + 1, y: this.to.y },
      { x: this.to.x + 1, y: this.to.y + 1 },
    ];

    for (let x = this.from.x; x <= this.to.x; x++) {
      neighbours.push({ x, y: this.from.y - 1 });
      neighbours.push({ x, y: this.from.y + 1 });
    }

    return neighbours;
  }

  public isInSequence(field: Field): boolean {
    const x = field.x;
    const y = field.y;

    return (x >= this.from.x && x <= this.to.x)
      && (y >= this.from.y && y <= this.to.y);
  }
}

class Engine {

  public grid: Grid;
  public numbers: Sequence[];
  public gears: Sequence[];

  public constructor(lines: string[]) {
    this.grid = new Grid(lines);

    this.numbers = this.createNumberSequences(this.grid);
    this.gears = this.createGearSequences(this.grid);
  }

  public createGearSequences(grid: Grid): Sequence[] {
    const gears = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.get({ x, y }) === '*') {
          gears.push(new Sequence({ x, y }, { x, y }));
        }
      }
    }

    return gears;
  }

  public createNumberSequences(grid: Grid): Sequence[] {
    const numbers: Sequence[] = [];

    for (let y = 0; y < grid.length; y++) {
      let seqStart: Field | null = null;
      let seqEnd: Field | null = null;

      // also check behind last field to finish last sequence
      for (let x = 0; x <= grid.width; x++) {
        const field = Number(grid.get({ x, y }) ?? NaN);

        if (!isNaN(field)) {
          if (!seqStart) {
            seqStart = { x, y };
          }
          seqEnd = { x, y };
        } else {
          if (seqStart && seqEnd) {
            numbers.push(new Sequence(seqStart, seqEnd));

            seqStart = null;
            seqEnd = null;
          }
        }
      }
    }

    return numbers;
  }

  public getMatchingNumber(fields: Field[]): Sequence[] {
    return this.numbers
      .filter(n => fields.some(f => n.isInSequence(f)));
  }
}

const input = await Bun.file('input')
  .text();

const lines = input
  .split('\n')
  .map(line => line.trim())
  .filter(line => !!line);

const engine = new Engine(lines);

const numberSum = engine
  .numbers
  .filter(n =>
    n.getNeighbours()
      .some(f => engine.grid.isSymbol(f))
  )
  .map(n => n.getValue(engine.grid))
  .map(Number)
  .reduce((a, b) => a + b, 0);

const gearNumbers = engine
  .gears
  .map(g => g.getNeighbours())
  .map(n => engine.getMatchingNumber(n))
  .filter(n => n.length === 2)
  .map(n => n.map(s => Number(s.getValue(engine.grid))))
  .map(n => n[0] * n[1])
  .reduce(sum, 0);

console.log(numberSum);
console.log(gearNumbers);

function sum(a: number, b: number): number {
  return a + b;
}
