import IConfiguration from './config.interface';

export default (): IConfiguration => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.MONGODB_HOST || 'localhost',
    port: parseInt(process.env.MONGODB_PORT as string, 10) || 27017,
    username: process.env.MONGODB_USERNAME || 'docker',
    password: process.env.MONGODB_PASSWORD || 'mongop',
    database: process.env.MONGODB_DATABASE || 'weyrk',
  },
});
