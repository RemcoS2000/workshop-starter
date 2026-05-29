---
description: Stage intended changes and commit with an auto-generated conventional-commit message (no push)
allowed-tools: Bash(git *)
disable-model-invocation: true
---

# Git Commit (Auto)

Stage only the intended changes and commit with an auto-generated conventional-commit message (no confirmation). Does not push.

## Instructions

### Step 1: Inspect the working tree

```bash
git status --short
```

### Step 2: Decide what to commit

- If there are already staged changes, use that staged set as the commit scope. Do not auto-stage additional files.
- If nothing is staged, inspect the modified files and stage only the files that clearly belong to the current task.
- If the working tree contains unrelated changes and the intended commit boundary is ambiguous, stop and ask the user instead of staging everything.

Stage files intentionally with targeted `git add <path>` commands. Never use `git add -A` or `git add .` in this skill.

After staging, review the final staged diff:

```bash
git diff --cached
```

If the staged diff is empty, stop and report that there is nothing to commit.

### Step 3: Generate Commit Message

Review the staged diff.

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>[optional scope]: <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
**Scope:** Affected area (e.g., `app`, `api`, `auth`, `prisma`, `ui`). Omit for cross-cutting changes.

Focus the message on the *why*, not the *what*. Keep the subject line under 70 characters.

### Step 4: Commit (No Confirmation)

Commit directly with the generated message using a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<optional body>
EOF
)"
```

Do not ask for confirmation. Do not show the message and wait. Just commit.

If a pre-commit hook fails, re-stage intentionally. Do not fall back to `git add -A`.

### Step 5: Report

After the commit succeeds, report the commit message and the branch. Do not push.
