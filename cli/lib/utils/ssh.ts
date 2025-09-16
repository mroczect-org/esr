import fs from "fs";
import path from "path";
import forge from "node-forge";

export async function generateSSHKey(email: string, sshDir: string) {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 4096, e: 0x10001 });

  const privatePem = forge.pki.privateKeyToPem(keypair.privateKey);
  const publicOpenSSH = forge.ssh.publicKeyToOpenSSH(keypair.publicKey, email);

  const privatePath = path.join(sshDir, "key_prv_esr");
  const publicPath = path.join(sshDir, "key_pub_esr.pub");

  fs.writeFileSync(privatePath, privatePem, { mode: 0o600 });
  fs.writeFileSync(publicPath, publicOpenSSH, { mode: 0o644 });

  const md = forge.md.sha256.create();
  md.update(publicOpenSSH, "utf8");

  return { privatePath, publicPath, fingerprint: md.digest().toHex() };
}
