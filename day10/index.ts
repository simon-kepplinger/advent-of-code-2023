type Point = {
  x: number;
  y: number;
}

const UP: Point = { x: 0, y: -1 };
const DOWN: Point = { x: 0, y: 1 };
const LEFT: Point = { x: -1, y: 0 };
const RIGHT: Point = { x: 1, y: 0 };

const Pipes = {
  '|': [UP, DOWN],
  '-': [LEFT, RIGHT],
  'L': [UP, RIGHT],
  'J': [UP, LEFT],
  '7': [LEFT, DOWN],
  'F': [RIGHT, DOWN],
  'S': [UP, DOWN, LEFT, RIGHT],
};

type PipeChar = keyof typeof Pipes;

class Grid {

  public readonly grid: string[][] = [];

  public get length(): number {
    return this.grid.length;
  }

  public get width(): number {
    return this.grid[0].length;
  }

  public constructor(grid: string[][]) {
    this.grid = grid;
  }

  public at(point: Point): string {
    return this.grid[point.y][point.x];
  }

  public set(point: Point,
             value: string): void {
    this.grid[point.y][point.x] = value;
  }

  public isIn(point: Point): boolean {
    return point.y >= 0
      && point.x >= 0
      && this.grid.length > point.y
      && this.grid[point.y].length > point.x;
  }

  public print(): void {
    for (const line of this.grid) {
      console.log(line.join(''));
    }
  }
}

class Sketch {

  public readonly grid: Grid;
  public loop: Point[] = [];

  public constructor(lines: string[]) {
    this.grid = new Grid(lines.map(l => l.split('')));
    this.loop = this.createLoop();
  }

  public createLoop(): Point[] {
    const start = this.findStart();

    let loop: Point[] = [start];
    let next: Point = start;

    while (true) {
      const directions = Pipes[this.grid.at(next)];
      const nextPipes = this.findNextPipes(next, directions)
        .filter(p => !loop.find(l => l.x === p.x && l.y === p.y));

      next = nextPipes[0];

      if (!next) {
        return loop;
      }

      loop.push(next);
    }
  }

  private findNextPipes(point: Point,
                        directions: Point[]): Point[] {
    return directions
      .map(d => this.findNext(point, d))
      .filter(p => !!p) as Point[];
  }

  private findNext(point: Point,
                   direction: Point): Point | null {
    const x = point.x + direction.x;
    const y = point.y + direction.y;

    if (!this.grid.isIn({ x, y })) {
      return null;
    }

    const nextPipe = this.grid.at({ x, y });
    const nextPipeDirections = Pipes[nextPipe as PipeChar];

    if (!nextPipeDirections
      || !nextPipeDirections.includes(this.getMatchingDirection(direction))) {
      return null;
    }

    return { x, y };
  }

  private findStart(): Point {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.at({ x, y }) === 'S') {
          return { x, y };
        }
      }
    }

    throw new Error('No start found');
  }

  private getMatchingDirection(direction: Point): Point {
    switch (direction) {
      case UP:
        return DOWN;
      case DOWN:
        return UP;
      case LEFT:
        return RIGHT;
      case RIGHT:
        return LEFT;
      default:
        throw new Error('Invalid direction');
    }
  }
}

class ScaledPipe {
  public grid: Grid;

  public constructor(sketch: Sketch) {
    this.grid = this.scaleGrid(sketch);
    this.floodFill(this.grid);
  }

  private scaleGrid(sketch: Sketch): Grid {
    const scaledGrid = new Array(sketch.grid.length * 3).fill(null)
      .map(() => new Array(sketch.grid.width * 3).fill('.'));

    for (const pipe of sketch.loop) {
      const y = pipe.y * 3 + 1;
      const x = pipe.x * 3 + 1;

      scaledGrid[y][x] = 'X';
      Pipes[sketch.grid.at(pipe)]
        .forEach(d => scaledGrid[y + d.y][x + d.x] = 'X');
    }

    return new Grid(scaledGrid);
  }

  // Fill all neighboring . characters with O starting from top left
  private floodFill(grid: Grid): void {
    const queue: Point[] = [{ x: 0, y: 0 }];

    while (queue.length) {
      const point = queue.shift() as Point;

      const neighbors = [
        { x: point.x - 1, y: point.y },
        { x: point.x + 1, y: point.y },
        { x: point.x, y: point.y - 1 },
        { x: point.x, y: point.y + 1 },
      ];

      for (const neighbor of neighbors) {
        if (!grid.isIn(neighbor)) {
          continue;
        }

        if (grid.at(neighbor) === '.') {
          grid.set(neighbor, 'O');
          queue.push(neighbor);
        }
      }
    }
  }

  public countInside(grid: Grid): number {
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.width; x++) {

        const element = this.grid.at({ x: x * 3 + 1, y: y * 3 + 1 });

        if (element === '.') {
          count++;
        }
      }
    }

    return count;
  }
}

const input = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l);

const sketch = new Sketch(input);
const scaled = new ScaledPipe(sketch);

sketch.grid.print();
console.log();
scaled.grid.print();

const count = scaled.countInside(sketch.grid);

console.log(count);
