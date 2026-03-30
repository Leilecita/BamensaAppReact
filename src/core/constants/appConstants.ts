export const APP_CONSTANTS = {
 // Cuentas clave
 CUENTA_CAJA_GENERAL: 2,
 CUENTA_CAJA_GENERAL_NOMBRE: 'Caja general',
 CUENTA_VARIOS: 1,

 // Monedas
 ID_COIN_USD: 2,

 // App names
 NAME_BAMENSA: 'Change app',
 NAME_FISHERTON: 'Fisherton app',
 NAME_MENDOZA: 'Mendoza app',

 // Build config ids
 BUILD_CONFIG_GRADLE_FISHERTON_APP_ID: 'com.example.fisherton',
 BUILD_CONFIG_GRADLE_BAMENSA_APP_ID: 'com.example.bamensa',
 BUILD_CONFIG_GRADLE_MENDOZA_APP_ID: 'com.example.bamensa_dev',

 // Account ids especiales
 ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL: 319,
 ACCOUNT_ID_SUCURSAL_CENTRO_EN_APP_FISHERTON: 317,

 // URLs
 URL_FISHERTON: 'http://frutos-dev.abarbieri.com.ar/',
 URL_BAMENSA_PRINCIPAL: 'http://loteriasole.abarbieri.com.ar/',
 URL_MENDOZA_PRINCIPAL: 'http://bamensa-dev.abarbieri.com.ar/',

 // Tipos/estados globales
 TYPE_ALL: 'Todo',
 STATE_DONE: 'done',
 STATE_PENDIENT: 'pendient',
 STATE_ALL: 'Todo',
 COIN_ALL: -1,
 USER_ALL: -1,

 // Categorias
 CATEGORY_TRANSF: 'transf',
 CATEGORY_BASIC: 'basic',
 CATEGORY_BLACK: 'black',
 CATEGORY_GOLD: 'gold',
 CATEGORY_PLATINUM: 'platinum',
 CATEGORY_PERSONAL: 'cuenta propia',

 // Tipos de operacion
 TYPE_COMPRA: 'compra',
 TYPE_VENTA: 'venta',
 TYPE_RETIRO: 'retiro',
 TYPE_DEPOSITO: 'deposito',
 TYPE_GASTO: 'gasto',
 TYPE_EXTRACCION: 'extraccion',

 // Vistas
 TYPE_VIEW_DETAIL: 'detalle',
 TYPE_VIEW_RESUM: 'general',

 // Affect
 AFFECT_ACO: 'ACO',
 AFFECT_ACI: 'ACI',

 METHODS: {
  GET_REPORTS_OPERATION: 'getReportsOperation',
 },
} as const;

