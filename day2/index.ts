type CubeSet = {
  red: number;
  green: number;
  blue: number;
};

class ColorGame {

  private id: number;
  public readonly sets: CubeSet[];

  public get minimum(): CubeSet {
    return this.sets.reduce((acc, set) => ({
      red: Math.max(acc.red, set.red),
      green: Math.max(acc.green, set.green),
      blue: Math.max(acc.blue, set.blue),
    }), { red: 0, green: 0, blue: 0 } as CubeSet);
  }

  public constructor(id: number,
                     sets: CubeSet[]) {
    this.id = id;
    this.sets = sets;
  }

  public static fromLine(line: string): ColorGame {
    const id = line.match(/game.*?(\d+):/)![1];

    const sets = line.split(':')[1]
      .split(';')
      .map(set => set.trim())
      .map(set => ({
        blue: this.extractColor(set, 'blue'),
        green: this.extractColor(set, 'green'),
        red: this.extractColor(set, 'red'),
      } as CubeSet));

    return new ColorGame(
      parseInt(id),
      sets
    );
  }

  public static extractColor(set: string,
                             color: string): number {
    const colorMatch = set.match(new RegExp(`\\s*(\\d+)\\s*${color}`));

    if (colorMatch) {
      return parseInt(colorMatch[1]);
    }

    return 0;
  }
}

const lines = await Bun.file('input')
  .text();

const games = lines
  .toLowerCase()
  .split('\n')
  .filter(line => !!line)
  .map(line => ColorGame.fromLine(line.trim()));

const sum = games.map(g => g.minimum)
  .map(set => set.red * set.green * set.blue)
  .reduce((acc, val) => acc + val, 0);

console.log(sum);
