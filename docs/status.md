# Status Command Documentation

The `status` command in GitQQ provides a clear and detailed view of your repository's current state, making it easy to understand what changes are staged, modified, or untracked.

## Overview

The status command shows:

1. **Staged changes** (will be committed)
   - Modified files
   - New files
   - Deleted files
   - Renamed files

2. **Unstaged changes** (will NOT be committed)
   - Modified files (not staged)
   - Deleted files (not staged)
   - Untracked files

3. **Branch information**
   - Current branch name
   - Relationship with remote (ahead/behind)

4. **Summary**
   - Count of changes to be committed
   - Count of changes not staged for commit

## Usage

```bash
# Show repository status (default command)
gitqq

# Explicitly call status command
gitqq status
```

## Visual Indicators

The status command uses visual indicators to help you quickly understand the state of your repository:

- 🟢 **Green**: Staged changes that will be included in the next commit
- 🟠 **Orange**: Modified or deleted files that are not staged for commit
- 🔵 **Blue**: Untracked files
- ⚠️ **Warning**: Conflicted files that need resolution
- 📤 **Outgoing**: Your branch is ahead of the remote
- 📥 **Incoming**: Your branch is behind the remote

## Examples

### Clean Repository

```
📊 Repository Status:
✨ Working tree clean. No changes to commit.
🌿 Current branch: main
```

### Repository with Changes

```
📊 Repository Status:
🟢 Staged changes (will be committed):
  - src/index.js
🟠 Modified files (changes not staged for commit):
  - README.md
🔵 Untracked files (not included in commit):
  - newfile.txt
📋 Summary: 1 changes to commit, 2 changes not staged for commit.
🌿 Current branch: feature/new-feature
📤 Your branch is ahead of the remote by 2 commit(s)
```

### Repository with Conflicts

```
📊 Repository Status:
⚠️ Conflicted files (resolve before committing):
  - src/config.js
🌿 Current branch: develop
```

## Benefits

1. **Clear visualization**: Easily see what changes will be included in your next commit
2. **Categorized changes**: Understand the different types of changes in your repository
3. **Branch status**: Know if you need to push or pull changes
4. **Default command**: Quick access by simply typing `gitqq`

## Related Commands

- [`commit`](commit.md): Create a commit with your staged changes
- [`init-project`](init-project.md): Initialize a new Git repository 