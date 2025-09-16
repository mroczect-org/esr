import { ensureConfig } from "../utils/rc.js";
import { generateSSHKey } from "../utils/ssh.js";
import { generateGPGKey } from "../utils/gpg.js";
import fs from "fs";

export async function register(email: string) {
  const { sshDir, gpgDir, configPath } = ensureConfig();

  const sshKeys = await generateSSHKey(email, sshDir);
  const gpgKeys = await generateGPGKey(email, gpgDir);

  const config = {
    email,
    ssh: {
      private: sshKeys.privatePath,
      public: sshKeys.publicPath,
      fingerprint: sshKeys.fingerprint,
    },
    gpg: {
      private: gpgKeys.privatePath,
      public: gpgKeys.publicPath,
      fingerprint: gpgKeys.fingerprint,
    },
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✔ Registered new identity for ${email}`);
}
