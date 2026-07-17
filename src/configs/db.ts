import sql = require("mssql");

const config: sql.config = {
  driver: "msnodesqlv8",
  server: "yeison", // o 'MIPC\\SQLEXPRESS'
  database: "4Js Store",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

export { sql };
