import "dotenv/config";
import app from "./app";
import { getConnection } from "./database/connections";

const startServer = async () => {
  await getConnection();

  const port = Number(process.env.PORT || 3131);
  app.listen(port, () => {
    console.log(`servidor iniciado en el puerto ${port}....`);
  });
};

startServer();
