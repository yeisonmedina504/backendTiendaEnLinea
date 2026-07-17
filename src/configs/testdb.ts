// test-db.ts
import { getConnection } from "./db";

async function test() {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT GETDATE() AS fecha, @@VERSION AS version");
    console.log("✅ Conexión exitosa!");
    console.log(result.recordset);
  } catch (err: any) {
    console.error("❌ Error al conectar:", err.message);
  } finally {
    process.exit();
  }
}

test();
