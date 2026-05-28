---
description: Push the current branch and open a GitHub pull request
allowed-tools: Bash(git *), Bash(gh *)
disable-model-invocation: true
---

# Open Pull Request

Push the current branch and open a GitHub pull request following this repo's PR conventions.

## Conventions (must follow)

A PR body in this repo contains **only** a short Summary section explaining the why. It must not contain:

- A "Generated with [Claude Code]" footer
- A "## Test plan" section
- A list of changed files (e.g. "## Changes" or "## Changed files")

Commit messages must not include the word `Claude`, `Generated with [Claude Code]`, or any `Co-Authored-By:` trailer. The diff itself shows what changed; the PR description explains why.

## Instructions

### Step 1: Confirm there's something to open

```bash
git status -s
git log --oneline @{upstream}..HEAD 2>/dev/null || git log --oneline origin/main..HEAD
```

- If the working tree has uncommitted changes, stop and tell the user to commit (or invoke `/gc` / `/gcp`) first.
- If there are zero commits ahead of the base, stop and tell the user there's nothing to PR.

### Step 2: Check the branch is pushed

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null
```

- If an upstream exists, `git push` to sync.
- If no upstream, `git push -u origin HEAD`.

### Step 3: Check if a PR already exists

```bash
gh pr list --head "$(git branch --show-current)" --json url,state --limit 1
```

- If the result is a non-empty array, a PR already exists for this branch. Print its URL and stop. Do not generate a new title/body, do not call `gh pr create`.
- If the result is `[]`, continue to the next step.

### Step 4: Generate title and body

**Title:** Conventional Commits format, under 70 characters. Take the lead from the branch name and the most recent commit subject.

```
<type>(<scope>): <subject>
```

**Body:** A single `## Summary` section explaining the why behind the change in 1-3 sentences. No headers besides Summary. No bullet lists of files. No test plan. No AI attribution.

Example:

```markdown
## Summary

Adds CSV upload at /api/meters so the dashboard can render historical P1 readings without requiring users to wire up the meter manually.
```

If the change has multiple distinct motivations, use 2-3 short bullets under Summary. Still no other sections.

### Step 5: Open the PR

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary

<summary content>
EOF
)"
```

### Step 6: Report

Print the PR URL. Done.

## What this command does NOT do

- It does not run lint/typecheck/tests. Use `/gc` or `/gcp` before `/pr` if checks are needed.
- It does not commit. Staging and committing happen separately so the user controls the boundary.
