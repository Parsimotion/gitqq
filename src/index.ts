#!/usr/bin/env node

import { Command } from "commander";
import { initProjectCommand } from "./commands/initProject";
import { commitCommand } from "./commands/commit";
import { configCommand } from "./commands/config";
import { formatCommitsCommand } from "./commands/formatCommits";
import { statusCommand } from "./commands/status";
import { i18n } from "./i18n";

const program = new Command();

program
  .name("gitqq")
  .description(i18n.t("cli.description"))
  .version(i18n.t("cli.version"));

program.addCommand(initProjectCommand);
program.addCommand(commitCommand);
program.addCommand(configCommand);
program.addCommand(formatCommitsCommand);
program.addCommand(statusCommand);

// Establecer status como comando por defecto
program
  .action(() => {
    // Si no se especifica ningún comando, ejecutar el comando status
    statusCommand.parse(process.argv);
  });

program.parse(process.argv);
