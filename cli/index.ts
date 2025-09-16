#!/usr/bin/env node
import { Command } from "commander";
import { register } from "./lib/auth/register.js";

const program = new Command();

program.name("esr").description("Executable Script Runner").version("0.0.1");

program
  .command("register <email>")
  .alias("r")
  .description("Register SSH & GPG keys")
  .action((email: string) => {
    register(email);
  });

program.parse(process.argv);
