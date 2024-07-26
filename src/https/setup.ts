import type { Certificates } from "./interfaces";
import fs from "node:fs/promises";
import path from "node:path";
import app from "..";
import logger from "../utils/logger/logger";

export async function loadCerts(): Promise<Certificates> {
  const [key, cert]: [Buffer, Buffer] = await Promise.all([
    fs.readFile(path.join(__dirname, "..", "..", "static", "certs", "private.key")),
    fs.readFile(path.join(__dirname, "..", "..", "static", "certs", "public.key")),
  ]);

  return { key, cert };
}

export async function startHttps(): Promise<void> {
  const { key, cert }: Certificates = await loadCerts();

  Bun.serve({
    port: 443,
    fetch: app.fetch,
    cert,
    key,
  });

  logger.startup("HTTPS listening on port 443");
}