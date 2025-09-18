import fs from "fs";
import path from "path";
import os from "os";

export function loadConfig() {
  const configPath = path.join(os.homedir(), ".esr", ".esrrc");
  if (!fs.existsSync(configPath)) {
    console.error("✘ No ESR identity found. Run `esr r <email>` first.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function getSSHKey(config: any): string {
  try {
    return fs.readFileSync(config.ssh.public, "utf-8").trim();
  } catch {
    console.error("✘ SSH public key not found.");
    process.exit(1);
  }
}

export function getGPGKey(config: any): string {
  try {
    return fs.readFileSync(config.gpg.public, "utf-8").trim();
  } catch {
    return "⚠ GPG public key not found. Please re-run `esr register <email>`.";
  }
}

export function setup() {
  const config = loadConfig();
  const sshPublic = getSSHKey(config);
  const gpgPublic = getGPGKey(config);

  const tutorialLink = `
  # Full tutorial = https://gist.github.com/mroczect-org/73d722b34d5778b60e49cc8b332ef195
`;

  const content = `
ESR Setup Guide for ${config.email}

Step 1: SSH Key
---------------
${sshPublic}

Step 2: GPG Key
---------------
${gpgPublic}

${tutorialLink}
`;

  const outFile = path.join(process.cwd(), "setup-esr.txt");
  fs.writeFileSync(outFile, content.trim(), { mode: 0o600 });

  console.log(`✔ Setup file generated: ${outFile}`);
  console.log(`See ${path.basename(outFile)} for instructions`);
}
