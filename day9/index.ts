class Data {

  public sequence: number[] = [];

  public constructor(value: string) {
    this.sequence = value.split(' ').map(Number);
  }

  public predict(data: number[]): number {
    if (data.every(n => n === 0)) {
      return 0;
    } else {
      return data[0] - this.predict(this.next(data));
    }
  }

  public next(sequence: number[]): number[] {
    let newSequence = new Array<number>(sequence.length - 1);

    for (let i = 0; i < newSequence.length; i++) {
      newSequence[i] = sequence[i + 1] - sequence[i];
    }

    return newSequence;
  }
}

const sum = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l)
  .map(l => new Data(l))
  .map(d => d.predict(d.sequence))
  .reduce((a, b) => a + b, 0);

console.log(sum);
