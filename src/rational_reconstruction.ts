/**
 * Rational reconstruction (mathematics) - Wikipedia
 * https://en.wikipedia.org/wiki/Rational_reconstruction_(mathematics)
 **/
export const reconstruct = (n: number, mod: number): [number, number] => {
    let v: [number, number] = [mod, 0];
    let w: [number, number] = [n, 1];
    while (w[0] * w[0] * 2 > mod) {
        const q = Math.floor(v[0] / w[0]);
        const z: [number, number] = [v[0] - q * w[0], v[1] - q * w[1]];
        v = w;
        w = z;
    }
    if (w[1] < 0) {
        w[0] *= -1;
        w[1] *= -1;
    }
    return w;
};
