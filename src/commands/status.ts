import simpleGit from "simple-git";
import { Command } from "commander";
import { i18n } from "../i18n";

const git = simpleGit();

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
    hasStagedChanges: status.staged.length > 0,
    hasUnstagedChanges: status.not_added.length > 0 || status.modified.length > 0,
    isClean: status.isClean(),
    ahead: status.ahead,
    behind: status.behind,
    files: status.files || [],
    current: status.current
  };
}

/**
 * Displays a summary of the repository status
 * @param status Repository status object
 */
function displayStatusSummary(status: any) {
  console.log(i18n.t("commands.status.messages.repoStatus"));
  
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
  
  // 6. Branch information
  console.log(i18n.t("commands.status.messages.branchInfo", status.current));
  
  if (status.ahead > 0 || status.behind > 0) {
    if (status.ahead > 0 && status.behind > 0) {
      console.log(i18n.t("commands.status.messages.aheadBehind", status.ahead, status.behind));
    } else if (status.ahead > 0) {
      console.log(i18n.t("commands.status.messages.ahead", status.ahead));
    } else if (status.behind > 0) {
      console.log(i18n.t("commands.status.messages.behind", status.behind));
    }
  }
  
  // 7. Clean repository message
  if (status.isClean) {
    console.log(i18n.t("commands.status.messages.cleanRepo"));
  }
}

export const statusCommand = new Command("status")
  .description(i18n.t("commands.status.description"))
  .action(async () => {
    try {
      const status = await checkRepositoryStatus();
      displayStatusSummary(status);
    } catch (error) {
      console.error(i18n.t("commands.status.errors.checkStatus"), error);
    }
  }); 