Instalación rápida de React Native Calendar Kit (guía para este repo)

Resumen
- Esta guía te ayuda a probar `react-native-calendar-kit` en un proyecto Expo Managed (SDK >= 49 / 54 recomendado).
- No requiere EAS ni eject si usas la versión de Reanimated incluida en la SDK de Expo (>=49).

Pasos rápidos (PowerShell)

1) Instalar la librería y dependencias peer:

npm install @howljs/calendar-kit
npx expo install react-native-gesture-handler react-native-reanimated

2) Verificar `babel.config.js` contiene el plugin de Reanimated:

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin'
    ],
  };
};

3) Importar y usar en una pantalla de prueba (ejemplo mínimo):

import React from 'react';
import { Calendar } from '@howljs/calendar-kit';

export default function CalendarProto() {
  return (
    <Calendar
      events={[{ id: '1', title: 'Prueba', start: new Date(), end: new Date(new Date().getTime() + 3600000) }]}
      enablePinchZoom={true}
    />
  );
}

Notas
- Si tu SDK < 49 considera actualizar Expo; de lo contrario podrías necesitar EAS.
- No olvides reiniciar Metro después de instalar Reanimated y reconstruir cache:

expo start -c

Si quieres, preparo una rama `feature/calendar-kit-proto` que añada una pantalla de ejemplo y los cambios mínimos (package.json deps y ejemplo).