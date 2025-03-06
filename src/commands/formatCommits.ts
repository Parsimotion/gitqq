import { Command } from "commander";
import simpleGit from "simple-git";
import inquirer from "inquirer";
import { i18n } from "../i18n";

const git = simpleGit();

// Get commit types from translations
const COMMIT_TYPES = i18n.getTranslationObject("commitTypes");

// Regular expression to detect conventional commit format
// format: type(scope): message or type: message
const CONVENTIONAL_COMMIT_REGEX = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: .+/i;

// Function to suggest a conventional commit format based on the original message
function suggestConventionalCommit(message: string): { type: string, scope: string, breaking: boolean, message: string } | null {
  // Check if it's already in conventional format
  if (CONVENTIONAL_COMMIT_REGEX.test(message)) {
    return null; // Already conventional
  }

  // Try to detect the type of commit from the message
  const lowerMessage = message.toLowerCase();
  let type = "chore"; // Default type
  let scope = "";
  let breaking = false;
  
  // Check for common patterns in commit messages
  if (lowerMessage.includes("fix") || lowerMessage.includes("bug") || lowerMessage.includes("issue")) {
    type = "fix";
  } else if (lowerMessage.includes("feat") || lowerMessage.includes("add") || lowerMessage.includes("new")) {
    type = "feat";
  } else if (lowerMessage.includes("doc") || lowerMessage.includes("readme")) {
    type = "docs";
  } else if (lowerMessage.includes("test")) {
    type = "test";
  } else if (lowerMessage.includes("refactor") || lowerMessage.includes("clean")) {
    type = "refactor";
  } else if (lowerMessage.includes("style") || lowerMessage.includes("format")) {
    type = "style";
  } else if (lowerMessage.includes("perf") || lowerMessage.includes("performance")) {
    type = "perf";
  } else if (lowerMessage.includes("build") || lowerMessage.includes("webpack") || lowerMessage.includes("package")) {
    type = "build";
  } else if (lowerMessage.includes("ci") || lowerMessage.includes("travis") || lowerMessage.includes("github")) {
    type = "ci";
  } else if (lowerMessage.includes("revert")) {
    type = "revert";
  }

  // Check for breaking changes
  if (
    lowerMessage.includes("break") || 
    lowerMessage.includes("breaking") || 
    lowerMessage.includes("major") ||
    lowerMessage.includes("incompatible")
  ) {
    breaking = true;
  }

  // Clean up the message - remove any type prefixes that might be in the message
  let cleanMessage = message;
  const typePrefixes = Object.keys(COMMIT_TYPES);
  for (const prefix of typePrefixes) {
    if (lowerMessage.startsWith(prefix + ":")) {
      cleanMessage = message.substring(prefix.length + 1).trim();
      type = prefix;
      break;
    }
  }

  // Capitalize first letter of message
  if (cleanMessage.length > 0) {
    cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
  }

  return {
    type,
    scope,
    breaking,
    message: cleanMessage
  };
}

// Function to format a commit in conventional format
function formatConventionalCommit(type: string, scope: string, breaking: boolean, message: string): string {
  let formattedCommit = type;
  
  if (scope) {
    formattedCommit += `(${scope})`;
  }
  
  if (breaking) {
    formattedCommit += "!";
  }
  
  formattedCommit += `: ${message}`;
  
  if (breaking) {
    formattedCommit += `\n\n${i18n.t("commands.commit.messages.breakingChange")}`;
  }
  
  return formattedCommit;
}

export const formatCommitsCommand = new Command("format-commits")
  .argument("<from-commit>", i18n.t("commands.formatCommits.options.fromCommit"))
  .description(i18n.t("commands.formatCommits.description"))
  .action(async (fromCommit) => {
    try {
      // Validate the commit hash exists
      try {
        await git.show([fromCommit]);
      } catch (error) {
        console.error(i18n.t("commands.formatCommits.messages.invalidCommit", fromCommit));
        return;
      }

      // Get all commits from the specified hash to HEAD
      const logResult = await git.log({ from: fromCommit, to: 'HEAD' });
      const commits = [...logResult.all].reverse(); // Reverse to process oldest first
      
      if (commits.length === 0) {
        console.log(i18n.t("commands.formatCommits.messages.noCommits"));
        return;
      }
      
      console.log(i18n.t("commands.formatCommits.messages.foundCommits", commits.length));
      
      const commitsToConvert: Array<{
        hash: string;
        oldMessage: string;
        newMessage: string;
        needsReview: boolean;
      }> = [];
      
      // Analyze each commit and suggest conversions
      for (const commit of commits) {
        const originalMessage = commit.message;
        
        // Skip if already in conventional format
        if (CONVENTIONAL_COMMIT_REGEX.test(originalMessage)) {
          console.log(i18n.t("commands.formatCommits.messages.alreadyConventional", commit.hash.substring(0, 7), originalMessage));
          continue;
        }
        
        const suggestion = suggestConventionalCommit(originalMessage);
        
        if (suggestion) {
          const newMessage = formatConventionalCommit(
            suggestion.type,
            suggestion.scope,
            suggestion.breaking,
            suggestion.message
          );
          
          commitsToConvert.push({
            hash: commit.hash,
            oldMessage: originalMessage,
            newMessage,
            needsReview: true // By default, all commits need review
          });
          
          console.log(i18n.t("commands.formatCommits.messages.suggestedChange", commit.hash.substring(0, 7), originalMessage, newMessage));
        } else {
          console.log(i18n.t("commands.formatCommits.messages.alreadyConventional", commit.hash.substring(0, 7), originalMessage));
        }
      }
      
      if (commitsToConvert.length === 0) {
        console.log(i18n.t("commands.formatCommits.messages.allConventional"));
        return;
      }
      
      // Ask for confirmation for each commit that needs review
      for (let i = 0; i < commitsToConvert.length; i++) {
        const commit = commitsToConvert[i];
        
        if (commit.needsReview) {
          console.log(i18n.t("commands.formatCommits.messages.reviewingCommit", i + 1, commitsToConvert.length));
          console.log(i18n.t("commands.formatCommits.messages.originalCommit", commit.oldMessage));
          console.log(i18n.t("commands.formatCommits.messages.suggestedCommit", commit.newMessage));
          
          const answers = await inquirer.prompt([
            {
              type: 'list',
              name: 'action',
              message: i18n.t("commands.formatCommits.prompts.commitAction"),
              choices: [
                { name: i18n.t("commands.formatCommits.prompts.acceptSuggestion"), value: 'accept' },
                { name: i18n.t("commands.formatCommits.prompts.editSuggestion"), value: 'edit' },
                { name: i18n.t("commands.formatCommits.prompts.skipCommit"), value: 'skip' }
              ]
            }
          ]);
          
          if (answers.action === 'accept') {
            commit.needsReview = false;
          } else if (answers.action === 'edit') {
            // Parse the suggested commit to pre-fill the form
            const match = commit.newMessage.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s(.+)$/);
            let type = 'chore';
            let scope = '';
            let breaking = false;
            let message = '';
            
            if (match) {
              type = match[1];
              scope = match[2] || '';
              breaking = !!match[3];
              message = match[4];
            }
            
            const typeChoices = Object.entries(COMMIT_TYPES).map(([key, value]) => ({
              name: `${key}: ${value}`,
              value: key
            }));
            
            const editAnswers = await inquirer.prompt([
              {
                type: 'list',
                name: 'type',
                message: i18n.t("commands.commit.prompts.selectType"),
                choices: typeChoices,
                default: type
              },
              {
                type: 'input',
                name: 'scope',
                message: i18n.t("commands.commit.prompts.enterScope"),
                default: scope
              },
              {
                type: 'confirm',
                name: 'breaking',
                message: i18n.t("commands.commit.prompts.isBreaking"),
                default: breaking
              },
              {
                type: 'input',
                name: 'message',
                message: i18n.t("commands.commit.prompts.shortDescription"),
                default: message,
                validate: (input: string) => {
                  if (input.trim() === '') {
                    return i18n.t("commands.commit.prompts.descriptionRequired");
                  }
                  return true;
                }
              }
            ]);
            
            commit.newMessage = formatConventionalCommit(
              editAnswers.type,
              editAnswers.scope,
              editAnswers.breaking,
              editAnswers.message
            );
            
            commit.needsReview = false;
          } else if (answers.action === 'skip') {
            commitsToConvert.splice(i, 1);
            i--; // Adjust index after removing an item
          }
        }
      }
      
      // Filter out skipped commits
      const finalCommits = commitsToConvert.filter(commit => !commit.needsReview);
      
      if (finalCommits.length === 0) {
        console.log(i18n.t("commands.formatCommits.messages.noCommitsSelected"));
        return;
      }
      
      // Show summary of changes
      console.log(i18n.t("commands.formatCommits.messages.summary"));
      for (const commit of finalCommits) {
        console.log(`${commit.hash.substring(0, 7)}: "${commit.oldMessage}" => "${commit.newMessage}"`);
      }
      
      // Final confirmation
      const confirmation = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: i18n.t("commands.formatCommits.prompts.confirmRewrite", finalCommits.length),
          default: false
        }
      ]);
      
      if (!confirmation.proceed) {
        console.log(i18n.t("commands.formatCommits.prompts.operationCancelled"));
        return;
      }
      
      // Apply changes using git filter-branch
      console.log(i18n.t("commands.formatCommits.messages.applyingChanges"));
      
      for (const commit of finalCommits) {
        try {
          // Use git filter-branch to rewrite commit messages
          // This is a simplified approach - in a real implementation, you might want to use a more robust method
          const shellSafeOldMsg = commit.oldMessage.replace(/'/g, "'\\''");
          const shellSafeNewMsg = commit.newMessage.replace(/'/g, "'\\''");
          
          await git.raw([
            'filter-branch', 
            '--force', 
            '--msg-filter', 
            `sed 's/^${shellSafeOldMsg}$/${shellSafeNewMsg}/'`,
            commit.hash + '^..HEAD'
          ]);
          
          console.log(i18n.t("commands.formatCommits.messages.updatedCommit", commit.hash.substring(0, 7)));
        } catch (error) {
          console.error(i18n.t("commands.formatCommits.messages.errorUpdating", commit.hash.substring(0, 7)), error);
        }
      }
      
      console.log(i18n.t("commands.formatCommits.messages.conversionComplete"));
      console.log(i18n.t("commands.formatCommits.messages.forcePushWarning"));
      
    } catch (error) {
      console.error(i18n.t("commands.formatCommits.messages.conversionError"), error);
    }
  }); 