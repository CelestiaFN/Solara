import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import stream from "stream";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import { Upload } from "@aws-sdk/lib-storage";
import verifyAuth from "../../utils/handlers/verifyAuth";

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: "6989b3cfee39668c4b82955c5c2f2903",
        secretAccessKey: "7afe38662535bef3fd7509810d28c33ed990440aba5d0bc35f5498e8cf0d903d",
    },
    endpoint: "https://12c008e459133019e8a56130d9ed8842.r2.cloudflarestorage.com",
    forcePathStyle: true,
});


export default function () {
    app.put("/fortnite/api/cloudstorage/user/:accountId/:file", verifyAuth, async (c) => {
        try {
            const { file, accountId } = c.req.param();
            if (
                file.toLowerCase() !== "clientsettings.sav" &&
                file.toLowerCase() !== "clientsettingsios.sav"
            ) {
                return c.json({ error: "file not found" });
            }

            const ver = getVersion(c);

            let s3file = `${accountId}/${file.replace(
                ".Sav",
                ""
            )}-${ver.season}.Sav`;

            const body: any = await c.req.blob()

            const upload = new Upload({
                client: s3,
                params: {
                    Bucket: "stuff",
                    Key: s3file,
                    Body: body as any,
                    ContentType: "application/octet-stream",
                } as any,
            });

            try {
                await upload.done();
                return c.json([])
            } catch (err) {
                console.log(err);
                return c.json({ error: "Failed to write file to S3" });
            }
        } catch (error) {
            console.log(error);
            return c.json([])
        }
    });

    app.get("/fortnite/api/cloudstorage/user/:accountId/:file", verifyAuth, async (c) => {
        try {
            const { file, accountId } = c.req.param();

            if (file.toLowerCase() !== "clientsettings.sav")
                return c.json({ error: "file not found" });

            const ver = getVersion(c);
            let s3File = `${accountId}/ClientSettings-${ver.season}.Sav`;

            const params = {
                Bucket: "stuff",
                Key: s3File,
            };

            try {
                const { Body } = await s3.send(new GetObjectCommand(params));
                if (!Body) {
                    return c.json([]);
                }
                const data: Buffer[] = [];
                await pipeline(
                    Body as NodeJS.ReadableStream,
                    new stream.Writable({
                        write(chunk: any, _encoding: any, callback: any) {
                            data.push(chunk);
                            callback();
                        },
                    })
                );
                const buffer: any = Buffer.concat(data);
                return c.body(buffer);
            } catch (err) {
                return c.json({ error: "Failed to get file" });
            }
        } catch (error) {
            return c.json({ error: "Failed to get file" });
        }
    });

    app.get("/fortnite/api/cloudstorage/user/:accountId", verifyAuth, async (c) => {
            try {
                const { accountId } = c.req.param();

                const ver = getVersion(c);

                let s3File = `${accountId}/ClientSettings-${ver.season}.Sav`;

                const params = {
                    Bucket: "stuff",
                    Key: s3File,
                };

                try {
                    const { Body } = await s3.send(new GetObjectCommand(params)) as any;
                    let data: any = [];
                    await pipeline(
                        Body as NodeJS.ReadableStream,
                        new stream.Writable({
                            write(chunk: any, _encoding: any, callback: any) {
                                data.push(chunk);
                                callback();
                            },
                        })
                    );
                    const ParsedFile = Buffer.concat(data).toString("utf-8");
                    const ParsedStats = data.LastModified;

                    return c.json([
                        {
                            uniqueFilename: "ClientSettings.Sav",
                            filename: "ClientSettings.Sav",
                            hash: crypto.createHash("sha1").update(ParsedFile).digest("hex"),
                            hash256: crypto
                                .createHash("sha256")
                                .update(ParsedFile)
                                .digest("hex"),
                            length: Buffer.byteLength(ParsedFile),
                            contentType: "application/octet-stream",
                            uploaded: ParsedStats,
                            storageType: "S3",
                            storageIds: {},
                            accountId: accountId,
                            doNotCache: false,
                        },
                    ]);
                } catch (err) {
                    return c.json([]);
                }
            } catch (error) {
                return c.json([]);
            }
        }
    );
}