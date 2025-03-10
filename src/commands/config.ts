import { Command } from "commander";
import inquirer from "inquirer";
import { i18n, Language } from "../i18n";

export const configCommand = new Command("config")
  .description("Manage gitqq configuration")
  .action(async () => {
    const currentLanguage = i18n.getCurrentLanguage();
    console.log(`${i18n.t("config.currentLanguage").replace("{0}", currentLanguage)}`);
  });

// Subcommand to change the language
configCommand
  .command("language")
  .description("Change the language of the CLI")
  .action(async () => {
    const currentLanguage = i18n.getCurrentLanguage();
    
    // Language options
    const languageChoices = [
      { name: "English", value: "en" },
      { name: "Español", value: "es" },
      { name: "Português", value: "pt" }
    ];
    
    // Ask the user which language they want to use
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: i18n.t("config.selectLanguage"),
        choices: languageChoices,
        default: currentLanguage
      }
    ]);
    
    // Save the configuration
    const success = i18n.setLanguage(answers.language as Language);
    
    if (success) {
      console.log(i18n.t("config.saved"));
    } else {
      console.error(i18n.t("config.error"));
    }
  });

// Subcommand to show the current configuration
configCommand
  .command("show")
  .description("Show current configuration")
  .action(() => {
    const currentLanguage = i18n.getCurrentLanguage();
    console.log(`${i18n.t("config.currentLanguage").replace("{0}", currentLanguage)}`);
  });

// Subcommand to change the interaction mode
configCommand
  .command("interaction")
  .description("Change the interaction mode of the CLI")
  .action(async () => {
    const currentMode = i18n.getCurrentInteractionMode();
    
    // Interaction mode options
    const modeChoices = [
      { 
        name: i18n.t("config.interactionModes.interactive"), 
        value: "interactive" 
      },
      { 
        name: i18n.t("config.interactionModes.nonInteractive"), 
        value: "non-interactive" 
      },
      { 
        name: i18n.t("config.interactionModes.hybrid"), 
        value: "hybrid" 
      }
    ];
    
    // Ask the user which mode they want to use
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: i18n.t("config.selectInteractionMode"),
        choices: modeChoices,
        default: currentMode
      }
    ]);
    
    // Save the configuration
    const success = i18n.setInteractionMode(answers.mode);
    
    if (success) {
      console.log(i18n.t("config.saved"));
    } else {
      console.error(i18n.t("config.error"));
    }
  }); 