import app from "../..";
import crypto from "crypto";
import { Solara } from "../../utils/errors/Solara";
import Tokens from "../../database/models/tokens";
import hotfixes from "../../database/models/hotfixes";
import verifyAuth from "../../utils/handlers/verifyAuth";


export default function () {
    app.get("/fortnite/api/cloudstorage/system", async (c) => {
        try {
          const csFile = await hotfixes.findOne({ method: "cloudstorage" });
      
          if (!csFile) {
            return c.json({ error: "No hotfixes found" });
          }
      
          const formattedFiles = csFile.rows.map((row) => {
            const date = new Date().toISOString();
      
            const sha256 = crypto.createHash("sha256").update(date).digest("hex");
            const sha1 = crypto.createHash("sha1").update(date).digest("hex");
      
            return {
              uniqueFilename: `${row.name}`,
              filename: row.name,
              hash: sha1,
              hash256: sha256,
              length: Buffer.byteLength(row.data),
              contentType: "application/octet-stream",
              uploaded: date,
              storageType: "S3",
              storageIds: {},
              doNotCache: true,
            };
          });
      
          return c.json(formattedFiles);
        } catch (error) {
          console.error("Error", error);
        }
      });
      
      app.get("/fortnite/api/cloudstorage/system/config", async (c) => {
        try {
          const csFile = await hotfixes.findOne({ method: "cloudstorage" });
      
          if (!csFile) {
            return c.json({ error: "No files found in cloud storage" });
          }
      
          const formattedFiles = csFile.rows.map((row) => {
            const date = new Date().toISOString();
      
            const sha256 = crypto.createHash("sha256").update(date).digest("hex");
            const sha1 = crypto.createHash("sha1").update(date).digest("hex");
      
            return {
              uniqueFilename: `${row.name}-${sha256}`,
              filename: row.name,
              hash: sha1,
              hash256: sha256,
              length: Buffer.byteLength(row.data),
              contentType: "application/octet-stream",
              uploaded: date,
              storageType: "S3",
              storageIds: {},
              doNotCache: true,
            };
          });
      
          return c.json(formattedFiles);
        } catch (error) {
          console.error("Error retrieving config files:", error);
        }
      });
}
