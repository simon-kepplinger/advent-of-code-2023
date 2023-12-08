const CARD_VALUE_MAP = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 1,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
};

class Hand {

  public cards: string[];
  public handValue: number;
  public bid: number;

  public get distincts(): number[] {
    let jokers = 0;

    const distinctsMap: Record<string, number> = this.cards
      .reduce((distincts, c) => {
        if (c === 'J')
          jokers++;
        else if (distincts[c])
          distincts[c]++;
        else
          distincts[c] = 1;

        return distincts;
      }, {});

    const distincts = Object.values(distinctsMap)
      .sort((a, b) => b - a);

    if (jokers === 5)
      return [5];
    else
      distincts[0] += jokers;

    return distincts;
  }

  public constructor(cards: string,
                     bid: string) {
    this.cards = cards.split('');
    this.bid = Number(bid);

    this.handValue = this.getHandValue();
  }

  private getHandValue(): number {
    const d = this.distincts;

    if (d.includes(5))
      return 6;
    if (d.includes(4))
      return 5;
    if (d.includes(3) && d.includes(2))
      return 4;
    if (d.includes(3))
      return 3;
    if (d.filter(v => v === 2).length === 2)
      return 2;
    if (d.includes(2))
      return 1;

    return 0;
  }

  public compare(other: Hand): number {
    if (this.handValue === other.handValue) {
      return this.compareHandOrder(other);
    }

    return this.handValue - other.handValue;
  }

  private compareHandOrder(other: Hand): number {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] !== other.cards[i])
        return CARD_VALUE_MAP[this.cards[i]] - CARD_VALUE_MAP[other.cards[i]];
    }
  }
}

const sum = (await Bun.file('input').text())
  .split('\n')
  .filter(l => !!l)
  .map(l => l.split(' '))
  .map(([cards, bid]) => new Hand(cards, bid))
  .sort((a, b) => a.compare(b))
  .reduce((sum, hand, i) => sum + (i + 1) * hand.bid, 0);

console.log(sum);


