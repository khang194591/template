enum EnvKey {
  BASE_PATH = 'BASE_PATH',
  CORS_WHITE_LIST = 'CORS_WHITE_LIST',
  MAX_REQUEST_SIZE = 'MAX_REQUEST_SIZE',
  PORT = 'PORT',
  // Database
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  DB_TYPE = 'mysql',
  // JWT
  ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY',
  ACCESS_TOKEN_EXPIRED_IN = 'ACCESS_TOKEN_EXPIRED_IN',
  REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY',
  REFRESH_TOKEN_EXPIRED_IN = 'REFRESH_TOKEN_EXPIRED_IN',
}

export default EnvKey;