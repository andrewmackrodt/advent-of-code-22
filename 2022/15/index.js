const pointRegExp = new RegExp(/Sensor at x=(-?[0-9]+), ?y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), ?y=(-?[0-9]+)/i);
function getManhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function getSensors(input) {
    const sensors = [];
    for (const line of input.split('\n').filter(line => Boolean(line.length))) {
        const match = pointRegExp.exec(line);
        if (!match)
            throw new Error('Input Error');
        const closestBeacon = {
            x: parseInt(match[3], 10),
            y: parseInt(match[4], 10),
        };
        const sensorPoint = {
            x: parseInt(match[1], 10),
            y: parseInt(match[2], 10),
        };
        const distance = getManhattanDistance(sensorPoint, closestBeacon);
        sensors.push({
            x: sensorPoint.x,
            y: sensorPoint.y,
            closestBeacon,
            bound: {
                x1: sensorPoint.x - distance,
                x2: sensorPoint.x + distance,
                y1: sensorPoint.y - distance,
                y2: sensorPoint.y + distance,
            },
            distance,
        });
    }
    return sensors.sort((a, b) => a.y - b.y);
}
function getXIntersectsAtY(sensors, y, includeClosestBeacon) {
    const intersections = [];
    for (const sensor of sensors) {
        if (!(sensor.bound.y1 <= y && y <= sensor.bound.y2)) {
            continue;
        }
        const delta = sensor.distance - Math.abs(sensor.y - y);
        let min = sensor.x - delta;
        let max = sensor.x + delta;
        if (!includeClosestBeacon && sensor.closestBeacon.y === y) {
            if (sensor.closestBeacon.x === min) {
                min++;
            }
            else if (sensor.closestBeacon.x === max) {
                max--;
            }
        }
        if (min <= max) {
            intersections.push([min, max]);
        }
    }
    return intersections;
}
function uniqueIntersects(ranges) {
    const unique = [];
    const sorted = ranges.sort((a, b) => a[0] - b[0]);
    let prev = sorted[0];
    unique.push(prev);
    for (let i = 1, len = sorted.length; i < len; i++) {
        const curr = sorted[i];
        if (curr[0] - 1 <= prev[1]) {
            if (prev[1] < curr[1]) {
                prev[1] = curr[1];
            }
            continue;
        }
        unique.push(curr);
        prev = curr;
    }
    return unique;
}
function getSensorXIntersectsAtY(sensors, y, includeClosestBeacon) {
    return uniqueIntersects(getXIntersectsAtY(sensors, y, includeClosestBeacon));
}
function volume(range) {
    return 1 + Math.abs(range[1] - range[0]);
}
export function partOne(input, y) {
    const sensors = getSensors(input);
    if (!y)
        y = sensors[sensors.length - 1].y < 1000 ? 10 : 2000000;
    return getSensorXIntersectsAtY(sensors, y, false).reduce((total, range) => total + volume(range), 0);
}
export function partTwo(input, max) {
    const sensors = getSensors(input);
    if (!max)
        max = sensors[sensors.length - 1].y < 1000 ? 20 : 4000000;
    for (let y = 0; y < max; y++) {
        const unique = getSensorXIntersectsAtY(sensors, y, true);
        for (let i = 1, len = unique.length; i < len; i++) {
            const prev = unique[i - 1][1];
            const curr = unique[i][0];
            if (curr - prev === 2) {
                const x = prev + 1;
                if (0 <= x && x <= max) {
                    return (x * 4000000) + y;
                }
            }
        }
    }
    return -1;
}
