import fs from "fs";
import path from "path";
import os from "os";

export function ensureConfig() {
  const baseDir = path.join(os.homedir(), ".esr");
  const sshDir = path.join(baseDir, ".ssh");
  const gpgDir = path.join(baseDir, ".gpg");
  const configPath = path.join(baseDir, ".esrrc");

  [baseDir, sshDir, gpgDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, "{}", { mode: 0o600 });
  }

  return { baseDir, sshDir, gpgDir, configPath };
}
