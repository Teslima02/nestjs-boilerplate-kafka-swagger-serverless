export const configConstant = {
  environment: {
    development: 'NODE_ENV',
    staging: 'NODE_ENV',
    production: 'NODE_ENV',
  },
  database: {
    dev: 'MONGODB_LOCAL_URL',
    prod: 'MONGODB_LIVE',
  },
  jwt: {
    jwtSecret: 'JWT_KEY',
    expireIn: 'JWT_EXP',
  },
  amadeus: {
    amadeusUrl: 'AMADEUS_URL',
    amadeusClientID: 'AMADEUS_CLIENT_ID',
    amadeusSecret: 'AMADEUS_SECRET',
    amadeusLiveUrl: 'AMADEUS_LIVE_URL',
    amadeusLiveClientID: 'AMADEUS_LIVE_CLIENT_ID',
    amadeusLiveSecret: 'AMADEUS_LIVE_SECRET',
    amadeusType: 'AMADEUS_TYPE',
  },
  redis: {
    redisUrl: 'REDIS_URL',
  },
};
