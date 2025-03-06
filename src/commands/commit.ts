import simpleGit from "simple-git";
import { Command } from "commander";
import inquirer from "inquirer";
import { i18n } from "../i18n";

const git = simpleGit();

// Get commit types from translations
const COMMIT_TYPES = i18n.getTranslationObject("commitTypes");

export const commitCommand = new Command("commit")
  .argument("[message]", i18n.t("commands.commit.options.message"))
  .option("-t, --type <type>", i18n.t("commands.commit.options.type"), "feat")
  .option("-s, --scope <scope>", i18n.t("commands.commit.options.scope"))
  .option("-b, --breaking", i18n.t("commands.commit.options.breaking"), false)
  .option("-d, --description <description>", i18n.t("commands.commit.options.description"))
  .option("-m, --full-message <message>", i18n.t("commands.commit.options.fullMessage"))
  .option("-n, --non-interactive", i18n.t("commands.commit.options.nonInteractive"))
  .description(i18n.t("commands.commit.description"))
  .action(async (messageArgument, options) => {
    try {
      let commitMessage = "";

      // Use interactive mode by default unless non-interactive flag is set or full-message is provided
      if (!options.nonInteractive && !options.fullMessage) {
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
      } else if (options.fullMessage) {
        commitMessage = options.fullMessage;
      } else {
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
      }

      console.log(i18n.t("commands.commit.messages.generatingCommit", commitMessage));
      await git.add("./*");
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
      name: 'description',
      message: i18n.t("commands.commit.prompts.longDescription"),
      default: options.description || ''
    }
  ]);
}
