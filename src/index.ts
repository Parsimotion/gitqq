#!/usr/bin/env node

import { Command } from "commander";
import { initProjectCommand } from "./commands/initProject.js";
import { commitCommand } from "./commands/commit.js";

const program = new Command();

program
  .name("git-smart")
  .description("CLI para facilitar el uso de Git con lenguaje natural")
  .version("1.0.0");

program.addCommand(initProjectCommand);
program.addCommand(commitCommand);

program.parse(process.argv);
