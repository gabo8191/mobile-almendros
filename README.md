# 📱 Mobile Almendros

Aplicación móvil para el proyecto **Almendros**, desarrollada con **React Native** y **Expo**.

## 📋 Descripción del Proyecto

Esta aplicación móvil permite a los clientes:

- Registrarse e iniciar sesión en sus cuentas
- Ver sus pedidos y detalles de pedidos
- Consultar su información de perfil

## 🛠️ Tecnologías Utilizadas

- React Native `0.79.2`
- React `19.0.0`
- Expo `53`
- TypeScript
- Expo Router (navegación)
- Axios (peticiones API)
- Lucide React Native (iconos)
- Expo Secure Store (almacenamiento seguro)

## ✅ Requisitos Previos

- Node.js `>= 22.15.0`
- npm o yarn
- Expo CLI
- Android Studio o Xcode para emuladores

## 🚀 Configuración e Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/gabo8191/frontend-almendros.git
   cd frontend-almendros
2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
3. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   # o
   yarn start
4. Ejecutar en un dispositivo o emulador:
   Para IOS:
   ```bash
   npm run ios
   # o
   yarn ios
   ```
   Para Android:
   
   ```bash
   npm run android
   # o
   yarn android
   ```
## 🧾 Estructura del Proyecto
mobile-almendros/
├── api/             # Configuración y setup de API
├── app/             # Pantallas y navegación (Expo Router)
│   ├── (auth)/      # Pantallas de autenticación
│   ├── (tabs)/      # Pestañas y pantallas principales
├── assets/          # Imágenes, fuentes, etc.
├── components/      # Componentes UI reutilizables
├── constants/       # Constantes de la app, colores, etc.
├── features/        # Código específico por características
│   ├── auth/        # Característica de autenticación
│   ├── orders/      # Característica de pedidos
├── hooks/           # Custom React hooks
├── utils/           # Funciones de utilidad

## ⚙️ Configuración del Entorno

La URL base de la API se configura en `api/config.ts`. Asegúrate de ajustarla según el entorno:
  ```ts
  // api/config.ts
  export const API_BASE_URL = 'http://localhost:3000/';
  
  if (Platform.OS === 'android') {
    baseUrl = 'http://10.0.2.2:3000/';
  }
  ```
## ✨ Características

### 🔐 Autenticación
- Inicio de sesión con email y contraseña
- Registro de usuario
- Almacenamiento seguro de tokens
- Redirección automática según estado de autenticación
📦 Gestión de Pedidos
Soon...
👤 Gestión de Perfil
Soon...
- Cierre de sesión

##🔌 Integración con API
Todas las peticiones API se manejan con Axios:
- features/auth/api/authService.ts
- features/orders/api/ordersService.ts

## 🔄 Flujos de Trabajo CI/CD
Este repositorio incluye flujos de trabajo de GitHub Actions:
- Auto Changelog: Genera automáticamente un registro de cambios basado en los commits (main)
- Auto Tag: Añade etiquetas según la versión del package.json (main)
- Mobile CI:
  - Construye la app para Android
  - Ejecuta lint
  - Activo en ramas main, release y develop

## 🧪 Pruebas

Para ejecutar la app en modo desarrollo:
  ```bash
  npm start
  ```
Esto abrirá Expo DevTools y podrás:
- Ejecutar en simulador iOS (requiere macOS)
- Ejecutar en emulador Android
- Usar la app Expo Go en dispositivo físico (Estar en la misma red y poner la IP del Host en config.ts)

## 📦 Compilación para Producción

### Android:
  ```bash
  npx expo prebuild --clean --platform android
  cd android
  ./gradlew assembleDebug
  ```
### iOS:
  ```bash
  npx expo prebuild --clean --platform ios
  cd ios
  pod install
  xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
  ```
