import simpleGit from "simple-git";
import { Command } from "commander";
import inquirer from "inquirer";

const git = simpleGit();

// Semantic commit types according to Conventional Commits
const COMMIT_TYPES = {
  feat: "New features",
  fix: "Bug fixes",
  docs: "Documentation changes",
  style: "Changes that do not affect the meaning of the code (whitespace, formatting, etc.)",
  refactor: "Code changes that neither fix bugs nor add features",
  perf: "Performance improvements",
  test: "Adding or correcting tests",
  build: "Changes that affect the build system or external dependencies",
  ci: "Changes to CI configuration and scripts",
  chore: "Other changes that don't modify src or test files",
  revert: "Reverts a previous commit",
};

export const commitCommand = new Command("commit")
  .argument("[message]", "Commit message (optional)")
  .option("-t, --type <type>", "Semantic commit type", "feat")
  .option("-s, --scope <scope>", "Scope of the change (optional)")
  .option("-b, --breaking", "Indicates a breaking change", false)
  .option("-d, --description <description>", "Detailed description of the commit (optional)")
  .option("-m, --full-message <message>", "Complete commit message (overrides other options)")
  .option("-n, --non-interactive", "Use non-interactive mode (skip prompts)")
  .description("Creates a commit following Conventional Commits conventions")
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
          commitMessage += "\n\nBREAKING CHANGE: This change breaks compatibility with previous versions.";
        }
      } else if (options.fullMessage) {
        commitMessage = options.fullMessage;
      } else {
        // Non-interactive mode
        // Validate commit type
        const type = options.type.toLowerCase();
        if (!Object.keys(COMMIT_TYPES).includes(type)) {
          console.error(`❌ Invalid commit type: ${type}`);
          console.log("Valid commit types:");
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
          console.error("❌ You must provide a message for the commit");
          return;
        }
        
        commitMessage += `: ${mainMessage}`;
        
        // Add detailed description if present and not equal to main message
        if (options.description && options.description !== messageArgument) {
          commitMessage += `\n\n${options.description}`;
        }
        
        // Add footer for breaking changes
        if (options.breaking) {
          commitMessage += "\n\nBREAKING CHANGE: This change breaks compatibility with previous versions.";
        }
      }

      console.log(`📝 Generating commit with message: "${commitMessage}"`);
      await git.add("./*");
      await git.commit(commitMessage);
      console.log("✅ Commit created successfully.");
    } catch (error) {
      console.error("❌ Error creating commit:", error);
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
      message: 'Select the type of change:',
      choices: typeChoices,
      default: options.type || 'feat'
    },
    {
      type: 'input',
      name: 'scope',
      message: 'What is the scope of this change (optional):',
      default: options.scope || ''
    },
    {
      type: 'confirm',
      name: 'breaking',
      message: 'Does this change break backward compatibility?',
      default: options.breaking || false
    },
    {
      type: 'input',
      name: 'message',
      message: 'Write a short description:',
      default: defaultMessage || '',
      validate: (input: string) => {
        if (input.trim() === '') {
          return 'Description is required';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a longer description (optional):',
      default: options.description || ''
    }
  ]);
}
