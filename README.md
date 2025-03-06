# Git Smart CLI

A command-line tool to facilitate the use of Git with natural language and development best practices.

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/git-smart-cli.git
cd git-smart-cli

# Install dependencies
npm install

# Install globally (optional)
npm install -g .
```

## Available Commands

### Semantic Commit

The `commit` command allows you to create commits following the [Conventional Commits](https://www.conventionalcommits.org/) conventions, which facilitates automatic changelog generation and semantic versioning.

#### Semantic Commit Structure

```
<type>(<scope>)!: <description>

<body>

<footer>
```

Where:
- **type**: Indicates the type of change (feat, fix, docs, etc.)
- **scope**: (Optional) Indicates the section of code affected
- **!**: (Optional) Indicates a breaking change
- **description**: Brief description of the change
- **body**: (Optional) Detailed description of the change
- **footer**: (Optional) Additional information such as breaking changes or closed issues

#### Basic Usage

By default, the commit command runs in interactive mode, guiding you through the commit creation process:

```bash
# Basic form - will start interactive prompts
git-smart commit

# With a default message - will start interactive prompts with pre-filled message
git-smart commit "Initial message"
```

#### Non-Interactive Mode

If you prefer to use the command without prompts, you can use the `-n` or `--non-interactive` flag:

```bash
# Non-interactive mode with basic message
git-smart commit -n "Commit message"

# Specifying the type (default is "feat")
git-smart commit -n -t fix "Fixes authentication error"

# With scope
git-smart commit -n -t feat -s auth "Add Google authentication"

# With breaking change
git-smart commit -n -t feat -s api -b "Change API response structure"

# With detailed description
git-smart commit -n -t docs -d "Updates complete project documentation" "Update README"

# Custom complete message (always non-interactive)
git-smart commit -m "feat(auth)!: implement Google authentication

Detailed description of the change.

BREAKING CHANGE: This implementation is not compatible with previous versions."
```

#### Interactive Mode

The interactive mode (default) guides you through the commit creation process by prompting for each parameter:

1. Select the type of change from a list
2. Enter the scope of the change (optional)
3. Indicate if it's a breaking change
4. Write a short description
5. Provide a longer description (optional)

This mode is particularly helpful for users who are new to Conventional Commits or prefer a guided approach.

#### Available Commit Types

| Type | Description |
|------|-------------|
| feat | New features |
| fix | Bug fixes |
| docs | Documentation changes |
| style | Changes that do not affect the meaning of the code |
| refactor | Code changes that neither fix bugs nor add features |
| perf | Performance improvements |
| test | Adding or correcting tests |
| build | Changes that affect the build system or external dependencies |
| ci | Changes to CI configuration and scripts |
| chore | Other changes that don't modify src or test files |
| revert | Reverts a previous commit |

## Benefits of Using Semantic Commits

- **Automatic changelog generation**: Facilitates the creation of change documents between versions.
- **Automatic semantic versioning**: Allows automatic determination of the type of version change (major, minor, patch).
- **Clear communication**: Clearly communicates the nature of changes to team members and users.
- **Consistent structure**: Provides a consistent structure for commit history.
- **Facilitates collaboration**: Makes it easier for other developers to understand the changes made.

## Contributing

Contributions are welcome. Please make sure to follow the code and commit conventions of the project.

## License

This project is licensed under the ISC license - see the LICENSE file for details. 