import type { ExpoConfig } from 'expo/config';

type AppVariant = 'bamensa' | 'fisherton' | 'mendoza';

type VariantConfig = {
 name: string;
 slug: string;
 icon: string;
 androidPackage: string;
 iosBundleIdentifier: string;
 baseUrl: string;
};

const VARIANTS: Record<AppVariant, VariantConfig> = {
 bamensa: {
  name: 'Change app',
  slug: 'bamensa-app',
  icon: './assets/app-icons/logo.png',
  androidPackage: 'com.example.bamensa',
  iosBundleIdentifier: 'com.example.bamensa',
  baseUrl: 'http://loteriasole.abarbieri.com.ar/',
 },
 fisherton: {
  name: 'Fisherton app',
  slug: 'fisherton-app',
  icon: './assets/app-icons/logo_ic_fisherton5.png',
  androidPackage: 'com.example.fisherton',
  iosBundleIdentifier: 'com.example.fisherton',
  baseUrl: 'http://frutos-dev.abarbieri.com.ar/',
 },
 mendoza: {
  name: 'Mendoza app',
  slug: 'bamensa-mendoza-app',
  icon: './assets/app-icons/logo.png',
  androidPackage: 'com.example.bamensa_dev',
  iosBundleIdentifier: 'com.example.bamensa_dev',
  baseUrl: 'http://bamensa-dev.abarbieri.com.ar/',
 },
};

const resolveVariant = (): AppVariant => {
 const raw = String(process.env.APP_VARIANT ?? 'bamensa').trim().toLowerCase();
 if (raw === 'fisherton' || raw === 'mendoza' || raw === 'bamensa') return raw;
 return 'bamensa';
};

export default (): ExpoConfig => {
 const variant = resolveVariant();
 const selected = VARIANTS[variant];
 const resolvedBaseUrl = process.env.EXPO_PUBLIC_BASE_URL || selected.baseUrl;

 return {
  owner: 'leilecita10',
  name: selected.name,
  slug: selected.slug,
  version: '1.0.0',
  orientation: 'portrait',
  icon: selected.icon,
  userInterfaceStyle: 'light',
  splash: {
   image: './assets/splash-icon.png',
   resizeMode: 'contain',
   backgroundColor: '#ffffff',
  },
  ios: {
   supportsTablet: true,
   bundleIdentifier: selected.iosBundleIdentifier,
  },
  android: {
   package: selected.androidPackage,
   adaptiveIcon: {
    backgroundColor: '#E6F4FE',
    foregroundImage: './assets/android-icon-foreground.png',
    backgroundImage: './assets/android-icon-background.png',
    monochromeImage: './assets/android-icon-monochrome.png',
   },
   predictiveBackGestureEnabled: false,
  },
  web: {
   favicon: './assets/favicon.png',
  },
  extra: {
   appVariant: variant,
   baseUrl: resolvedBaseUrl,
   eas: {
    projectId: 'f959eabf-bafd-440f-a528-ebb9c9234503',
   },
  },
 };
};
