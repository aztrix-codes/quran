# run.ps1
# Project-specific aliases for React Native scripts and Git commands in package.json

# --- Development (npm scripts) ---
function start {
    npm run start
}

function android {
    npm run android
}

# --- Cleaning (npm scripts) ---
function android-clean {
    npm run android:clean
}

# --- Rebuilding (npm scripts) ---
function android-rebuild {
    npm run android:rebuild
}

# --- Build for Release (npm scripts) ---
function build-apk {
    npm run build:apk
}

function build-aab {
    npm run build:aab
}

function build-app {
    npm run build:app
}

# --- Versioning (npm scripts) ---
function version-up {
    npm run version:up
}

# --- Utilities (npm scripts) ---
function doctor {
    npm run doctor
}

function lint {
    npm run lint
}

function test {
    npm run test
}

function clear-cache {
    npm run clear:cache
}

# --- ADB (Android Debug Bridge, npm scripts) ---
function adb-devices {
    npm run adb:devices
}

function adb-reverse {
    npm run adb:reverse
}

function adb-shake {
    npm run adb:shake
}

function adb-reload {
    npm run adb:reload
}

function unwanted {
    npm run unwanted
}

# --- Git Commands ---
function add {
    git add .
    Write-Host "Added all changes to Git staging."
}

function commit {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message
    )
    git commit -m $Message
    Write-Host "Committed with message: '$Message'"
}

function push {
    git push
    Write-Host "Pushed changes to remote repository."
}

function acp {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message
    )
    
    try {
        git add .
        Write-Host "Added all changes to Git staging."

        git commit -m $Message
        Write-Host "Committed with message: '$Message'"

        git push
        Write-Host "Pushed changes to remote repository."
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

function new-branch {
    param (
        [Parameter(Mandatory=$true)]
        [string]$BranchName
    )
    git checkout -b $BranchName
    Write-Host "Created and switched to new branch: '$BranchName'"
}

function checkout {
    param (
        [Parameter(Mandatory=$true)]
        [string]$BranchName
    )
    git checkout $BranchName
    Write-Host "Switched to branch: '$BranchName'"
}

function pull {
    git pull
    Write-Host "Pulled changes from remote repository."
}

function merge {
    param (
        [Parameter(Mandatory=$true)]
        [string]$BranchName
    )
    git merge $BranchName
    Write-Host "Merged branch '$BranchName' into current branch."
}

function hard-reset {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Target = "HEAD"
    )
    git reset --hard $Target
    Write-Host "Performed hard reset to $Target. All changes discarded."
}

function soft-reset {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Target = "HEAD"
    )
    git reset --soft $Target
    Write-Host "Performed soft reset to $Target. Changes kept in staging."
}

function status {
    git status
    Write-Host "Displayed current Git repository status."
}

function log {
    git log --oneline --graph --all
    Write-Host "Displayed Git commit history."
}

function stash {
    git stash
    Write-Host "Stashed current changes."
}

function stash-pop {
    git stash pop
    Write-Host "Applied and removed stashed changes."
}

function branch {
    git branch
    Write-Host "Listed all branches."
}

Write-Host "Project-specific aliases loaded. Available commands:"
Write-Host "npm scripts: start, android, android-clean, android-rebuild, build-apk, build-aab, build-app, version-up, doctor, lint, test, clear-cache, adb-devices, adb-reverse, adb-shake, adb-reload, unwanted"
Write-Host "Git commands: add, commit <message>, push, new-branch <branch-name>, checkout <branch-name>, pull, merge <branch-name>, hard-reset [target], soft-reset [target], status, log, stash, stash-pop, branch, acp"