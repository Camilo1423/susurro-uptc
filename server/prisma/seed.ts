import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { generatePin } from '../src/shared/utils/pin.util.js';

// Prisma 7 requiere un driver adapter para conectarse (igual que PrismaService).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

/** Tipos de documento base (Colombia). */
const DOCUMENT_TYPES = [
  { code: 'CC', name: 'Cédula de ciudadanía' },
  { code: 'TI', name: 'Tarjeta de identidad' },
  { code: 'CE', name: 'Cédula de extranjería' },
  { code: 'PA', name: 'Pasaporte' },
  { code: 'RC', name: 'Registro civil' },
  { code: 'NIT', name: 'NIT' },
];

async function main() {
  // Tipos de documento (idempotente).
  for (const dt of DOCUMENT_TYPES) {
    await prisma.documentType.upsert({
      where: { code: dt.code },
      update: { name: dt.name },
      create: dt,
    });
  }

  const cc = await prisma.documentType.findUniqueOrThrow({
    where: { code: 'CC' },
  });

  // Usuario inicial (activo) para poder iniciar sesión. Idempotente: si ya
  // existe no se toca; su PIN se genera solo la primera vez.
  const email = 'admin@uptc.edu.co';
  const password = await bcrypt.hash('Admin123*', 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username: 'admin',
      password,
      firstName: 'Admin',
      firstLastName: 'anomChat',
      documentTypeId: cc.id,
      documentNumber: '1000000000',
      pin: generatePin(),
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  console.log('✅ Seed completado: tipos de documento + usuario admin');
  console.log('   Login: admin@uptc.edu.co / Admin123*');
  console.log(`   PIN del admin: ${admin.pin}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
