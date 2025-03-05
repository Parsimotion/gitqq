#!/usr/bin/env node

import { Command } from "commander";
import simpleGit from "simple-git";

const program = new Command();
const git = simpleGit();

program
  .name("git-smart")
  .description("CLI para facilitar el uso de Git con lenguaje natural")
  .version("1.0.0");

program
  .command("commit <mensaje>")
  .description("Genera un commit con convenciones")
  .action(async (mensaje) => {
    console.log(`Generando commit con mensaje: "${mensaje}"`);
    await git.add("./*");
    await git.commit(mensaje);
    console.log("✅ Commit creado con éxito.");
  });

program.parse(process.argv);
