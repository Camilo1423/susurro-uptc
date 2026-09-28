#!/bin/sh
set -e

echo "▶ Aplicando migraciones (prisma migrate deploy)..."
npx prisma migrate deploy

echo "▶ Iniciando la API..."
exec node dist/main.js
