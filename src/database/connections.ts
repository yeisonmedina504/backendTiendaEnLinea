import "dotenv/config";
import sql from "mssql";

const dbsetting: sql.config = {
  driver: "msnodesqlv8",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE || process.env.DB_NAME || "4Js Store",
  port: Number(process.env.DB_PORT || 1433),
  user: process.env.DB_USER || "yeisonmedina504",
  password: process.env.DB_PASSWORD || "yeison2000",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbsetting);
    const result = await pool
      .request()
      .query("SELECT GETDATE() AS fecha, @@VERSION AS version");

    console.log("Consulta ejecutada:");
    console.log(result.recordset);

    return pool;
  } catch (error) {
    console.error("Error al conectar a SQL Server:", error);
  }
};
