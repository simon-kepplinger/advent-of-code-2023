type Point = { x: number, y: number };

const DIRECTION = {
  NORTH: { x: 0, y: -1 },
  EAST: { x: 1, y: 0 },
  SOUTH: { x: 0, y: 1 },
  WEST: { x: -1, y: 0 }
} as const;

class RocksField {

  public field: string[][];

  public constructor(input: string[]) {
    this.field = this.toField(input);
  }

  public get load(): number {
    let load = 0;

    for (let y = 0; y < this.field.length; y++) {
      for (let x = 0; x < this.field.length; x++) {
        if (this.field[y][x] === 'O') {
          load += this.field.length - y;
        }
      }
    }

    return load;
  }

  public tilt(direction: keyof typeof DIRECTION): void {
    switch (direction) {
      case 'NORTH':
        for (let j = 0; j < this.field.length; j++) {
          for (let i = 0; i < this.field[j].length; i++) {
            this.handlePoint(j, i, direction);
          }
        }
        break;

      case 'SOUTH':
        for (let j = 0; j < this.field.length; j++) {
          for (let i = this.field[j].length - 1; i >= 0; i--) {
            this.handlePoint(j, i, direction);
          }
        }
        break;

      case 'WEST':
        for (let i = 0; i < this.field[0].length; i++) {
          for (let j = 0; j < this.field.length; j++) {
            this.handlePoint(j, i, direction);
          }
        }
        break;

      case 'EAST':
        for (let i = 0; i < this.field[0].length; i++) {
          for (let j = this.field.length - 1; j >= 0; j--) {
            this.handlePoint(j, i, direction);
          }
        }
        break;
    }
  }

  public toString(field: string[][]): string {
    return field.map((row) => row.join('')).join('\n');
  }

  private handlePoint(x: number,
                      y: number,
                      direction: keyof typeof DIRECTION): void {
    if (this.field[y][x] === '.') {
      const nextRock = this.findNextRock({ x, y }, direction);

      if (nextRock) {
        this.field[y][x] = 'O';
        this.field[nextRock.y][nextRock.x] = '.';
      }
    }
  }

  private toField(input: string[]): string[][] {
    return input.map((row) => row.split(''));
  }

  private findNextRock(from: Point,
                       to: keyof typeof DIRECTION): Point | null {
    let point = this.move(from, to, -1);

    while (this.isWithin(point)) {
      if (this.field[point.y][point.x] === 'O') return point;
      if (this.field[point.y][point.x] === '#') return null;

      point = this.move(point, to, -1);
    }

    return null;
  }

  private move(from: Point,
               to: keyof typeof DIRECTION,
               direction: number = 1): Point {
    return {
      x: from.x + DIRECTION[to].x * direction,
      y: from.y + DIRECTION[to].y * direction
    };
  }

  private isWithin(point: Point): boolean {
    return point.x >= 0
      && point.x < this.field.length
      && point.y >= 0
      && point.y < this.field.length;
  };
}

const input = (await Bun.file('input').text())
  .trim()
  .split('\n');

const field = new RocksField(input);

let fields: { field: string, cycle: number }[] = [];
let cycleFound = false;

for (let i = 0; i < 1000000000; i++) {
  field.tilt('NORTH');
  field.tilt('WEST');
  field.tilt('SOUTH');
  field.tilt('EAST');

  const stringField = field.toString(field.field);
  const matching = fields.find((f) => f.field === stringField);

  if (!cycleFound) {
    if (matching) {
      const cycle = i - matching.cycle;
      const remaining = (1000000000 - matching.cycle);

      i = 1000000000 - (remaining % cycle);
      cycleFound = true;
    } else {
      fields.push({
        field: stringField,
        cycle: i
      });
    }
  }
}

console.log(field.load);
