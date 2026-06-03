# Proyecto de Donación

Este es un proyecto de [Next.js](https://nextjs.org) (`donacion`) configurado con tecnologías modernas para la gestión y procesamiento de donaciones de manera eficiente, segura y descentralizada.

## 🚀 Tecnologías Principales

El proyecto utiliza las siguientes tecnologías de última generación:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org) con **React 19**
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com) para una interfaz de usuario responsiva, moderna y rápida.
- **Base de Datos y Autenticación:** [Supabase](https://supabase.com) (a través de `@supabase/supabase-js`)
- **Procesamiento de Pagos:** [Stripe](https://stripe.com) para transacciones seguras.
- **Almacenamiento de Archivos:** [Pinata SDK](https://www.pinata.cloud) (IPFS) para almacenamiento y anclaje (pinning) de archivos de forma descentralizada.
- **Notificaciones del Sistema:** [React Hot Toast](https://react-hot-toast.com) para notificaciones y alertas en tiempo real en la interfaz.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu entorno de desarrollo:
- **Node.js** (versión 18.0 o superior recomendada)
- Un gestor de paquetes de tu preferencia (**npm**, **yarn**, **pnpm** o **bun**)

---

## ⚙️ Configuración del Entorno

1. Crea un archivo de entorno `.env.local` en la raíz del proyecto para configurar las credenciales necesarias:

   ```bash
   touch .env.local
   ```

2. Añade las siguientes variables de entorno según los servicios que estés integrando:

   ```env
   # Configuración de Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

   # Configuración de Stripe
   STRIPE_SECRET_KEY=tu_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key

   # Configuración de Pinata (IPFS)
   PINATA_JWT=tu_pinata_jwt
   NEXT_PUBLIC_PINATA_GATEWAY=tu_pinata_gateway
   ```

---

## 💻 Desarrollo

Para iniciar el servidor de desarrollo localmente:

1. Instala las dependencias si aún no lo has hecho:
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```

2. Corre el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación ejecutándose.

Puedes empezar a editar la aplicación modificando el archivo `app/page.tsx`. La página se recargará automáticamente a medida que guardes los cambios.

---

## 📦 Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes comandos útiles:

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Compila la aplicación optimizándola para producción.
- `npm run start`: Inicia la aplicación compilada en modo de producción.
- `npm run lint`: Ejecuta ESLint para analizar y corregir la calidad del código.

---

## 📁 Estructura del Proyecto

- `app/`: Contiene el enrutamiento y las vistas utilizando el App Router de Next.js.
  - `layout.tsx`: Define el diseño base de la aplicación.
  - `page.tsx`: La página principal/página de inicio.
  - `globals.css`: Estilos globales de Tailwind CSS.
- `public/`: Contiene recursos estáticos como imágenes y fuentes.

---

## 🌐 Despliegue en Vercel

La forma más rápida y recomendada de desplegar tu aplicación Next.js es a través de la plataforma [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Para obtener más información sobre el despliegue, consulta la [documentación oficial de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
