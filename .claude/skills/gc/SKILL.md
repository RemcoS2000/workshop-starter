---
description: Stage all changes and commit with an auto-generated conventional-commit message (no push)
allowed-tools: Bash(git *)
disable-model-invocation: true
---

# Git Commit (Auto)

Stage everything and commit with an auto-generated conventional-commit message (no confirmation). Does not push.

## Instructions

### Step 1: Stage Everything

```bash
git add -A
```

### Step 2: Generate Commit Message

Review the final diff:

```bash
git diff --cached
```

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>[optional scope]: <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
**Scope:** Affected area (e.g., `app`, `api`, `auth`, `prisma`, `ui`). Omit for cross-cutting changes.

Focus the message on the *why*, not the *what*. Keep the subject line under 70 characters.

### Step 3: Commit (No Confirmation)

Commit directly with the generated message using a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<optional body>
EOF
)"
```

Do not ask for confirmation. Do not show the message and wait. Just commit.

If a pre-commit hook fails, fix the underlying issue, re-stage with `git add -A`, and create a **new** commit (never `--amend`). If the commit ultimately cannot be made, stop.

### Step 4: Report

After the commit succeeds, report the commit message and the branch. Do not push.
