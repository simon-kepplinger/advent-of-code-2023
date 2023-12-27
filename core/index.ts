export function cache<T>(
  fn: (...args: unknown[]) => T
): (...args: unknown[]) => T {

  const cache = new Map<string, T>();

  return (...args: unknown[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export type Point = {
  x: number;
  y: number;
};

export type Direction = 'LEFT'
  | 'RIGHT'
  | 'UP'
  | 'DOWN';

export const DIRECTIONS: Record<Direction, Point> = {
  'LEFT': { x: -1, y: 0 },
  'RIGHT': { x: 1, y: 0 },
  'UP': { x: 0, y: -1 },
  'DOWN': { x: 0, y: 1 },
};

export function move(point: Point,
                     direction: Point): Point {
  return {
    x: point.x + direction.x,
    y: point.y + direction.y,
  };
}

export class Grid<T> {
  public grid: T[][];

  public constructor(grid: T[][]) {
    this.grid = grid;
  }

  public set(point: Point,
             value: T): void {
    this.grid[point.y][point.x] = value;
  }

  public at(point: Point): T {
    return this.grid[point.y][point.x];
  }

  public isWithin(point: Point): boolean {
    return point.y >= 0
      && point.y < this.grid.length
      && point.x >= 0
      && point.x < this.grid[point.y].length;
  }

  public print(): void {
    console.log(this.grid.map(r => r.join('')).join('\n'));
  }
}
