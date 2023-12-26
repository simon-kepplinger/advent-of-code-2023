class Lens {

  public label: string;
  public focalLength: number;

  public constructor(value: string) {
    const [label, focalLength] = value.split(/[=\-]/);

    this.label = label;
    this.focalLength = Number(focalLength);
  }

  public get box(): number {
    return this.hash(this.label.split(''), 0);
  }

  private hash(input: string[], value: number): number {
    const [first, ...rest] = input;
    value = (value + first.charCodeAt(0)) * 17 % 256;

    if (rest.length === 0) {
      return value;
    } else {
      return this.hash(rest, value);
    }
  }
}

const boxes = new Array(256)
  .fill(null)
  .map(() => ([]));

const lenses = (await Bun.file('input').text())
  .trim()
  .split(',')
  .map(i => new Lens(i));

for (const lens of lenses) {
  const containing = boxes[lens.box].find(i => i.label === lens.label);

  if (lens.focalLength === 0) {
    boxes[lens.box] = boxes[lens.box].filter(i => i.label !== lens.label);
  } else if (!containing) {
    boxes[lens.box].push(lens);
  } else {
    containing.focalLength = lens.focalLength;
  }
}

const sum = boxes.map(
  (lenses, boxNumber) => lenses.map(
    ({ focalLength }, slot) => (boxNumber + 1) * (slot + 1) * focalLength
  )
).reduce((a, b) => a.concat(b), []).reduce((a, b) => a + b, 0);

console.log(sum);
