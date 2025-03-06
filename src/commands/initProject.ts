import simpleGit from "simple-git";
import { Command } from "commander";
import { i18n } from "../i18n";

const git = simpleGit();

export const initProjectCommand = new Command("init-project")
  .description(i18n.t("commands.initProject.description"))
  .action(async () => {
    try {
      console.log(i18n.t("commands.initProject.messages.initializingRepo"));
      await git.init();

      console.log(i18n.t("commands.initProject.messages.repoInitialized"));

      console.log(i18n.t("commands.initProject.messages.creatingCommit"));
      await git.commit("(chore): initial commit", { "--allow-empty": null });

      console.log(i18n.t("commands.initProject.messages.projectInitialized"));
    } catch (error) {
      console.error(i18n.t("commands.initProject.messages.initError"), error);
    }
  });
