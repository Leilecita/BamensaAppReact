const fs = require('fs');
const path = require('path');

const root = process.cwd();

const VARIANTS = {
  bamensa: {
    appName: 'Change app',
    slug: 'bamensa-app',
    icon: './assets/app-icons/logo.png',
    androidPackage: 'com.example.bamensa',
    iosBundleIdentifier: 'com.example.bamensa',
    baseUrl: 'http://loteriasole.abarbieri.com.ar/',
    profile: 'bamensa',
  },
  fisherton: {
    appName: 'Fisherton app',
    slug: 'bamensa-app',
    icon: './assets/app-icons/logo_ic_fisherton5.png',
    androidPackage: 'com.example.fisherton',
    iosBundleIdentifier: 'com.example.fisherton',
    baseUrl: 'http://frutos-dev.abarbieri.com.ar/',
    profile: 'fisherton',
  },
  mendoza: {
    appName: 'Mendoza app',
    slug: 'bamensa-mendoza-app',
    icon: './assets/app-icons/logo.png',
    androidPackage: 'com.example.bamensa_dev',
    iosBundleIdentifier: 'com.example.bamensa_dev',
    baseUrl: 'http://bamensa-dev.abarbieri.com.ar/',
    profile: 'mendoza',
  },
};

const variant = String(process.argv[2] || '').trim().toLowerCase();

if (!VARIANTS[variant]) {
  console.error('Uso: node scripts/check-variant.js <bamensa|fisherton|mendoza>');
  process.exit(1);
}

const expected = VARIANTS[variant];

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const appConfig = read('app.config.ts');
const appVariant = read('src/core/theme/appVariant.ts');
const axiosClient = read('src/core/services/axiosClient.ts');
const easJson = JSON.parse(read('eas.json'));

const errors = [];
const warnings = [];

const expectIncludes = (source, snippet, label) => {
  if (!source.includes(snippet)) {
    errors.push(`${label}: falta ${snippet}`);
  }
};

const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => {
      const commentIndex = line.indexOf('//');
      return commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    })
    .join('\n');

const variantBlockMatch = appConfig.match(
  new RegExp(`${variant}:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm')
);

if (!variantBlockMatch) {
  errors.push(`app.config.ts: no encontré el bloque de variante "${variant}"`);
} else {
  const block = variantBlockMatch[1];
  expectIncludes(block, `name: '${expected.appName}'`, `app.config.ts ${variant}`);
  expectIncludes(block, `slug: '${expected.slug}'`, `app.config.ts ${variant}`);
  expectIncludes(block, `icon: '${expected.icon}'`, `app.config.ts ${variant}`);
  expectIncludes(block, `androidPackage: '${expected.androidPackage}'`, `app.config.ts ${variant}`);
  expectIncludes(block, `iosBundleIdentifier: '${expected.iosBundleIdentifier}'`, `app.config.ts ${variant}`);
  expectIncludes(block, `baseUrl: '${expected.baseUrl}'`, `app.config.ts ${variant}`);
}

const baseUrlMatch = axiosClient.match(/export const BASE_URL = '([^']+)'/);
if (!baseUrlMatch) {
  errors.push('axiosClient.ts: no pude leer BASE_URL');
} else if (baseUrlMatch[1] !== expected.baseUrl) {
  errors.push(`axiosClient.ts: BASE_URL actual ${baseUrlMatch[1]} pero esperaba ${expected.baseUrl}`);
}

const appVariantCode = stripComments(appVariant);
const hardcodedVariantMatch = appVariantCode.match(
  /export const getAppVariant = \(\): AppVariant => \{[\s\S]*?return '([^']+)';[\s\S]*?\}/
);
if (!hardcodedVariantMatch) {
  warnings.push('appVariant.ts: no pude detectar un return hardcodeado');
} else if (hardcodedVariantMatch[1] !== variant) {
  errors.push(`appVariant.ts: devuelve ${hardcodedVariantMatch[1]} pero esperabas ${variant}`);
}

const profile = easJson.build?.[expected.profile];
if (!profile) {
  errors.push(`eas.json: no existe el profile ${expected.profile}`);
} else {
  const env = profile.env || {};
  if (env.APP_VARIANT !== variant) {
    errors.push(`eas.json ${expected.profile}: APP_VARIANT=${env.APP_VARIANT} pero esperaba ${variant}`);
  }
  if (env.EXPO_PUBLIC_APP_VARIANT !== variant) {
    errors.push(`eas.json ${expected.profile}: EXPO_PUBLIC_APP_VARIANT=${env.EXPO_PUBLIC_APP_VARIANT} pero esperaba ${variant}`);
  }
  if (env.EXPO_PUBLIC_BASE_URL !== expected.baseUrl) {
    errors.push(
      `eas.json ${expected.profile}: EXPO_PUBLIC_BASE_URL=${env.EXPO_PUBLIC_BASE_URL} pero esperaba ${expected.baseUrl}`
    );
  }
}

console.log(`\nChequeo de variante: ${variant}\n`);
console.log(`Esperado:
- app.config name: ${expected.appName}
- slug: ${expected.slug}
- androidPackage: ${expected.androidPackage}
- iosBundleIdentifier: ${expected.iosBundleIdentifier}
- BASE_URL: ${expected.baseUrl}
- profile EAS: ${expected.profile}\n`);

if (warnings.length) {
  console.log('Advertencias:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
  console.log('');
}

if (errors.length) {
  console.log('Errores encontrados:');
  errors.forEach((error) => console.log(`- ${error}`));
  console.log('\nResultado: NO listo para exportar.\n');
  process.exit(1);
}

console.log('Resultado: OK, variante alineada para exportar.\n');
