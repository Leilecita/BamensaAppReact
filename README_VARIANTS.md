# Cambio Manual Entre Bamensa, Fisherton y Mendoza

## Primer paso antes de exportar

Correr siempre primero:

```bash
npm run check:variant -- bamensa
```

o según la app que vayas a exportar:

```bash
npm run check:variant -- fisherton
npm run check:variant -- mendoza
```

Si todo está bien, la consola devuelve:

```bash
Resultado: OK, variante alineada para exportar.
```

Para cambiar de una app a la otra en este proyecto, hay que revisar y alinear 5 cosas:

1. `app.config.ts`
2. `axiosClient.ts`
3. `appVariant.ts`
4. perfil de `eas build`
5. archivo `.mobileprovision`

## Registrar iPhones / obtener UDID

Si necesitás registrar un iPhone para instalar una build interna, se puede usar:

```bash
eas device:create
```

Eso se corre desde la terminal, parado dentro del proyecto.

La opción recomendada es `Website`, porque:

- genera un link o QR para abrir desde el iPhone
- instala un perfil temporal de registro
- captura el UDID del dispositivo
- y normalmente lo registra directamente en el flujo de Expo/EAS sin tener que copiarlo a mano

Sirve también para varios iPhones: cada uno abre el link y hace su propio registro.

## Importante

No mezclar nunca configuraciones cruzadas.

Ejemplos de mezcla incorrecta:

- nombre Fisherton + bundle id Bamensa
- `BASE_URL` Fisherton + variant Bamensa
- profile Fisherton + provisioning Bamensa

## Fisherton

### 1. `app.config.ts`

Dejar la configuración Fisherton así:

```ts
fisherton: {
  name: 'Fisherton app',
  slug: 'bamensa-app',
  icon: './assets/app-icons/logo_ic_fisherton5.png',
  androidPackage: 'com.example.fisherton',
  iosBundleIdentifier: 'com.example.fisherton',
  baseUrl: 'http://frutos-dev.abarbieri.com.ar/',
},
```

### 2. `axiosClient.ts`

Cambiar la URL principal a Fisherton:

```ts
export const BASE_URL = 'http://frutos-dev.abarbieri.com.ar/';
```

`BASE_URL2` y `BASE_URL3` quedan como están si no se quieren tocar.

### 3. `appVariant.ts`

Si se va a manejar manualmente el look/estilo, forzar Fisherton:

```ts
export const getAppVariant = (): AppVariant => {
  return 'fisherton';
};
```

### 4. Build EAS

Correr:

```bash
eas build --platform ios --profile fisherton
```

### 5. Provisioning profile

En el flujo más reciente, EAS pudo generar automáticamente un provisioning profile nuevo para `com.example.fisherton`.

Eso significa que:

- no siempre hace falta seleccionar manualmente `bamensa_fisherton.mobileprovision`
- el archivo local queda como backup por si EAS lo vuelve a pedir o por si se quiere usar un flujo manual

Archivo backup actual:

`/Users/leiladelcampo/projects/react-native/bamensa-app/.ios-signing/bamensa_fisherton.mobileprovision`

## Bamensa

### 1. `app.config.ts`

Dejar la configuración Bamensa así:

```ts
bamensa: {
  name: 'Change app',
  slug: 'bamensa-app',
  icon: './assets/app-icons/logo.png',
  androidPackage: 'com.example.bamensa',
  iosBundleIdentifier: 'com.example.bamensa',
  baseUrl: 'http://loteriasole.abarbieri.com.ar/',
},
```

### 2. `axiosClient.ts`

Cambiar la URL principal a Bamensa:

```ts
export const BASE_URL = 'http://loteriasole.abarbieri.com.ar/';
```

### 3. `appVariant.ts`

Si se va a manejar manualmente el look/estilo, forzar Bamensa:

```ts
export const getAppVariant = (): AppVariant => {
  return 'bamensa';
};
```

### 4. Build EAS

Correr uno de estos:

```bash
eas build --platform ios --profile bamensa
```

o

```bash
eas build --platform ios --profile preview
```

### 5. Provisioning profile

Se puede usar `bamensa.mobileprovision` si EAS lo pide en un flujo manual.

Si EAS logra generar/recuperar las credenciales automáticamente, no hace falta seleccionarlo a mano.

Ubicación actual:

`/Users/leiladelcampo/projects/react-native/bamensa-app/.ios-signing/bamensa.mobileprovision`

## Mendoza

### 1. `app.config.ts`

Dejar la configuración Mendoza así:

```ts
mendoza: {
  name: 'Mendoza app',
  slug: 'bamensa-mendoza-app',
  icon: './assets/app-icons/logo.png',
  androidPackage: 'com.example.bamensa_dev',
  iosBundleIdentifier: 'com.example.bamensa_dev',
  baseUrl: 'http://bamensa-dev.abarbieri.com.ar/',
},
```

### 2. `axiosClient.ts`

Cambiar la URL principal a Mendoza:

```ts
export const BASE_URL = 'http://bamensa-dev.abarbieri.com.ar/';
```

### 3. `appVariant.ts`

Si se va a manejar manualmente el look/estilo, forzar Mendoza:

```ts
export const getAppVariant = (): AppVariant => {
  return 'mendoza';
};
```

### 4. Build EAS

Correr:

```bash
eas build --platform ios --profile mendoza
```

### 5. Provisioning profile

Todavía no quedó documentado un `.mobileprovision` manual específico para Mendoza.

Si EAS logra generar/recuperar las credenciales automáticamente, seguir con eso.
Si más adelante querés manejarlo manualmente, conviene guardar el archivo correspondiente en `.ios-signing/`.

## Checklist Antes De Buildear

### Para Fisherton

- `app.config.ts` en Fisherton
- `BASE_URL` en Fisherton
- `getAppVariant()` en Fisherton
- `eas build --profile fisherton`
- provisioning de Fisherton correcto
- si EAS lo genera solo, seguir con eso
- si EAS lo pide manual, usar `bamensa_fisherton.mobileprovision`

### Para Bamensa

- `app.config.ts` en Bamensa
- `BASE_URL` en Bamensa
- `getAppVariant()` en Bamensa
- `eas build --profile bamensa` o `preview`
- provisioning de Bamensa correcto
- si EAS lo pide manual, usar `bamensa.mobileprovision`

### Para Mendoza

- `app.config.ts` en Mendoza
- `BASE_URL` en Mendoza
- `getAppVariant()` en Mendoza
- `eas build --profile mendoza`
- provisioning de Mendoza correcto
- si EAS lo genera solo, seguir con eso

## Aclaración

Hoy el proyecto está manejado de forma manual.
Eso significa que para cambiar de app no alcanza con cambiar una sola cosa.
Hay que revisar que todas las piezas queden alineadas antes de exportar.

### Nota sobre el slug

Hoy Bamensa y Fisherton están usando el mismo proyecto EAS (`projectId` de Bamensa).

Por eso, en este esquema manual actual:

- Fisherton debe dejar `slug: 'bamensa-app'`
- si se vuelve a poner `slug: 'fisherton-app'`, EAS puede fallar por conflicto entre `slug` y `extra.eas.projectId`

Si alguna queda mezclada, la app puede:

- mostrar nombre de una app
- tener bundle id de otra
- pegarle al servidor equivocado
- o usar el provisioning profile incorrecto
