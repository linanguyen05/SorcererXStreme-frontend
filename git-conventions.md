# Git Conventions

This document standardizes how we use Git: common commands, branching, pull requests, and the process to merge changes into `main`.

## Common Git Commands

Basic repo operations:

```powershell
# Clone
git clone <repo-url>

# Configure identity
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Status, staged changes, and logs
git status
git diff
git log --oneline --graph --decorate --all
```

Working with branches:

```powershell
# Create/switch branches (PowerShell compatible)
git switch -c feature/ABC-123-user-login
# or
git checkout -b feature/ABC-123-user-login

# List branches
git branch --all

# Switch to existing branch
git switch main
```

Committing and syncing:

```powershell
# Stage and commit
git add . ; git commit -m "ABC-123: feat(auth): add login flow"

# Amend last commit (no new commit ID)
git commit --amend

# Pull latest changes
git pull --rebase

# Push branch
git push -u origin feature/ABC-123-user-login
```

Integration helpers:

```powershell
# Merge main into your branch
git fetch origin ; git merge origin/main

# Stash and restore temporary changes
git stash ; git stash list ; git stash pop
```

Tagging releases:

```powershell
# Create and push a tag
git tag v1.2.0 ; git push origin v1.2.0
```

## Git Branching
#### For Small Tasks
- **Primary branch:** `main` (protected; no direct pushes)
- **Branch types:**
  - `feature/<ticket>-<short-name>` for new work
  - `bugfix/<ticket>-<short-name>` for non-critical fixes
  - `hotfix/<ticket>-<short-name>` for urgent production fixes
- **Naming:** use kebab-case; include a tracker ID when available (e.g., `feature/ABC-123-user-login`).

#### Big Feature (Epic) Branching
- **Base branch (for the big feature):**
   - `feature/<ticket>-<feature-name>/develop`
- **Sub-task branches (branch from the base):**
   - `feature/<ticket>-<feature-name>/<subtask-ticket>-<short-description>`
- **Flow:**
   - Create the base branch from `main` when the epic starts.
   - Open PRs from sub-task branches into the base branch; keep the base branch up-to-date with `main` via `merge`.
   - When the epic is complete, open a final PR from the base branch (`.../develop`) into `main` and squash-merge.
   - After merge, delete the base and all sub-task branches.

## Commit Conventions

Use a consistent, ticket-first message format to keep history searchable and scannable.

- **Format:** `<ticket>: <feat|refactor|fix|doc>(<feature-name>): <short-description>`
- **Ticket:** required; use your tracker key (e.g., `ABC-123`).
- **Type:** one of `feat`, `refactor`, `fix`, `doc`.
- **Scope (`feature-name`):** kebab-case module/area, e.g., `auth`, `payments-api`.
- **Short description:** imperative mood, lowercase, ≤ 72 chars, no trailing period.

Examples:

```text
ABC-123: feat(auth): add login flow
XYZ-9: fix(payments): handle null card token
ABC-456: refactor(user-profile): extract avatar uploader
ABC-789: doc(api): add user endpoints README
```

Notes:
- For big features with sub-task branches, use the sub-task ticket in commits.

## Pull Requests
- **Title format:** `ABC-123: feat(auth): add login`
- **Description:** must update evidences include context, screenshots (if UI), unit tests, what done into Trello/Jira.
- **Checks:** all CI checks must pass (lint, tests, build).
- **Reviews:** at least one approval from a code owner; resolve all comments.
- **No direct merges to `main`:** always via PR.

## Process to Merge to `main`
Use feature branches and PRs—never push directly to `main`.

1. **Sync `main` locally**
   ```powershell
   git fetch origin ; git switch main ; git pull --rebase
   ```
2. **Create a feature branch**
   ```powershell
   git switch -c feature/ABC-123-user-login
   ```
3. **Develop and commit changes**
   ```powershell
   # repeat as needed
    git add . ; git commit -m "ABC-123: feat(auth): add login flow"
    ```
   
4. **Keep your branch up to date** 
   ```powershell
   git fetch origin ; git merge origin/main
   # resolve conflicts, then:
   git push --force-with-lease
   ```
5. **Push and open a PR**
   ```powershell
   git push -u origin feature/ABC-123-user-login
   # then open PR in your Git platform
   ```
6. **Pass checks and get approvals**
   - CI green, reviewers approve.
7. **Merge strategy**
   - Use "Squash and merge" to keep `main` history clean.
8. **Post-merge cleanup**
   ```powershell
   git switch main ; git pull --rebase
   git branch -d feature/ABC-123-user-login
   # remote branch can be deleted via UI or:
   git push origin --delete feature/ABC-123-user-login
   ```