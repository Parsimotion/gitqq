#!/usr/bin/env node

import { Command } from "commander";
import { initProjectCommand } from "./commands/initProject";
import { commitCommand } from "./commands/commit";
import { configCommand } from "./commands/config";
import { formatCommitsCommand } from "./commands/formatCommits";
import { statusCommand } from "./commands/status";
import { i18n } from "./i18n";
import { spawn } from "child_process";

const git = "git"; // Comando git

// Verificar si el comando es conocido
const knownCommands = ["init-project", "commit", "config", "format-commits", "status", "st", "ci"];
const args = process.argv.slice(2);
const command = args[0];

// Si no hay comando o es un comando conocido, usar Commander
if (!command || knownCommands.includes(command)) {
  const program = new Command();

  program
    .name("gitqq")
    .description(i18n.t("cli.description"))
    .version(i18n.t("cli.version"));

  // Crear alias para los comandos
  const stCommand = new Command("st")
    .description(i18n.t("commands.status.description") + " (alias)")
    .action(async () => {
      await statusCommand.parseAsync([]);
    });

  const ciCommand = new Command("ci")
    .description(i18n.t("commands.commit.description") + " (alias)")
    .action(async () => {
      await commitCommand.parseAsync([]);
    });

  program.addCommand(initProjectCommand);
  program.addCommand(commitCommand);
  program.addCommand(configCommand);
  program.addCommand(formatCommitsCommand);
  program.addCommand(statusCommand);
  program.addCommand(stCommand);
  program.addCommand(ciCommand);

  // Establecer status como comando por defecto
  program
    .action(async () => {
      // Si no se especifica ningún comando, ejecutar el comando status
      await statusCommand.parseAsync([]);
    });

  program.parse(process.argv);
} else {
  // Si es un comando desconocido, redirigir a Git
  console.log(i18n.t("cli.unknownCommand").replace("%s", command));
  console.log(i18n.t("cli.redirectingToGit"));
  
  // Crear un proceso hijo para ejecutar el comando git
  const gitProcess = spawn(git, args, {
    stdio: 'inherit', // Redirigir stdin/stdout/stderr al proceso padre
    shell: true
  });
  
  gitProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(i18n.t("cli.gitCommandFailed").replace("%s", code?.toString() || "1"));
      process.exit(code || 1);
    } else {
      console.log(i18n.t("cli.gitCommandSuccess"));
    }
  });
  
  gitProcess.on('error', (err) => {
    console.error(i18n.t("cli.gitExecutionError"), err);
    process.exit(1);
  });
}
