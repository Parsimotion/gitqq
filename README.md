# GitQQ (Git Quick Quick) ✨

A command-line tool to facilitate the use of Git with natural language and development best practices.

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gitqq.git
cd gitqq

# Install dependencies
npm install

# Install globally (optional)
npm install -g .
```

## 🌍 Multilingual Support

GitQQ supports multiple languages:

- 🇺🇸 English
- 🇪🇸 Spanish (Español)
- 🇵🇹 Portuguese (Português)

### Changing the Language

You can change the language using the config command:

```bash
# Show current language
gitqq config

# Change language
gitqq config language
```

The language preference is stored in a configuration file located at `~/.gitqq/config.json`.

## 🛠️ Available Commands

GitQQ provides the following commands to streamline your Git workflow:

### 📝 Semantic Commit

The `commit` command allows you to create commits following the [Conventional Commits](https://www.conventionalcommits.org/) standard, facilitating automatic changelog generation and semantic versioning.

```bash
# Interactive mode (default)
gitqq commit

# Non-interactive mode
gitqq commit -n "Commit message"
```

[Detailed commit command documentation](docs/commit.md)

### ⚙️ Configuration

The `config` command allows you to manage GitQQ settings, including language preferences and other options.

```bash
# Show current configuration
gitqq config

# Change language
gitqq config language
```

[Detailed config command documentation](docs/config.md)

### 🏁 Project Initialization

The `init-project` command quickly initializes a new Git repository with an initial commit following best practices.

```bash
gitqq init-project
```

[Detailed init-project command documentation](docs/init-project.md)

### 🔄 Commit Formatting

The `format-commits` command converts existing commits to the Conventional Commits format, standardizing your repository history.

```bash
gitqq format-commits <commit-hash>
```

> **⚠️ Note**: This command rewrites Git history. If you've already shared your repository, you'll need to force push after using this command.

[Detailed format-commits command documentation](docs/format-commits.md)

## 🎯 Benefits of Using Semantic Commits

- **📊 Automatic changelog generation**: Facilitates the creation of change documents between versions.
- **🔢 Automatic semantic versioning**: Allows automatic determination of the type of version change (major, minor, patch).
- **🗣️ Clear communication**: Clearly communicates the nature of changes to team members and users.
- **📋 Consistent structure**: Provides a consistent structure for commit history.
- **👥 Facilitates collaboration**: Makes it easier for other developers to understand the changes made.

## 👥 Contributing

Contributions are welcome! Please make sure to follow the code and commit conventions of the project.

## 📄 License

This project is licensed under the MIT license - see the LICENSE file for details. 