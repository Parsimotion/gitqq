import { Command } from "commander";
import inquirer from "inquirer";
import { i18n, Language } from "../i18n";

export const configCommand = new Command("config")
  .description("Manage git-smart configuration")
  .action(async () => {
    const currentLanguage = i18n.getCurrentLanguage();
    console.log(`${i18n.t("config.currentLanguage").replace("{0}", currentLanguage)}`);
  });

// Subcomando para cambiar el idioma
configCommand
  .command("language")
  .description("Change the language of the CLI")
  .action(async () => {
    const currentLanguage = i18n.getCurrentLanguage();
    
    // Opciones de idioma
    const languageChoices = [
      { name: "English", value: "en" },
      { name: "Español", value: "es" },
      { name: "Português", value: "pt" }
    ];
    
    // Preguntar al usuario qué idioma quiere usar
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: i18n.t("config.selectLanguage"),
        choices: languageChoices,
        default: currentLanguage
      }
    ]);
    
    // Guardar la configuración
    const success = i18n.setLanguage(answers.language as Language);
    
    if (success) {
      console.log(i18n.t("config.saved"));
    } else {
      console.error(i18n.t("config.error"));
    }
  });

// Subcomando para mostrar la configuración actual
configCommand
  .command("show")
  .description("Show current configuration")
  .action(() => {
    const currentLanguage = i18n.getCurrentLanguage();
    console.log(`${i18n.t("config.currentLanguage").replace("{0}", currentLanguage)}`);
  }); 