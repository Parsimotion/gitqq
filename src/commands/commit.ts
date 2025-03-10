import simpleGit from "simple-git";
import { Command } from "commander";
import inquirer from "inquirer";
import { i18n } from "../i18n";

const git = simpleGit();

// Get commit types from translations
const COMMIT_TYPES = i18n.getTranslationObject("commitTypes");

/**
 * Checks the repository status and returns information about staged and unstaged files
 * @returns Object with status information
 */
async function checkRepositoryStatus() {
  const status = await git.status();
  
  return {
    isRepo: true, // Simplemente asumimos que es un repositorio válido ya que estamos ejecutando comandos git
    staged: status.staged,
    stagedCount: status.staged.length,
    modified: status.modified,
    modifiedCount: status.modified.length,
    created: status.created,
    createdCount: status.created.length,
    deleted: status.deleted,
    deletedCount: status.deleted.length,
    renamed: status.renamed,
    renamedCount: status.renamed.length,
    conflicted: status.conflicted,
    conflictedCount: status.conflicted.length,
    notAdded: status.not_added,
    notAddedCount: status.not_added.length,
    hasChanges: status.files && status.files.length > 0,
    hasStagedChanges: status.staged.length > 0 || status.created.length > 0 || status.deleted.length > 0 || status.renamed.length > 0,
    hasUnstagedChanges: false, // Lo calcularemos después de filtrar los modificados
    isClean: status.isClean(),
    ahead: status.ahead,
    behind: status.behind,
    files: status.files || []
  };
}

/**
 * Displays a summary of the repository status
 * @param status Repository status object
 */
function displayStatusSummary(status: any) {
  console.log(i18n.t("commands.commit.messages.repoStatus"));
  
  // 1. Staged changes (will be committed)
  if (status.hasStagedChanges) {
    console.log(i18n.t("commands.commit.messages.stagedChanges"));
    
    if (status.staged.length > 0) {
      status.staged.forEach((file: string) => {
        console.log(`  - ${file}`);
      });
    }
    
    if (status.created.length > 0) {
      console.log(i18n.t("commands.commit.messages.newFiles"));
      status.created.forEach((file: string) => {
        console.log(`  - ${file}`);
      });
    }
    
    if (status.deleted.length > 0) {
      console.log(i18n.t("commands.commit.messages.deletedFiles"));
      status.deleted.forEach((file: string) => {
        console.log(`  - ${file}`);
      });
    }
    
    if (status.renamed.length > 0) {
      console.log(i18n.t("commands.commit.messages.renamedFiles"));
      status.renamed.forEach((file: any) => {
        console.log(`  - ${file.from} → ${file.to}`);
      });
    }
  }
  
  // 2. Modified files (changes not staged for commit)
  const modifiedNotStaged = status.modified.filter((file: string) => 
    !status.staged.includes(file)
  );
  
  if (modifiedNotStaged.length > 0) {
    console.log(i18n.t("commands.commit.messages.modifiedNotStaged"));
    modifiedNotStaged.forEach((file: string) => {
      console.log(`  - ${file}`);
    });
  }
  
  // 2.1 Deleted files not staged for commit
  const deletedUnstaged = status.files && Array.isArray(status.files) 
    ? status.files.filter((file: any) => 
        file.working_dir === 'D' && file.index !== 'D'
      ).map((file: any) => file.path)
    : [];
  
  if (deletedUnstaged.length > 0) {
    console.log(i18n.t("commands.commit.messages.deletedNotStaged"));
    deletedUnstaged.forEach((file: string) => {
      console.log(`  - ${file}`);
    });
  }
  
  // 3. Untracked files (separate category)
  if (status.notAdded.length > 0) {
    console.log(i18n.t("commands.commit.messages.untrackedFiles"));
    status.notAdded.forEach((file: string) => {
      console.log(`  - ${file}`);
    });
  }
  
  // 4. Conflicted files
  if (status.conflictedCount > 0) {
    console.log(i18n.t("commands.commit.messages.conflictedFiles"));
    status.conflicted.forEach((file: string) => {
      console.log(`  - ${file}`);
    });
  }
  
  // 5. Summary of what will be committed vs what won't
  if (status.hasStagedChanges || status.hasUnstagedChanges) {
    console.log(i18n.t("commands.commit.messages.commitSummary", 
      status.staged.length + status.created.length + status.deleted.length + status.renamed.length,
      modifiedNotStaged.length + deletedUnstaged.length + status.notAdded.length));
  }
}

export const commitCommand = new Command("commit")
  .argument("[message]", i18n.t("commands.commit.options.message"))
  .option("-t, --type <type>", i18n.t("commands.commit.options.type"), "feat")
  .option("-s, --scope <scope>", i18n.t("commands.commit.options.scope"))
  .option("-brk, --breaking", i18n.t("commands.commit.options.breaking"), false)
  .option("-m, --description <description>", i18n.t("commands.commit.options.description"))
  .option("-fm, --full-message <message>", i18n.t("commands.commit.options.fullMessage"))
  .option("-n, --non-interactive", i18n.t("commands.commit.options.nonInteractive"), false)
  .description(i18n.t("commands.commit.description"))
  .action(async (messageArgument, options) => {
    try {
      // Check repository status
      const status = await checkRepositoryStatus();
      
      // Display repository status
      displayStatusSummary(status);
      
      // Calculate real unstaged changes after filtering out staged files
      const modifiedNotStaged = status.modified.filter(file => !status.staged.includes(file));
      const deletedUnstaged = status.files && Array.isArray(status.files) 
        ? status.files.filter(file => file.working_dir === 'D' && file.index !== 'D').map(file => file.path)
        : [];
      
      // Update hasUnstagedChanges based on filtered data
      status.hasUnstagedChanges = modifiedNotStaged.length > 0 || deletedUnstaged.length > 0 || status.notAdded.length > 0;
      
      // If there are no staged changes, inform the user and exit
      if (!status.hasStagedChanges) {
        console.error(i18n.t("commands.commit.messages.noStagedChanges"));
        console.log(i18n.t("commands.commit.messages.stageChangesHint"));
        return;
      }
      
      // If there are unstaged changes, ask if the user wants to continue
      if (status.hasUnstagedChanges) {
        const { shouldContinue } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldContinue',
            message: i18n.t("commands.commit.prompts.continueWithUnstagedChanges"),
            default: true
          }
        ]);
        
        if (!shouldContinue) {
          console.log(i18n.t("commands.commit.messages.commitCancelled"));
          return;
        }
      }
      
      let commitMessage = "";

      // Obtener el modo de interacción configurado
      const configuredMode = i18n.getCurrentInteractionMode();
      
      // Determinar si debemos usar el modo no interactivo basado en la configuración y los parámetros
      const hasCommandLineParams = Boolean(messageArgument) || 
                                  options.type !== "feat" || 
                                  Boolean(options.scope) || 
                                  options.breaking || 
                                  Boolean(options.description) || 
                                  Boolean(options.fullMessage);

      // Determinar el modo de interacción final
      let useNonInteractive = false;
      
      switch (configuredMode) {
        case 'non-interactive':
          useNonInteractive = true;
          break;
        case 'interactive':
          useNonInteractive = options.nonInteractive;
          break;
        case 'hybrid':
          useNonInteractive = options.nonInteractive || hasCommandLineParams;
          break;
      }

      // Si estamos en modo no interactivo o tenemos un mensaje completo
      if (useNonInteractive || options.fullMessage) {
        // Non-interactive mode
        // Validate commit type
        const type = options.type.toLowerCase();
        if (!Object.keys(COMMIT_TYPES).includes(type)) {
          console.error(i18n.t("commands.commit.messages.invalidType", type));
          console.log(i18n.t("commands.commit.messages.validTypes"));
          Object.entries(COMMIT_TYPES).forEach(([key, value]) => {
            console.log(`  - ${key}: ${value}`);
          });
          return;
        }

        // Build message according to Conventional Commits
        commitMessage = type;
        
        // Add scope if present
        if (options.scope) {
          commitMessage += `(${options.scope})`;
        }
        
        // Add breaking change indicator
        if (options.breaking) {
          commitMessage += "!";
        }
        
        // Add main message
        const mainMessage = messageArgument || options.description || "";
        if (!mainMessage) {
          console.error(i18n.t("commands.commit.messages.messageRequired"));
          return;
        }
        
        commitMessage += `: ${mainMessage}`;
        
        // Add detailed description if present and not equal to main message
        if (options.description && options.description !== messageArgument) {
          commitMessage += `\n\n${options.description}`;
        }
        
        // Add footer for breaking changes
        if (options.breaking) {
          commitMessage += `\n\n${i18n.t("commands.commit.messages.breakingChange")}`;
        }
      } else {
        const answers = await promptForCommitDetails(messageArgument, options);
        
        // Build message from interactive answers
        commitMessage = answers.type;
        
        if (answers.scope) {
          commitMessage += `(${answers.scope})`;
        }
        
        if (answers.breaking) {
          commitMessage += "!";
        }
        
        commitMessage += `: ${answers.message}`;
        
        if (answers.description) {
          commitMessage += `\n\n${answers.description}`;
        }
        
        if (answers.breaking) {
          commitMessage += `\n\n${i18n.t("commands.commit.messages.breakingChange")}`;
        }
      }

      console.log(i18n.t("commands.commit.messages.generatingCommit", commitMessage));
      
      // We no longer need to add all files since we're now checking staged files
      // await git.add("./*");
      
      await git.commit(commitMessage);
      console.log(i18n.t("commands.commit.messages.commitSuccess"));
    } catch (error) {
      console.error(i18n.t("commands.commit.messages.commitError"), error);
    }
  });

/**
 * Prompts the user for commit details in an interactive way
 * @param defaultMessage Default message to use (if provided as argument)
 * @param options Command options that may contain default values
 * @returns Object with all the commit details
 */
async function promptForCommitDetails(defaultMessage: string | undefined, options: any) {
  const typeChoices = Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    name: `${key}: ${value}`,
    value: key
  }));

  interface CommitAnswers {
    type: string;
    scope: string;
    breaking: boolean;
    message: string;
    description: string;
  }

  return inquirer.prompt<CommitAnswers>([
    {
      type: 'list',
      name: 'type',
      message: i18n.t("commands.commit.prompts.selectType"),
      choices: typeChoices,
      default: options.type || 'feat'
    },
    {
      type: 'input',
      name: 'message',
      message: i18n.t("commands.commit.prompts.shortDescription"),
      default: defaultMessage || '',
      validate: (input: string) => {
        if (input.trim() === '') {
          return i18n.t("commands.commit.prompts.descriptionRequired");
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'scope',
      message: i18n.t("commands.commit.prompts.enterScope"),
      default: options.scope || ''
    },
    {
      type: 'confirm',
      name: 'breaking',
      message: i18n.t("commands.commit.prompts.isBreaking"),
      default: options.breaking || false
    },
    {
      type: 'input',
      name: 'description',
      message: i18n.t("commands.commit.prompts.longDescription"),
      default: options.description || ''
    }
  ]);
}
