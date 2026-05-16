export type AppVariant = 'bamensa' | 'fisherton' | 'mendoza';

const normalizeVariant = (value: string): AppVariant => {
 const raw = String(value ?? '').trim().toLowerCase();
 if (raw === 'fisherton') return 'fisherton';
 if (raw === 'mendoza') return 'mendoza';
 return 'bamensa';
};

export const getAppVariant = (): AppVariant => {
 const envVariant = process.env.EXPO_PUBLIC_APP_VARIANT || process.env.APP_VARIANT || '';
 const resolved = normalizeVariant(envVariant || 'bamensa');
 if (__DEV__) {
  console.log('[APP_VARIANT]', { envVariant, resolved });
 }
 return resolved;
};
