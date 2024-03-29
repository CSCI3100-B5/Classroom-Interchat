const Joi = require('joi');

// validate and load all the required envirnment variables for the server

// require and configure dotenv, will load vars in .env to PROCESS.ENV
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
  MONGO_TEST_HOST: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal('test'),
      then: Joi.string().required()
        .description('Mongo DB host url for testing'),
      otherwise: Joi.string().allow('').default(null)
    }),
  BASE_URL: Joi.string().default('https://classroom-interchat.herokuapp.com/')
    .description('Base url that is used to access this server'),
  EMAIL_USER: Joi.string().required()
    .description('The email account to send verification emails from'),
  EMAIL_PASSWORD: Joi.string().required()
    .description('The password to the email account')
}).unknown()
  .required();

// validate the environment variables
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// save the env vars into an object
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  accessTokenSecret: envVars.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: envVars.REFRESH_TOKEN_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    testHost: envVars.MONGO_TEST_HOST
  },
  baseUrl: envVars.BASE_URL,
  email: {
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASSWORD,
  }
};

// export the object
module.exports = config;
