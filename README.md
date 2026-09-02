# Somos Danza

App para cargar y consultar puntajes de jurados sobre puestas en escena de un evento de danza.

- **Pantalla del jurado** (`/`): filtra puestas por escuela / categoria / disciplina y carga un puntaje (Jurado 1 o Jurado 2).
- **Pantalla admin - Datos** (`/admin/datos`): alta/edicion/baja de escuelas y de sus puestas (categoria, disciplina, cantidad de alumnos, docentes).
- **Pantalla admin - Puntajes** (`/admin/puntajes`): consulta en tiempo real de los puntajes cargados por los jurados, con promedio.

Stack: **React + Vite**, **Firebase Firestore** (base de datos remota gratuita), **EmailJS** (aviso por email al admin), pensado para publicarse gratis en **Vercel**.

---

## 1. Instalacion local

```bash
npm install
cp .env.example .env   # despues completar con tus datos (paso 2 y 3)
npm run dev
```

Abre `http://localhost:5173`.

## 2. Base de datos remota: Firebase Firestore (gratis)

1. Anda a https://console.firebase.google.com y crea un proyecto nuevo (nombre sugerido: `somos-danza`).
2. En el menu lateral entra a **Firestore Database** > **Crear base de datos** > modo **produccion** (las reglas se ajustan en el paso 4) > elegi una region cercana (ej. `southamerica-east1`).
3. En **Configuracion del proyecto** (icono de engranaje) > pestaña **General** > seccion "Tus apps" > click en el icono `</>` (Web) para registrar una app web. No hace falta Firebase Hosting.
4. Copia los valores que te da (`apiKey`, `authDomain`, `projectId`, etc.) al archivo `.env`, en las variables `VITE_FIREBASE_*`.

### Colecciones que usa la app (se crean solas al cargar el primer dato)

| Coleccion  | Campos |
|---|---|
| `escuelas` | `nombre` |
| `puestas`  | `escuelaId`, `nombre`, `categoria`, `disciplina`, `cantidadAlumnos`, `docentes` |
| `puntajes` | `puestaId`, `jurado` (1 o 2), `valor`, `comentario`, `createdAt` |

### Reglas de seguridad de Firestore

Como el acceso de administrador se controla con un PIN simple del lado del navegador (no hay usuarios/login real de Firebase), las reglas quedan abiertas para lectura/escritura. Es la opcion mas simple para un evento chico, pero cualquiera que sepa la URL de la API podria escribir directo. Reglas sugeridas (pegalas en Firestore > Reglas):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /escuelas/{id} { allow read, write: if true; }
    match /puestas/{id}  { allow read, write: if true; }
    match /puntajes/{id} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false; // los puntajes ya cargados no se pueden alterar
    }
  }
}
```

> Si mas adelante queres seguridad real, el siguiente paso es migrar el PIN a **Firebase Authentication** y condicionar `escuelas`/`puestas` a `request.auth != null`.

## 3. Aviso por email: EmailJS (gratis, sin backend)

1. Crea una cuenta en https://www.emailjs.com (plan free: 200 emails/mes).
2. **Email Services** > agrega tu Gmail (u otro proveedor) > copia el **Service ID**.
3. **Email Templates** > crea una plantilla nueva con estas variables (usalas en el asunto/cuerpo):
   `{{escuela}}`, `{{puesta}}`, `{{jurado}}`, `{{valor}}`, `{{fecha}}`.
   Ejemplo de cuerpo:
   ```
   Se cargo un nuevo puntaje.

   Escuela: {{escuela}}
   Puesta: {{puesta}}
   Jurado: {{jurado}}
   Puntaje: {{valor}}
   Fecha: {{fecha}}
   ```
   Configura el email de destino (el del administrador) en el campo "To email" de la plantilla. Copia el **Template ID**.
4. **Account** > **General** > copia tu **Public Key**.
5. Completa en `.env`: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

Si estas variables quedan vacias, la app funciona igual (el puntaje se guarda en Firestore); solo no se envia el email, y se avisa por consola.

## 4. PIN de administrador

Definilo en `.env`: `VITE_ADMIN_PIN=tu-pin`. Se pide una vez por sesion de navegador para entrar a las 2 pantallas de admin.

## 5. Logo

Colocá el archivo del logo como `public/logo.png` (o reemplazalo, ya hay una referencia a esa ruta en toda la app: header y favicon). Si el archivo no existe, la app muestra automaticamente un logo de reemplazo dibujado en SVG para no romper el diseño.

## 6. Deploy gratis en Vercel

1. Subi este proyecto a un repositorio de GitHub.
2. Anda a https://vercel.com, "Add New Project" > importa el repo (detecta Vite/React solo).
3. En **Environment Variables** cargá las mismas variables del `.env` (`VITE_FIREBASE_*`, `VITE_ADMIN_PIN`, `VITE_EMAILJS_*`).
4. Deploy. Vercel te da una URL tipo `somos-danza.vercel.app`, accesible tanto para jurados como para el administrador.

## Scripts

```bash
npm run dev       # desarrollo local
npm run build     # build de produccion (carpeta dist/)
npm run preview   # sirve el build localmente para probarlo
```
