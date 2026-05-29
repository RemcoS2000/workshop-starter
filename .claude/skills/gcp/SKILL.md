---
description: Stage, commit with an auto-generated message, then push to the remote
allowed-tools: Bash(git *)
disable-model-invocation: true
---

# Git Commit & Push (Auto)

Stage only the intended changes, commit with an auto-generated message (no confirmation), then push to the remote.

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

If a pre-commit hook fails, fix the underlying issue, re-stage intentionally, and create a **new** commit (never `--amend`). If the commit ultimately cannot be made, stop. Do not push.

### Step 5: Push

Detect the current branch:

```bash
git branch --show-current
```

**If on `main`:** pull with rebase first, then push:

```bash
git pull --rebase origin main && git push
```

**If on a feature branch:**

```bash
git push
```

If the branch has no upstream yet, use `git push -u origin HEAD` to set it on the first push.

### Step 6: Handle Push Rejections

If the remote rejects the push because it has new commits, stop and ask the user how to proceed (rebase or merge). **Never force push without explicit user permission.** If a force push is clearly needed (e.g., after a rebase the user performed earlier), explain why and ask before running `git push --force-with-lease`.

If a rebase produces conflicts:

1. `git status` to see conflicted files
2. Resolve each one
3. `git add <file>` the fixes
4. `git rebase --continue`
5. Repeat until clean, then push

### Step 7: Report

After the push succeeds, report the commit message, the branch, and the remote tracking ref (e.g. `origin/feat/foo`).
