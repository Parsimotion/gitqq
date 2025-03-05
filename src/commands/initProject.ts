import simpleGit from "simple-git";
import { Command } from "commander";

const git = simpleGit();

export const initProjectCommand = new Command("init-project")
  .description("Inicializa un repositorio Git y crea un primer commit vacío")
  .action(async () => {
    try {
      console.log("📂 Inicializando repositorio Git...");
      await git.init();

      console.log("✅ Repositorio Git inicializado.");

      console.log("📝 Creando primer commit vacío...");
      await git.commit("(chore): initial commit", { "--allow-empty": null });

      console.log("✅ Proyecto Git inicializado con éxito.");
    } catch (error) {
      console.error("❌ Error al inicializar el proyecto:", error);
    }
  });
