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
  mail: { apiKey: string; defaultFromEmail: string; defaultFromName: string };
}

export default IConfiguration;
