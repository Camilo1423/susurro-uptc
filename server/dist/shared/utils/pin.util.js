import { randomBytes } from 'node:crypto';
export function generatePin() {
    return randomBytes(4).toString('hex').toUpperCase();
}
//# sourceMappingURL=pin.util.js.map