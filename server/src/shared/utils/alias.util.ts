/**
 * Alias del sistema para participantes anónimos: nombres de animales, sin
 * relación con el usuario real.
 */
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

function pick(): string {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

/** Genera dos alias distintos (uno por participante de la conversación). */
export function generateAliasPair(): [string, string] {
  const a = pick();
  let b = pick();
  while (b === a) b = pick();
  return [a, b];
}
