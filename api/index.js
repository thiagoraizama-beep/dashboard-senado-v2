import { app } from "../backend/src/app.js";
import { initDatabase } from "../backend/src/config/initDatabase.js";

let dbReady = null;

export default async function handler(req, res) {
  if (!dbReady) {
    dbReady = initDatabase();
  }
  await dbReady;
  return app(req, res);
}
