class SpringCounter {

  private cache<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => T {
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

  public count = this.cache((springs: string,
                             groups: number[]) => {

    // handle empty springs
    if (springs.length === 0) {
      if (groups.length === 0) {
        return 1; // the run was possible
      }

      return 0; // this run was impossible
    }

    // no groups left, then also no springs are allowed anymore
    if (groups.length === 0) {
      return springs.includes('#') ? 0 : 1;
    }

    const remaining = groups.reduce((a, b) => a + b, 0);

    // no space is left to fit solution
    if (springs.length < remaining + groups.length - 1) {
      return 0;
    }

    // skip and try next
    if (springs[0] === '.') {
      return this.count(springs.slice(1), groups);
    }

    // group has to start (try next group if exactly right)
    if (springs[0] === '#') {
      const [group, ...rest] = groups;

      for (let i = 0; i < group; i++) {
        // group is too small
        if (springs[i] === '.') {
          return 0;
        }
      }

      // group is larger
      if (springs[group] === '#') {
        return 0;
      }

      return this.count(springs.slice(group + 1), rest);
    }

    // you have a ? and have to try both
    return this.count('.' + springs.slice(1), groups)
      + this.count('#' + springs.slice(1), groups);
  });
}

class SpringRow {
  public springs: string;
  public groups: number[] = [];

  public constructor(line: string) {
    const [springs, numbers] = line.split(' ');

    this.springs = new Array(5).fill(null).map(_ => springs)
      .join('?');

    this.groups = new Array(5).fill(null).map(_ => numbers)
      .join(',')
      .split(',')
      .map(Number);
  }
}

const counter = new SpringCounter();

const rows = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l)
  .map(l => new SpringRow(l));

const sum = rows.map(r => counter.count(r.springs, r.groups))
  .reduce((a, b) => a + b, 0);

console.log(sum);
