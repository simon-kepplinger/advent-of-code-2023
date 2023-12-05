class Almanac {
  [type: string]: Mapper['map'];

  public find(type: string,
              input: number): number {
    const { key, value } = this[type](input);

    if (key === 'location') {
      return value;
    }

    return this.find(key, value);
  }
}

class MapRange {
  public source: number;
  public dest: number;
  public range: number;

  public constructor(line: string) {
    const [dest, source, range] = line.split(' ');
    this.source = Number(source);
    this.dest = Number(dest);
    this.range = Number(range);
  }
}

class Mapper {
  private readonly toType: string;
  private readonly ranges: MapRange[] = [];

  public constructor(toType: string,
                     ranges: MapRange[]) {
    this.toType = toType;
    this.ranges = ranges;
  }

  public map(value: number): { key: string, value: number } {
    const range = this.findRange(value);

    if (range) {
      value = value + range.dest - range.source;
    }

    return {
      key: this.toType,
      value: value
    };
  }

  private findRange(value: number): MapRange | null {
    for (const range of this.ranges) {
      if (value >= range.source && value <= range.source + range.range) {
        return range;
      }
    }
  }
}

const [seedLine, ...mapLines] = (await Bun.file('input').text())
  .split('\n\n') as string[];

const seeds = seedLine
  .split(':')[1]
  .trim()
  .split(' ')
  .map(s => Number(s));

const almanac = mapLines
  .map(line => line.split('\n'))
  .reduce((almanac, map) => {
      const [header, ...lines] = map;
      const [_, from, to] = header.match(/(\w+)-to-(\w+)/);
      const ranges: MapRange[] = lines.map(l => new MapRange(l));

      const mapper = new Mapper(to, ranges);
      almanac[from] = mapper.map.bind(mapper);

      return almanac;
    },
    new Almanac()
  );

let minLocation = Number.POSITIVE_INFINITY;

getSeedPairs(seeds)
  .forEach(([seed, range]) => {
    for (let i = seed; i < seed + range; i++) {
      if (i % 10000000 === 0) {
        console.log(i);
      }

      const loc = almanac.find('seed', i);

      if (loc < minLocation) {
        minLocation = loc;
      }
    }
  });

console.log(minLocation);

function getSeedPairs(seeds: number[]): ([number, number])[] {
  const pairs = [];

  for (let i = 0; i < seeds.length - 1; i += 2) {
    pairs.push([seeds[i], seeds[i + 1]]);
  }

  return pairs;
}
