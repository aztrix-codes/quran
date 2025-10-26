#!/bin/bash
# run.sh
# Project-specific aliases for React Native scripts and Git commands in package.json

# --- Development (npm scripts) ---
alias start='npm run start'
alias android='npm run android'
alias ios='npm run ios'

# --- Cleaning (npm scripts) ---
alias android-clean='npm run android:clean'
alias ios-clean='npm run ios:clean'

# --- Rebuilding (npm scripts) ---
alias android-rebuild='npm run android:rebuild'
alias ios-rebuild='npm run ios:rebuild'

# --- Build for Release (npm scripts) ---
alias build-apk='npm run build:apk'
alias build-aab='npm run build:aab'
alias build-app='npm run build:app'

# --- Versioning (npm scripts) ---
alias version-up='npm run version:up'

# --- Pod Management (iOS, npm scripts) ---
alias pod-install='npm run pod:install'
alias pod-update='npm run pod:update'
alias pod-reinstall='npm run pod:reinstall'

# --- Utilities (npm scripts) ---
alias doctor='npm run doctor'
alias lint='npm run lint'
alias test='npm run test'
alias clear-cache='npm run clear:cache'

# --- ADB (Android Debug Bridge, npm scripts) ---
alias adb-devices='npm run adb:devices'
alias adb-reverse='npm run adb:reverse'
alias adb-shake='npm run adb:shake'
alias adb-reload='npm run adb:reload'
alias unwanted='npm run unwanted'

# --- Git Commands ---
alias add='git add .; echo "Added all changes to Git staging."'

commit() {
    if [ -z "$1" ]; then
        echo "Error: Commit message is required. Usage: commit \"message\""
        return 1
    fi
    git commit -m "$1"
    echo "Committed with message: '$1'"
}

alias push='git push; echo "Pushed changes to remote repository."'

new-branch() {
    if [ -z "$1" ]; then
        echo "Error: Branch name is required. Usage: new-branch branch-name"
        return 1
    fi
    git checkout -b "$1"
    echo "Created and switched to new branch: '$1'"
}

checkout() {
    if [ -z "$1" ]; then
        echo "Error: Branch name is required. Usage: checkout branch-name"
        return 1
    fi
    git checkout "$1"
    echo "Switched to branch: '$1'"
}

alias pull='git pull; echo "Pulled changes from remote repository."'

merge() {
    if [ -z "$1" ]; then
        echo "Error: Branch name is required. Usage: merge branch-name"
        return 1
    fi
    git merge "$1"
    echo "Merged branch '$1' into current branch."
}

hard-reset() {
    local target=${1:-HEAD}
    git reset --hard "$target"
    echo "Performed hard reset to $target. All changes discarded."
}

soft-reset() {
    local target=${1:-HEAD}
    git reset --soft "$target"
    echo "Performed soft reset to $target. Changes kept in staging."
}

alias status='git status; echo "Displayed current Git repository status."'
alias log='git log --oneline --graph --all; echo "Displayed Git commit history."'
alias stash='git stash; echo "Stashed current changes."'
alias stash-pop='git stash pop; echo "Applied and removed stashed changes."'
alias branch='git branch; echo "Listed all branches."'

echo "Project-specific aliases loaded. Available commands:"
echo "npm scripts: start, android, ios, android-clean, ios-clean, android-rebuild, ios-rebuild, build-apk, build-aab, build-app, version-up, pod-install, pod-update, pod-reinstall, doctor, lint, test, clear-cache, adb-devices, adb-reverse, adb-shake, adb-reload, unwanted"
echo "Git commands: add, commit \"message\", push, new-branch branch-name, checkout branch-name, pull, merge branch-name, hard-reset [target], soft-reset [target], status, log, stash, stash-pop, branch"