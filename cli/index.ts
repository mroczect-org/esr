#!/usr/bin/env node
import { Command } from "commander";
import clipboard from "clipboardy";
import { register } from "@lib/auth/register.js";

const program = new Command();

program.name("esr").description("Executable Script Runner").version("0.0.1");

program
  .command("register <email>")
  .alias("r")
  .description("Register SSH & GPG keys")
  .action((email: string) => {
    register(email);
  });
const setup = program
  .command("setup")
  .description("Setup SSH & GPG keys for GitHub")
  .action(async () => {
    const { setup } = await import("@lib/auth/setup.js");
    await setup();
  });
setup
  .command("cp")
  .description("Copy SSH or GPG key to clipboard")
  .option("--ssh", "Copy SSH public key")
  .option("--gpg", "Copy GPG public key")
  .action(async (options) => {
    const { loadConfig, getSSHKey, getGPGKey } = await import("@lib/auth/setup.js");
    const config = loadConfig();

    if (options.ssh) {
      const ssh = getSSHKey(config);
      await clipboard.write(ssh);
      console.log("✔ SSH key copied to clipboard.");
    } else if (options.gpg) {
      const gpg = getGPGKey(config);
      await clipboard.write(gpg);
      console.log("✔ GPG key copied to clipboard.");
    } else {
      console.error("✘ Please specify --ssh or --gpg");
      process.exit(1);
    }
  });

program.parse(process.argv);
