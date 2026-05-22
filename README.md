# PlacetaGrau

Aplicacion Next.js para la gestion educativa del Departamento de Educacion del Grupo de La Placeta.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- jsPDF para boletines y certificados

## Comandos

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

La interfaz principal esta en `http://localhost:3000`.

## Deploy en Vercel

1. Crea una base PostgreSQL en Vercel Storage, Neon, Supabase o similar.
2. En Vercel, configura la variable de entorno `DATABASE_URL` con una URL PostgreSQL con SSL.
3. Despliega el proyecto. El build ejecuta `prisma generate && next build`.
4. Aplica migraciones contra produccion desde tu maquina o CI:

```bash
npm run prisma:deploy
```

5. Carga el primer curso oficial:

```bash
npm run prisma:seed
```

## Nota Prisma

El esquema usa `String` para campos de catalogo para mantener compatibilidad entre proveedores. Los valores estan controlados desde la aplicacion y los endpoints API.
