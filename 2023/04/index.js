function parseInput(input) {
    return input.trim().split('\n').reduce((res, line) => {
        const [idStr, card] = line.split(':');
        const id = parseInt(idStr.replaceAll(/\D+/g, ''));
        const [win, own] = card.split('|').map(s => s.trim().split(/\D+/).map(s => parseInt(s)));
        const matches = win.reduce((res, n) => res + Number(own.includes(n)), 0);
        res[id] = { id, win, own, matches };
        return res;
    }, {});
}
export function partOne(input) {
    return Object.values(parseInput(input)).reduce((sum, { matches }) => (sum + (matches ? Math.pow(2, matches - 1) : 0)), 0);
}
export function partTwo(input) {
    const cards = parseInput(input);
    const queue = Object.values(cards);
    for (const { id, matches } of queue) {
        for (let j = 0, k = id + 1; j < matches; j++, k++) {
            queue.push(cards[k]);
        }
    }
    return queue.length;
}
