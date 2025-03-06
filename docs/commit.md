# Commit Command Documentation

The `commit` command in Git Smart CLI allows you to create commits following the [Conventional Commits](https://www.conventionalcommits.org/) conventions, facilitating automatic changelog generation and semantic versioning.

## Semantic Commit Convention

The Conventional Commits convention is a specification for adding meaning to commit messages through a simple structure. This convention integrates with [SemVer (Semantic Versioning)](https://semver.org/), describing features, fixes, and breaking changes made in commit messages.

### Structure

```
<type>(<scope>)!: <description>

<body>

<footer>
```

### Components

- **type**: Required. Indicates the nature of the change:
  - `feat`: New features
  - `fix`: Bug fixes
  - `docs`: Documentation changes
  - `style`: Changes that do not affect the meaning of the code (whitespace, formatting, etc.)
  - `refactor`: Code changes that neither fix bugs nor add features
  - `perf`: Performance improvements
  - `test`: Adding or correcting tests
  - `build`: Changes that affect the build system or external dependencies
  - `ci`: Changes to CI configuration and scripts
  - `chore`: Other changes that don't modify src or test files
  - `revert`: Reverts a previous commit

- **scope**: Optional. Provides additional contextual information, such as the module, component, or part of the code affected.

- **!**: Optional. Indicates that the commit contains breaking changes.

- **description**: Required. Brief description of the change in present tense.

- **body**: Optional. Provides more detailed information about the changes made.

- **footer**: Optional. Contains information about breaking changes and issue references.

## Command Options

| Option | Alias | Description | Default Value |
|--------|-------|-------------|---------------|
| `--type` | `-t` | Semantic commit type | `feat` |
| `--scope` | `-s` | Scope of the change | - |
| `--breaking` | `-b` | Indicates a breaking change | `false` |
| `--description` | `-d` | Detailed description of the commit | - |
| `--full-message` | `-m` | Complete commit message (overrides other options) | - |
| `--non-interactive` | `-n` | Use non-interactive mode (skip prompts) | `false` |

## Usage Examples

### Interactive Mode (Default)

By default, the commit command runs in interactive mode, guiding you through the commit creation process:

```bash
# Start interactive commit process
git-smart commit

# Start interactive commit with a default message
git-smart commit "Initial commit message"
```

The interactive mode guides you through the commit creation process with a series of prompts:

1. **Type Selection**: Choose from a list of valid commit types
2. **Scope Entry**: Enter the scope of the change (optional)
3. **Breaking Change**: Confirm if this is a breaking change
4. **Description**: Enter a short description of the change
5. **Detailed Description**: Provide a longer description (optional)

This mode is particularly helpful for:
- Users who are new to Conventional Commits
- Complex commits that require careful consideration of each component
- Teams that want to ensure consistent commit messages

### Non-Interactive Mode

If you prefer to use the command without prompts, you can use the `-n` or `--non-interactive` flag:

```bash
# Basic non-interactive commit
git-smart commit -n "Add user authentication"
# Result: "feat: Add user authentication"
```

### Bug Fix Commit (Non-Interactive)

```bash
git-smart commit -n -t fix "Fix login form error"
# Result: "fix: Fix login form error"
```

### Commit with Scope (Non-Interactive)

```bash
git-smart commit -n -t feat -s auth "Implement Google login"
# Result: "feat(auth): Implement Google login"
```

### Commit with Breaking Change (Non-Interactive)

```bash
git-smart commit -n -t feat -s api -b "Change response structure"
# Result: "feat(api)!: Change response structure

# BREAKING CHANGE: This change breaks compatibility with previous versions."
```

### Commit with Detailed Description (Non-Interactive)

```bash
git-smart commit -n -t docs -d "Update all API documentation including new endpoints and usage examples" "Update API documentation"
# Result: "docs: Update API documentation

# Update all API documentation including new endpoints and usage examples"
```

### Commit with Custom Complete Message

The `-m` or `--full-message` option allows you to specify a complete commit message, bypassing all other options and the interactive mode:

```bash
git-smart commit -m "feat(auth)!: implement Google authentication

This implementation adds support for authentication using Google accounts.
Includes new endpoints and authentication flow updates.

BREAKING CHANGE: This implementation is not compatible with the previous authentication flow."
```

## Benefits of Semantic Commits

1. **Automatic Changelog Generation**: The standardized structure facilitates automatic generation of change documents.

2. **Automatic Version Determination**: Following SemVer, commit types can automatically determine version increments:
   - `fix`: increments the PATCH version (1.0.0 → 1.0.1)
   - `feat`: increments the MINOR version (1.0.0 → 1.1.0)
   - `feat!`, `fix!`, etc. (with breaking change): increments the MAJOR version (1.0.0 → 2.0.0)

3. **Clear Communication**: Provides immediate context about the nature of changes.

4. **Better Collaboration**: Facilitates understanding of the change history for all team members.

5. **Tool Integration**: Compatible with tools such as semantic-release, standard-version, etc.

## Best Practices

- Keep the first line (type + scope + description) under 72 characters.
- Use the imperative present tense in the description ("add" instead of "added").
- Describe the "what" and "why" in the commit body, not the "how".
- Be specific and concise in your messages.
- Use consistent scope to facilitate tracking changes in specific components.
- For complex commits, use the interactive mode to ensure all components are properly considered. 