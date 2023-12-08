type Instruction = 'L' | 'R';

type NodeNavigation = {
  start: string,
  end: string,
  cycle: string,
  steps: [number, number]
}

type NodeMap = {
  [key: string]: {
    L: string,
    R: string
  };
}

const [insLine, ...nodes] = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l);

const nodeMap = nodes.reduce((map, line) => {
  const [key, directions] = line.split(' = ');
  const [_, l, r] = directions.match(/\((\w+),\s(\w+)\)/);

  map[key] = {
    L: l,
    R: r
  };

  return map;
}, {} as NodeMap);

let instructionInput = insLine.split('') as Instruction[];

const startNodes = Object.keys(nodeMap).filter(k => k.includes('A'));

const sum = startNodes
  .map(n => navigate(
      n,
      nodeMap,
      instructionInput
    )
  );

console.log(lcm(sum));

function* instructions(line: Instruction[]): Generator<Instruction> {
  const lineLength = line.length;
  let i = 0;

  while (true) {
    yield line[i++ % lineLength];
  }
}

function navigate(startNode: string,
                  nodeMap: NodeMap,
                  instructionInput: Instruction[]): number {
  let count = 0;
  let current = startNode

  const instructor = instructions(instructionInput);

  for (const instruction of instructor) {
    count++;
    current = nodeMap[current][instruction];

    if (current[2] === 'Z') {
      return count;
    }
  }
}

function lcm(list: number[]): number {
  return list.reduce((a, b) => {
    return (a * b) / gcd(a, b);
  });
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}
