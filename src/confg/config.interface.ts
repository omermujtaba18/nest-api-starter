interface IConfiguration {
  port: number;
  env: string;
  host: string;
  database: {
    uri: string;
  };
  jwtSecret: string;
  googleClientID: string;
  googleClientSecret: string;
}

export default IConfiguration;
