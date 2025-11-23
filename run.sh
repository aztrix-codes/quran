#!/bin/bash

# ===================================================================
# run.sh — Ultimate React Native Runner (Bash Version)
# ===================================================================

# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ——————————————————————————————————————————————————————————————————
# HELPERS
# ——————————————————————————————————————————————————————————————————

log_green() { echo -e "${GREEN}$1${NC}"; }
log_cyan() { echo -e "${CYAN}$1${NC}"; }
log_red() { echo -e "${RED}$1${NC}"; }
log_yellow() { echo -e "${YELLOW}$1${NC}"; }
log_magenta() { echo -e "${MAGENTA}$1${NC}"; }

invoke_gradle() {
    cd android || return
    # Use ./gradlew if executable, otherwise try standard gradle
    if [ -x "./gradlew" ]; then
        ./gradlew "$1"
    else
        chmod +x ./gradlew
        ./gradlew "$1"
    fi
    
    if [ $? -ne 0 ]; then
        log_red "Gradle task '$1' failed."
        cd ..
        exit 1
    fi
    cd ..
}

get_package_name() {
    if [ -f "android/app/build.gradle" ]; then
        # Extracts text between quotes in applicationId "com.example"
        grep "applicationId" android/app/build.gradle | awk -F'["\047]' '{print $2}' | head -n 1
    fi
}

move_build_artifact() {
    TYPE=$1
    RELEASE_DIR="$(pwd)/AppReleases"
    mkdir -p "$RELEASE_DIR"

    if [ "$TYPE" == "APK" ]; then
        SOURCE="android/app/build/outputs/apk/release/app-release.apk"
        DEST="$RELEASE_DIR/app-release.apk"
        if [ -f "$SOURCE" ]; then
            cp "$SOURCE" "$DEST"
            log_cyan "APK moved to: $DEST"
        fi
    elif [ "$TYPE" == "AAB" ]; then
        SOURCE="android/app/build/outputs/bundle/release/app-release.aab"
        DEST="$RELEASE_DIR/app-release.aab"
        if [ -f "$SOURCE" ]; then
            cp "$SOURCE" "$DEST"
            log_cyan "AAB moved to: $DEST"
        fi
    fi
}

# ——————————————————————————————————————————————————————————————————
# CORE COMMANDS
# ——————————————————————————————————————————————————————————————————

run_app() {
    log_green "\n🚀 Launching App (Debug)..."
    invoke_gradle "installDebug"
    
    PACKAGE=$(get_package_name)
    if [ -n "$PACKAGE" ]; then
        log_green "📱 Starting app: $PACKAGE"
        adb shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
    fi

    adb reverse tcp:8081 tcp:8081
    
    log_magenta "\n⚛️  Metro starting..."
    npx react-native start --reset-cache
}

clean() {
    log_yellow "🧹 Cleaning build folder..."
    invoke_gradle "clean"
    log_green "Done."
}

rebuild() {
    log_magenta "\n🔄 Rebuilding..."
    clean
    run_app
}

apk() {
    log_green "📦 Building Release APK..."
    invoke_gradle "assembleRelease"
    move_build_artifact "APK"
}

aab() {
    log_green "📦 Building Release AAB..."
    invoke_gradle "bundleRelease"
    move_build_artifact "AAB"
}

app() {
    log_green "\n📦 Building Full Release (APK + AAB)..."
    invoke_gradle "assembleRelease"
    move_build_artifact "APK"
    invoke_gradle "bundleRelease"
    move_build_artifact "AAB"
    
    # Open Explorer/Finder
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open AppReleases
    else
        xdg-open AppReleases 2>/dev/null || log_yellow "Artifacts in AppReleases/"
    fi
}

# ——————————————————————————————————————————————————————————————————
# MAINTENANCE & CLEANUP
# ——————————————————————————————————————————————————————————————————

deps() { log_cyan "🔎 Checking dependencies..."; npx depcheck; }
unused() { log_cyan "🔎 Checking unused files..."; npx unimported; }

kill_port() {
    log_red "🛑 Killing port 8081..."
    lsof -ti:8081 | xargs kill -9 2>/dev/null
    log_green "Ports cleared."
}

clear_cache() {
    log_red "🔥 NUKING CACHE..."
    rm -rf "$TMPDIR/metro-*" 2>/dev/null
    watchman watch-del-all 2>/dev/null
    invoke_gradle "clean"
    log_green "Cache cleared."
}

# ——————————————————————————————————————————————————————————————————
# DEVICE CONTROL
# ——————————————————————————————————————————————————————————————————

reverse() { adb reverse tcp:8081 tcp:8081; log_green "Ports reversed."; }
shake() { adb shell input keyevent 82; log_cyan "Shook device."; }
reload() { adb shell input text "RR"; log_cyan "Reloading JS..."; }
d() { adb devices; }

# ——————————————————————————————————————————————————————————————————
# UTILITIES
# ——————————————————————————————————————————————————————————————————

s() { npx react-native start --reset-cache; }
doctor() { npx react-native doctor; }
test_cmd() { npx jest; }
lint() { npx eslint . --fix; }
i() { npm install --force; }
ip_addr() {
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
}

v_u() {
    TEMP_JS="/tmp/universal_version_up.js"
    cat << 'EOF' > "$TEMP_JS"
const fs = require('fs');
const path = require('path');
const rootDir = process.cwd(); 
const packageJsonPath = path.join(rootDir, 'package.json');
const gradlePath = path.join(rootDir, 'android/app/build.gradle');
const iosDir = path.join(rootDir, 'ios');

function getIosProjectName() {
  if (!fs.existsSync(iosDir)) return null;
  const files = fs.readdirSync(iosDir);
  const projFile = files.find(file => file.endsWith('.xcodeproj'));
  return projFile ? projFile.replace('.xcodeproj', '') : null;
}
const IOS_PROJECT_NAME = getIosProjectName();
const plistPath = IOS_PROJECT_NAME ? path.join(rootDir, `ios/${IOS_PROJECT_NAME}/Info.plist`) : null;

function log(m) { console.log(`\x1b[32m${m}\x1b[0m`); }
function logInfo(m) { console.log(`\x1b[36m${m}\x1b[0m`); }
function exitWithError(m) { console.error(`\x1b[31mERROR: ${m}\x1b[0m`); process.exit(1); }

function compareVersions(v1, v2) {
  const p1 = v1.split('.').map(Number), p2 = v2.split('.').map(Number);
  const len = Math.max(p1.length, p2.length);
  for (let i = 0; i < len; i++) {
    if ((p1[i]||0) > (p2[i]||0)) return 1;
    if ((p1[i]||0) < (p2[i]||0)) return -1;
  }
  return 0;
}

try {
  logInfo('Starting universal version bump...');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const pkgVersion = pkg.version;

  let gradleContent = fs.readFileSync(gradlePath, 'utf8');
  const gradleVersionMatch = gradleContent.match(/versionName "([\d\.]+)"/);
  if (!gradleVersionMatch) exitWithError('No versionName in build.gradle');
  const gradleVersion = gradleVersionMatch[1];

  const versionCodeMatch = gradleContent.match(/versionCode (\d+)/);
  if (!versionCodeMatch) exitWithError('No versionCode in build.gradle');
  const currentVersionCode = parseInt(versionCodeMatch[1]);

  log(`  - Pkg: ${pkgVersion} | Android: ${gradleVersion} (${currentVersionCode})`);

  let masterVersion = pkgVersion;
  if (compareVersions(gradleVersion, pkgVersion) > 0) {
    masterVersion = gradleVersion;
    logInfo(`Syncing to higher Android version (${gradleVersion})`);
  }

  const versionParts = masterVersion.split('.').map(Number);
  while (versionParts.length < 3) versionParts.push(0);
  versionParts[2] += 1;
  const newVersion = versionParts.join('.');
  const newVersionCode = currentVersionCode + 1;

  log(`New Version: ${newVersion} (Build: ${newVersionCode})`);

  pkg.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

  gradleContent = gradleContent.replace(/versionCode \d+/, `versionCode ${newVersionCode}`)
                               .replace(/versionName "[\d\.]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(gradlePath, gradleContent);

  if (plistPath && fs.existsSync(plistPath)) {
    log(`  - Updating iOS Info.plist (${IOS_PROJECT_NAME})...`);
    let plistContent = fs.readFileSync(plistPath, 'utf8');
    plistContent = plistContent.replace(/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${newVersion}$2`)
                               .replace(/(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${newVersionCode}$2`);
    fs.writeFileSync(plistPath, plistContent);
  }
  log('\nVersioning complete!');
} catch (e) { exitWithError(e.message); }
EOF
    node "$TEMP_JS"
    rm "$TEMP_JS"
}

# ——————————————————————————————————————————————————————————————————
# GIT COMMANDS
# ——————————————————————————————————————————————————————————————————

add_git() { git add .; log_cyan "Git: Added."; }
push_git() { git push; log_green "Git: Pushed."; }
pull_git() { git pull; log_green "Git: Pulled."; }
status() { git status; }
log_git() { git log --oneline --graph --all; }

commit() {
    if [ -z "$1" ]; then log_red "Missing message."; return; fi
    git commit -m "$1"
}

acp() {
    MSG=${1:-"update"}
    git add .
    git commit -m "$MSG"
    git push
    log_green "ACP Complete: $MSG"
}

undo() {
    git reset --soft HEAD~1
    log_yellow "Undid last commit (Changes are staged)."
}

nuke() {
    read -p "Destroy all local changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git reset --hard HEAD
        git clean -fd
        log_red "NUKED. Reset to HEAD."
    fi
}

stash() { git stash; log_cyan "Stashed changes."; }
pop() { git stash pop; log_green "Stash popped."; }
new_branch() { git checkout -b "$1"; }
checkout() { git checkout "$1"; }
merge() { git merge "$1"; }

# ——————————————————————————————————————————————————————————————————
# COMMAND DISPATCHER
# ——————————————————————————————————————————————————————————————————

CMD=$1
shift

case "$CMD" in
    run) run_app ;;
    clean) clean ;;
    rebuild) rebuild ;;
    apk) apk ;;
    aab) aab ;;
    app) app ;;
    deps) deps ;;
    unused) unused ;;
    kill-port) kill_port ;;
    clear-cache) clear_cache ;;
    reverse) reverse ;;
    shake) shake ;;
    reload) reload ;;
    d) d ;;
    s) s ;;
    doctor) doctor ;;
    test) test_cmd ;;
    lint) lint ;;
    i) i ;;
    ip) ip_addr ;;
    v-u) v_u ;;
    add) add_git ;;
    push) push_git ;;
    pull) pull_git ;;
    status) status ;;
    log) log_git ;;
    commit) commit "$*" ;;
    acp) acp "$*" ;;
    undo) undo ;;
    nuke) nuke ;;
    stash) stash ;;
    pop) pop ;;
    new-branch) new_branch "$1" ;;
    checkout) checkout "$1" ;;
    merge) merge "$1" ;;
    *)
        echo "Usage: ./run.sh [command]"
        echo "Ex: ./run.sh run | ./run.sh app | ./run.sh acp 'message'"
        ;;
esac