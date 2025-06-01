# 📱 Mobile Almendros

Aplicación móvil para el sistema de gestión de pedidos Almendros, desarrollada con React Native y Expo.

## 📋 Descripción del Proyecto

Esta aplicación móvil permite a los clientes:

- 🔐 **Autenticación por documento**: Iniciar sesión usando Cédula de Ciudadanía (CC) o Tarjeta de Identidad (TI)
- 📦 **Gestión de pedidos**: Ver historial completo de pedidos con detalles y seguimiento
- 👤 **Perfil de usuario**: Consultar información personal y configuraciones
- 🔄 **Sincronización en tiempo real**: Datos actualizados desde el backend

## 🛠️ Stack Tecnológico

- **React Native** 0.79.2
- **React** 19.0.0
- **Expo** 53
- **TypeScript**
- **Expo Router** (navegación file-based)
- **Axios** (cliente HTTP)
- **Expo Secure Store** (almacenamiento seguro)
- **Lucide React Native** (iconografía)

## ✅ Requisitos Previos

### Obligatorios

- **Node.js** >= 22.15.0 (versión exacta especificada en `.node-version`)
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`

### Para desarrollo móvil

- **Android Studio** (para emulador Android)
- **Xcode** (para simulador iOS - solo en macOS)
- **Expo Go app** (para testing en dispositivos físicos)

## ⚠️ DEPENDENCIA CRÍTICA: Backend

Esta aplicación **REQUIERE** que el backend esté ejecutándose. Sin el backend:

- ❌ La autenticación fallará
- ❌ No se cargarán pedidos
- ❌ La app mostrará errores de conexión

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/gabo8191/frontend-almendros.git
cd frontend-almendros
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar el entorno

#### Configuración de la URL del Backend

El proyecto incluye configuraciones para diferentes entornos en `src/config/`:

**Desarrollo** (`src/config/development.json`): (La que usaremos en este caso puntual)

```json
{
  "api": {
    "baseUrl": "http://TU_IP_LOCAL:3000",
    "timeout": 30000
  }
}
```

**Producción** (`src/config/production.json`): (De momento no habilitada)

```json
{
  "api": {
    "baseUrl": "https://api.almendros.com/",
    "timeout": 30000
  }
}
```

#### 🔧 Configurar tu IP local

**IMPORTANTE**: Debes actualizar la IP en `development.json` con la IP de tu máquina local:

1. **Obtén tu IP local**:

   ```bash
   # En Windows
   ipconfig

   # En macOS/Linux
   ifconfig
   # o
   hostname -I
   ```

2. **Actualiza** `src/config/development.json`:
   ```json
   {
     "api": {
       "baseUrl": "http://TU_IP_LOCAL:3000",
       "timeout": 30000
     }
   }
   ```

#### Variables de entorno (opcional)

Puedes crear un archivo `.env` para configuraciones adicionales:

```bash
# .env
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_DEV_FORCE_LOGIN=true
```

## 🎮 Ejecución de la Aplicación

### Comandos básicos

```bash
# Iniciar servidor de desarrollo
npm start

# Limpiar caché e iniciar
npm run start --clear

# Desarrollo con variables de entorno
npm run start:dev
```

### Plataformas específicas

#### 📱 Android

```bash
# Modo normal
npm run android

# Modo desarrollo
npm run android:dev

# Desarrollo con sesión limpia
npm run android:dev-fresh
```

#### 🍎 iOS (solo en macOS)

```bash
# Modo normal
npm run ios

# Modo desarrollo
npm run ios:dev

# Desarrollo con sesión limpia
npm run ios:dev-fresh
```

#### 🌐 Web

```bash
# Modo normal
npm run web

# Desarrollo con sesión limpia
npm run web:dev-fresh
```

### 📱 Testing en dispositivo físico

1. Instala **Expo Go** desde App Store/Google Play
2. Ejecuta `npm start`
3. Escanea el QR code con Expo Go (Android) o Cámara (iOS)

⚠️ **Importante**: Tu dispositivo y computadora deben estar en la misma red WiFi.

## 🔄 Scripts Disponibles

| Script                    | Descripción                         |
| ------------------------- | ----------------------------------- |
| `npm start`               | Inicia servidor de desarrollo       |
| `npm run start:dev`       | Desarrollo con variables de entorno |
| `npm run start:dev-fresh` | Desarrollo forzando nuevo login     |
| `npm run android`         | Ejecuta en Android                  |
| `npm run ios`             | Ejecuta en iOS                      |
| `npm run web`             | Ejecuta en navegador                |
| `npm run lint`            | Ejecuta linter ESLint               |
| `npm run cache:clear`     | Limpia caché de Expo                |
| `npm run prebuild`        | Genera código nativo                |

## 🏗️ Estructura del Proyecto

```
mobile-almendros/
├── app/                     # Rutas y pantallas (Expo Router)
│   ├── (auth)/             # Grupo de autenticación
│   │   ├── _layout.tsx     # Layout de auth
│   │   └── login.tsx       # Pantalla de login
│   ├── (tabs)/             # Grupo de tabs principales
│   │   ├── _layout.tsx     # Layout de tabs
│   │   ├── orders.tsx      # Lista de pedidos
│   │   ├── order-detail.tsx # Detalle de pedido
│   │   └── profile.tsx     # Perfil de usuario
│   ├── _layout.tsx         # Layout raíz
│   └── index.tsx           # Pantalla inicial/router
├── src/
│   ├── api/                # Configuración de API
│   │   ├── axios.ts        # Cliente HTTP configurado
│   │   ├── config.ts       # URLs y configuración
│   │   └── endpoints.ts    # Endpoints del backend
│   ├── config/             # Configuraciones de entorno
│   │   ├── development.json # Config desarrollo
│   │   ├── production.json  # Config producción
│   │   ├── index.ts        # Selector de config
│   │   └── types.ts        # Types de configuración
│   ├── constants/          # Constantes globales
│   │   ├── Colors.ts       # Paleta de colores
│   │   └── Typography.ts   # Sistema tipográfico
│   ├── features/           # Características por dominio
│   │   ├── auth/           # Autenticación
│   │   │   ├── api/        # Servicios de auth
│   │   │   ├── components/ # Componentes de auth
│   │   │   └── types/      # Types de auth
│   │   └── orders/         # Gestión de pedidos
│   │       ├── api/        # Servicios de pedidos
│   │       ├── components/ # Componentes de pedidos
│   │       ├── context/    # Context de pedidos
│   │       └── types/      # Types de pedidos
│   └── shared/             # Código compartido
│       ├── components/     # Componentes UI
│       ├── context/        # Contexts globales
│       ├── hooks/          # Custom hooks
│       └── utils/          # Utilidades
├── assets/                 # Recursos estáticos
├── .github/workflows/      # CI/CD pipelines
└── patches/                # Parches de dependencias
```

## 🔐 Autenticación

La aplicación usa autenticación basada en documentos de identidad:

### Tipos de documento soportados:

- **CC**: Cédula de Ciudadanía
- **TI**: Tarjeta de Identidad

### Flujo de autenticación:

1. Usuario ingresa tipo y número de documento
2. App envía credenciales al backend (`POST /clients/login`)
3. Backend valida y retorna usuario + token JWT
4. Token se almacena en Expo Secure Store
5. Token se incluye en todas las peticiones subsecuentes

### Almacenamiento seguro:

- **iOS/Android**: Expo Secure Store (Keychain/Keystore)
- **Web**: localStorage (fallback)

## 🌐 Configuración de Red

### Desarrollo Local

#### Emulador Android

La aplicación automáticamente convierte `localhost` a `10.0.2.2` para emuladores Android.

#### Dispositivo Físico

Usa tu IP local real (ej: `192.168.1.12`).

#### Simulador iOS

Puede usar `localhost` directamente.

### Red WiFi

Para testing en dispositivos físicos, asegúrate de que:

- ✅ Dispositivo y computadora están en la misma red
- ✅ Firewall permite conexiones en el puerto del backend (3000)
- ✅ Router no bloquea comunicación entre dispositivos

## 🐛 Solución de Problemas

### ❌ "Network Error" / No se conecta al backend

**Causas comunes:**

- Backend no está ejecutándose
- IP incorrecta en configuración
- Firewall bloqueando conexión
- Dispositivo en red diferente

**Soluciones:**

```bash
# 1. Verificar que backend esté corriendo
curl http://localhost:3000/health

# 2. Verificar IP local
ipconfig # Windows
ifconfig # macOS/Linux

# 3. Actualizar config con IP correcta
# Editar src/config/development.json

# 4. Limpiar caché
npm run cache:clear
```

### ❌ "Expo Go" problemas de conexión

```bash
# Limpiar caché y reiniciar
npm run cache:clear
npx expo start --clear

# Usar túnel si hay problemas de red
npx expo start --tunnel
```

### ❌ Errores de autenticación

**Verificar:**

- ✅ Backend tiene usuarios de prueba
- ✅ Documento existe en base de datos
- ✅ Usuario está activo (`isActive: true`)

### ❌ "Cannot resolve module" / Dependencias

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar patches
npm run postinstall
```

### ❌ Errores de construcción Android

```bash
# Limpiar y reconstruir
npm run prebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

## 🔄 CI/CD

El proyecto incluye 4 workflows de GitHub Actions:

### 1. Auto Changelog (`.github/workflows/auto-changelog-workflow.yml`)

- ✅ Se ejecuta en push a `main`
- ✅ Genera `CHANGELOG.md` automáticamente
- ✅ Crea PR con cambios

### 2. Auto Tag (`.github/workflows/auto-tag-workflow.yml`)

- ✅ Se ejecuta en push a `main`
- ✅ Crea tags basado en `package.json` version
- ✅ Solo si el tag no existe

### 3. Mobile CI (`.github/workflows/mobile-test-workflow.yml`)

- ✅ Se ejecuta en push/PR a `main`, `release`, `develop`
- ✅ Ejecuta linting
- ✅ Construye APK Android
- ✅ Sube artefactos

### 4. SonarQube (`.github/workflows/build-sonar.yml`)

- ✅ Análisis de calidad de código
- ✅ Se ejecuta en push/PR

## 🚨 Consideraciones Importantes

### ⚠️ Dependencias Críticas

- **Backend obligatorio**: La app no funciona sin backend
- **Red local**: Dispositivos deben estar en misma red para desarrollo
- **Node.js versión**: Usar exactamente 22.15.0 (especificado en `.node-version`)

### 🔒 Seguridad

- ✅ Tokens almacenados en Secure Store
- ✅ No hay credenciales hardcodeadas
- ✅ HTTPS en producción
- ⚠️ HTTP solo en desarrollo local

### 📱 Compatibilidad

- ✅ **Android**: API 21+ (Android 5.0+)
- ✅ **iOS**: iOS 11.0+
- ✅ **Web**: Navegadores modernos

### 🚀 Rendimiento

- ✅ Lazy loading de rutas
- ✅ Caché de imágenes
- ✅ Optimización de bundle
- ✅ New Architecture habilitado

## 📚 Recursos Adicionales

### Documentación

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Router](https://expo.github.io/router/)

### Testing

- **Expo Go**: Para desarrollo rápido
- **Development Build**: Para funcionalidades nativas personalizadas

### Debugging

- **Flipper**: Debugging avanzado
- **React DevTools**: Inspección de componentes
- **Network Inspector**: Análisis de peticiones HTTP

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a [Tu Organización].

## 🆘 Soporte

Si tienes problemas que no se resuelven con esta documentación:

1. 🔍 Verifica que el backend esté corriendo
2. 🌐 Confirma configuración de red
3. 📱 Prueba en diferentes dispositivos/emuladores
4. 💬 Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2025
