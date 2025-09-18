# Configuración de Variables de Entorno

## 🔧 Configuración Inicial

### 1. Copia el archivo de ejemplo
```bash
cp .env.example .env
```

### 2. Obtén las credenciales de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `turnogo-39ca0`
3. Ve a Configuración del proyecto (⚙️) → General
4. En "Tus apps" busca la configuración web
5. Copia los valores a tu archivo `.env`

### 3. Completa tu archivo `.env`
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=turnogo-39ca0.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=turnogo-39ca0
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=turnogo-39ca0.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# App Configuration
EXPO_PUBLIC_APP_NAME=TurnoGo
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=development
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE
- **NUNCA** commites el archivo `.env` al repositorio
- El archivo `.env` está en `.gitignore` para protegerlo
- Usa `.env.example` como referencia para otros desarrolladores

### Variables de entorno por ambiente

#### Desarrollo
```env
EXPO_PUBLIC_ENVIRONMENT=development
```

#### Producción
```env
EXPO_PUBLIC_ENVIRONMENT=production
```

## 🚨 Troubleshooting

### Error: "Missing required environment variables"
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Asegúrate que todas las variables requeridas están configuradas
3. Reinicia el servidor de Expo: `npm start`

### Variables no se cargan
1. Las variables deben empezar con `EXPO_PUBLIC_`
2. Reinicia completamente Expo después de cambios en `.env`
3. Limpia la caché: `expo start --clear`

## 📚 Más información
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Project Settings](https://firebase.google.com/docs/web/setup)
