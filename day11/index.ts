type Point = {
  x: number;
  y: number;
}

class Universe {

  public galaxies: Point[];

  private emptyRows: number[] = [];
  private emptyCols: number[] = [];

  public constructor(lines: string[]) {
    this.galaxies = this.getGalaxies(lines.map(l => l.split('')));

    this.emptyRows = Array.from({ length: lines.length }, (_, i) => i)
      .filter(y => !this.galaxies.some(g => g.y === y));

    this.emptyCols = Array.from({ length: lines[0].length }, (_, i) => i)
      .filter(x => !this.galaxies.some(g => g.x === x));
  }

  private getGalaxies(grid: string[][]): Point[] {
    const galaxies: Point[] = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '#') {
          galaxies.push({ x, y });
        }
      }
    }

    return galaxies;
  }

  public getDistances(): number[] {
    let distances: number[] = [];

    for (let i = 0; i < this.galaxies.length; i++) {
      for (let j = i + 1; j < this.galaxies.length; j++) {
        const distance = this.getDistance(this.galaxies[i], this.galaxies[j]);

        distances.push(distance);
      }
    }

    return distances;
  }

  private getDistance(a: Point, b: Point): number {
    const distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    const [minX, maxX] = [a.x, b.x].sort((a, b) => a - b);
    const [minY, maxY] = [a.y, b.y].sort((a, b) => a - b);

    const addX = this.emptyCols.filter(x => x > minX && x < maxX).length;
    const addY = this.emptyRows.filter(y => y > minY && y < maxY).length;

    return distance
      + addX * 1000000 - addX
      + addY * 1000000 - addY;
  }
}

const input = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l);

const universe = new Universe(input);

const sum = universe.getDistances()
  .reduce((a, b) => a + b, 0);

console.log(sum);
