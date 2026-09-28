const ANIMALS = [
    'Zorro',
    'Búho',
    'Lobo',
    'Nutria',
    'Halcón',
    'Panda',
    'Tigre',
    'Delfín',
    'Erizo',
    'Mapache',
    'Colibrí',
    'Puma',
    'Lince',
    'Castor',
    'Ardilla',
    'Tucán',
    'Jaguar',
    'Foca',
    'Koala',
    'Camaleón',
    'Búfalo',
    'Cóndor',
    'Gacela',
    'Iguana',
    'Manatí',
    'Ocelote',
    'Pangolín',
    'Suricata',
];
function pick() {
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}
export function generateAliasPair() {
    const a = pick();
    let b = pick();
    while (b === a)
        b = pick();
    return [a, b];
}
//# sourceMappingURL=alias.util.js.map