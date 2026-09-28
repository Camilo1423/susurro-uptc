import { Transform } from 'class-transformer';
export const Trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
export const TrimLowercase = () => Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value);
export const CapitalizeWords = () => Transform(({ value }) => {
    if (typeof value !== 'string')
        return value;
    return value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
});
export const CapitalizeWordsNullable = () => Transform(({ value }) => {
    if (typeof value !== 'string')
        return value;
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    return trimmed
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
});
export const TrimNullable = () => Transform(({ value }) => {
    if (typeof value !== 'string')
        return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
});
//# sourceMappingURL=transform.decorator.js.map