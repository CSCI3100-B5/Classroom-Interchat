const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
if (!process.env.ACCESS_TOKEN_SECRET) require('dotenv').config(); // eslint-disable-line global-require

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number()
    .default(8080),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  ACCESS_TOKEN_SECRET: Joi.string().required()
    .description('Access token secret required for auth'),
  REFRESH_TOKEN_SECRET: Joi.string().required()
    .description('Refresh token secret required for auth'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  BASE_URL: Joi.string().default('https://classroom-interchat.herokuapp.com/')
    .description('Base url that is used to access this server')
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  accessTokenSecret: envVars.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: envVars.REFRESH_TOKEN_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
  },
  baseUrl: envVars.BASE_URL
};

module.exports = config;
