import fs from "fs";
import path from "path";
import * as openpgp from "openpgp";

export async function generateGPGKey(email: string, gpgDir: string) {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: "rsa",
    rsaBits: 4096,
    userIDs: [{ email }],
  });

  const privatePath = path.join(gpgDir, "prvEsr.asc");
  const publicPath = path.join(gpgDir, "pubEsr.asc");

  fs.writeFileSync(privatePath, privateKey, { mode: 0o600 });
  fs.writeFileSync(publicPath, publicKey, { mode: 0o644 });

  // fingerprint perlu parse dulu
  const parsed = await openpgp.readKey({ armoredKey: publicKey });

  return { privatePath, publicPath, fingerprint: parsed.getFingerprint() };
}
