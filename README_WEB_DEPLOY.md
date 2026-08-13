# Deploy Web Mendoza

Este documento resume el paso a paso que hicimos para publicar la variante web de Mendoza sin romper la app/backend existente.

## Objetivo

- mantener funcionando el backend actual en `bamensa-dev.abarbieri.com.ar`
- exportar la web de Expo
- subirla al servidor
- evitar romper rutas PHP como `login.php`, `operations.php`, etc.

## 1. Confirmar variante Mendoza

En este proyecto, Mendoza usa:

```ts
export const BASE_URL = 'https://bamensa-dev.abarbieri.com.ar/';
```

Importante:

- el script `check:variant` todavía esperaba `http`, no `https`
- eso hacía fallar el chequeo aunque la intención del deploy fuera correcta

Chequeo usado:

```bash
npm run check:variant -- mendoza
```

Si da error por `http` vs `https`, no necesariamente bloquea el export. El problema era del validador viejo, no del export.

## 2. Exportar la web

Desde el proyecto:

```bash
npx expo export --platform web
```

Eso genera:

```bash
dist/
```

Archivos importantes:

- `dist/index.html`
- `dist/favicon.ico`
- `dist/metadata.json`
- `dist/_expo/`
- `dist/assets/`

## 3. Probar HTTPS del servidor

Primero se ajustó CORS en el backend para contemplar el origen correcto.

Se discutió esta lógica:

```php
private function sendCorsHeaders() {
    $allowedOrigins = [
        'http://localhost:8082',
        'https://bamensa-dev.abarbieri.com.ar',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Session');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
```

Después se verificó que el dominio HTTPS existiera, pero inicialmente devolvía `403 Forbidden`.

Eso no era CORS: faltaba publicar la web.

## 4. Detectar qué servía Apache

En el servidor:

```bash
sudo apache2ctl -S
```

Eso mostró que el vhost SSL de:

```bash
bamensa-dev.abarbieri.com.ar
```

apuntaba a:

```bash
/var/www/bamensa-dev
```

Esa carpeta era el backend PHP, no la web exportada.

## 5. Crear carpeta separada para la web

Para no mezclar backend y frontend:

```bash
sudo mkdir -p /var/www/bamensa-dev-web
sudo chown ubuntu:ubuntu /var/www/bamensa-dev-web
```

La idea fue:

- backend PHP: `/var/www/bamensa-dev`
- frontend exportado: `/var/www/bamensa-dev-web`

## 6. Subir el export al servidor

En la Mac primero había que estar parado en la carpeta del proyecto:

```bash
cd /Users/leiladelcampo/projects/react-native/bamensa-app
```

Si `dist/` no existía todavía, primero había que regenerarlo:

```bash
npx expo export --platform web
```

Y recién después comprimir el build:

```bash
tar -czf dist-web.tar.gz dist
```

Después se encontró la key correcta:

```bash
/Users/leiladelcampo/Documents/AwsKeys/ServerLeilaApps.pem
```

Y se subió así:

```bash
scp -i "/Users/leiladelcampo/Documents/AwsKeys/ServerLeilaApps.pem" \
  dist-web.tar.gz \
  ubuntu@3.23.86.252:/var/www/bamensa-dev-web/
```

## 7. Descomprimir en el servidor

En Ubuntu:

```bash
cd /var/www/bamensa-dev-web
rm -rf _expo assets index.html favicon.ico metadata.json
tar -xzf dist-web.tar.gz
mv dist/* .
rm -rf dist
rm dist-web.tar.gz
```

Los warnings `LIBARCHIVE.xattr.com.apple.provenance` eran de macOS y se podían ignorar.

Esto era importante porque, si `_expo/` y `assets/` ya existían, `mv dist/* .` fallaba con `Directory not empty`.

También hubo archivos basura tipo `._dist`, que se borraron.

Verificación final:

```bash
ls -la /var/www/bamensa-dev-web
```

Debía mostrar:

- `_expo/`
- `assets/`
- `index.html`
- `favicon.ico`
- `metadata.json`

## 8. Primer intento: poner la web en la raíz

Se probó cambiar el vhost SSL para que la raíz del dominio sirviera la web:

```apache
DocumentRoot /var/www/bamensa-dev-web
```

Y se comprobó que internamente Apache devolvía `200`:

```bash
curl -I -k https://localhost/
curl -I -k -H "Host: bamensa-dev.abarbieri.com.ar" https://127.0.0.1/
```

Ambos respondían `200 OK`.

## 9. Problema encontrado al poner la web en la raíz

Cuando la web quedó en `/`, el login del frontend falló con:

```text
/login.php?... 404 Not Found
```

Motivo:

- antes el dominio raíz servía el backend PHP
- al poner la web estática en la raíz, `login.php` dejó de existir ahí

Eso rompía la API existente.

## 10. Decisión segura

Para no romper la app que ya funciona, se volvió a dejar el backend en la raíz:

```apache
DocumentRoot /var/www/bamensa-dev
```

Y se confirmó que `login.php` volvía a responder.

Ejemplo de respuesta válida:

```json
{"result":"success","data":[...]}
```

## 11. Opción elegida para la web: subruta `/web/`

Como crear un subdominio nuevo implicaba tocar DNS, se eligió una alternativa más simple:

- backend/API en:
  `https://bamensa-dev.abarbieri.com.ar/`
- frontend web en:
  `https://bamensa-dev.abarbieri.com.ar/web/`

Esto evita romper:

- `login.php`
- `operations.php`
- demás rutas PHP existentes

## 12. Configuración Apache para `/web/`

Archivo editado:

```bash
sudo nano /etc/apache2/sites-enabled/bamensa-dev-le-ssl.conf
```

Bloque recomendado:

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName bamensa-dev.abarbieri.com.ar
    DocumentRoot /var/www/bamensa-dev

    Alias /web /var/www/bamensa-dev-web
    Alias /_expo /var/www/bamensa-dev-web/_expo
    Alias /assets /var/www/bamensa-dev-web/assets
    Alias /favicon.ico /var/www/bamensa-dev-web/favicon.ico

    <Directory /var/www/bamensa-dev>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <Directory /var/www/bamensa-dev-web>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
        DirectoryIndex index.html
    </Directory>

    SSLCertificateFile /etc/letsencrypt/live/bamensa-dev.abarbieri.com.ar/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/bamensa-dev.abarbieri.com.ar/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

Después:

```bash
sudo systemctl reload apache2
```

## 13. `.htaccess` para la SPA en `/web/`

Archivo:

```bash
sudo nano /var/www/bamensa-dev-web/.htaccess
```

Contenido:

```apache
RewriteEngine On
RewriteBase /web/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /web/index.html [L]
```

Esto ayuda a que rutas internas del frontend no den `404`.

## 14. Qué quedó claro

- publicar la web en la raíz del mismo dominio rompe la API vieja
- si el frontend web convive con el backend en el mismo host, conviene:
  - usar una subruta como `/web/`
  - o un subdominio aparte
- la opción más segura sin tocar DNS es `/web/`

## 15. URLs finales esperadas

Backend/API:

```text
https://bamensa-dev.abarbieri.com.ar/login.php
https://bamensa-dev.abarbieri.com.ar/operations.php
```

Frontend web:

```text
https://bamensa-dev.abarbieri.com.ar/web/
```

## 16. Próximos pasos recomendados

1. Probar `https://bamensa-dev.abarbieri.com.ar/web/`
2. Verificar que carguen:
   - `/_expo/...`
   - `/assets/...`
   - `/favicon.ico`
3. Si el frontend web necesita pegarle a la API, confirmar que `BASE_URL` siga apuntando al backend correcto
4. Si aparece un problema de rutas absolutas, evaluar un export específico preparado para `/web/`

## 17. Comandos útiles usados

Chequeo de vhosts:

```bash
sudo apache2ctl -S
```

Verificación local del vhost:

```bash
curl -I -k https://localhost/
curl -I -k -H "Host: bamensa-dev.abarbieri.com.ar" https://127.0.0.1/
```

Verificación desde la Mac:

```bash
curl -I https://bamensa-dev.abarbieri.com.ar/
```

Recargar Apache:

```bash
sudo systemctl reload apache2
```
