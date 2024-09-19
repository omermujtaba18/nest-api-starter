import IConfiguration from './config.interface';

export default (): IConfiguration => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  database: {
    uri:
      process.env.DATABASE_URI ||
      'mongodb://docker:mongopw@localhost:27017/nest-api?authSource=admin',
  },
  jwtSecret: process.env.JWT_SECRET || 'secret',
  googleClientID: process.env.GOOGLE_CLIENT_ID || 'some-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'some-client-secret',
  mail: {
    apiKey: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key', // TODO: Add api key
    defaultFromEmail: process.env.SENDGRID_DEFAULT_FROM_EMAIL || '', // TODO: Add default from email
    defaultFromName: process.env.SENDGRID_DEFAULT_FROM_NAME || '', // TODO: Add default from name
  },
});
