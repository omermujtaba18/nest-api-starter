interface IConfiguration {
  port: number;
  env: string;
  host: string;
  database: {
    username: string;
    password: string;
    host: string;
    port: number;
    database: string;
  };
}

export default IConfiguration;
