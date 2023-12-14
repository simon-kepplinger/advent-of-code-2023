import { unwatchFile } from 'fs';

type Line = 'row' | 'col';

class Grid {

  private readonly grid: string[][];

  public constructor(lines: string[]) {
    this.grid = lines.map(l => l.split(''));
  }

  public getLength(line: Line): number {
    return line === 'row' ? this.grid.length : this.grid[0].length;
  }

  public get(line: Line,
             pos: number): string[] {
    if (line === 'row') {
      return this.grid[pos];
    } else {
      return this.grid.map(row => row[pos]);
    }
  }

  public* iterate(line: Line,
                  pad: number): IterableIterator<number> {
    for (let i = 0; i < this.getLength(line) - pad; i++) {
      yield i;
    }
  }

  public isMirroring(line: Line,
                     start: number): boolean {
    const length = this.getLength(line);
    let smudge = 1;

    for (let i = 0; start - i >= 0 && i + start + 1 < length; i++) {
      const offset = this.compare(line, start - i, start + i + 1);

      if (offset !== 0) {
        smudge -= offset
      }

      if (smudge < 0) {
        return false;
      }
    }

    return smudge !== 1;
  }

  public compare(line: Line,
                 a: number,
                 b: number): number {
    return this.getDifferences(
      this.get(line, a),
      this.get(line, b)
    );
  }

  private getDifferences(a: string[],
                         b: string[]): number {
    let differences = 0;

    a.forEach((c, i) => {
      if (c !== b[i]) {
        differences++;
      }
    });

    return differences;
  }
}

class Ground {

  private grid: Grid;

  public get mirrorValue(): number {
    return this.getMirror('row') * 100
      + this.getMirror('col');
  }

  public constructor(lines: string[]) {
    this.grid = this.grid = new Grid(lines);
  }

  public getMirror(line: Line): number {
    for (const i of this.grid.iterate(line, 1)) {
      const isMirror = this.grid.compare(line, i, i + 1) <= 1
        && this.grid.isMirroring(line, i);

      if (isMirror) {
        return i + 1;
      }
    }

    return 0;
  }
}

const sum = (await Bun.file('input').text())
  .trim()
  .split('\n\n')
  .map(l => l.split('\n'))
  .map(l => new Ground(l))
  .map(g => g.mirrorValue)
  .reduce((a, b) => a + b, 0);

console.log(sum);
