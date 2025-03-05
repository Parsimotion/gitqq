import simpleGit from "simple-git";
import { Command } from "commander";

const git = simpleGit();

export const commitCommand = new Command("commit")
  .argument("<mensaje>", "Mensaje del commit")
  .description("Genera un commit con convenciones")
  .action(async (mensaje) => {
    try {
      console.log(`📝 Generando commit con mensaje: "${mensaje}"`);
      await git.add("./*");
      await git.commit(mensaje);
      console.log("✅ Commit creado con éxito.");
    } catch (error) {
      console.error("❌ Error al hacer commit:", error);
    }
  });
