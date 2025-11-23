# ===================================================================
# run.ps1 — Ultimate React Native Runner (Fixed)
# ===================================================================

# ——————————————————————————————————————————————————————————————————
# CORE & BUILD
# ——————————————————————————————————————————————————————————————————

function Invoke-Gradle {
    param([string]$Task)
    Push-Location "$PSScriptRoot\android"
    try {
        & ".\gradlew.bat" $Task
        if ($LASTEXITCODE -ne 0) { throw "Gradle task '$Task' failed." }
    } finally {
        Pop-Location
    }
}

function Get-PackageName {
    $gradleFile = "$PSScriptRoot\android\app\build.gradle"
    if (Test-Path $gradleFile) {
        $content = Get-Content $gradleFile -Raw
        if ($content -match 'applicationId\s*["'']([^"'']+)["'']') { return $matches[1] }
    }
    return $null
}

function Move-Build-Artifact {
    param([string]$Type)
    $releaseDir = "$PSScriptRoot\AppReleases"
    if (-not (Test-Path $releaseDir)) { New-Item -ItemType Directory -Path $releaseDir | Out-Null }
    
    if ($Type -eq "APK") {
        $source = "$PSScriptRoot\android\app\build\outputs\apk\release\app-release.apk"
        $dest = "$releaseDir\app-release.apk"
        if (Test-Path $source) { Copy-Item -Path $source -Destination $dest -Force; Write-Host "APK moved to: $dest" -ForegroundColor Cyan }
    } elseif ($Type -eq "AAB") {
        $source = "$PSScriptRoot\android\app\build\outputs\bundle\release\app-release.aab"
        $dest = "$releaseDir\app-release.aab"
        if (Test-Path $source) { Copy-Item -Path $source -Destination $dest -Force; Write-Host "AAB moved to: $dest" -ForegroundColor Cyan }
    }
}

function run {
    $task = "installDebug"
    Write-Host "`nLaunching App (Debug)..." -ForegroundColor Green
    try { Invoke-Gradle $task }
    catch { Write-Host "Install failed: $_" -ForegroundColor Red; return }

    $package = Get-PackageName
    if ($package) {
        Write-Host "Starting app: $package" -ForegroundColor Green
        adb shell "monkey -p '$package' -c android.intent.category.LAUNCHER 1" | Out-Null
    }
    
    # Auto-reverse ports for Android debugging
    adb reverse tcp:8081 tcp:8081
    
    Write-Host "`nMetro starting..." -ForegroundColor Magenta
    Set-Location $PSScriptRoot
    npx react-native start --reset-cache
}

function clean {
    Write-Host "Cleaning build folder..." -ForegroundColor Yellow
    Invoke-Gradle "clean"
    Write-Host "Done." -ForegroundColor Green
}

function rebuild {
    Write-Host "`nRebuilding..." -ForegroundColor Magenta
    clean
    run
}

function apk {
    Write-Host "Building Release APK..." -ForegroundColor Green
    try { Invoke-Gradle "assembleRelease"; Move-Build-Artifact "APK" }
    catch { Write-Host "APK build failed: $_" -ForegroundColor Red }
}

function aab {
    Write-Host "Building Release AAB..." -ForegroundColor Green
    try { Invoke-Gradle "bundleRelease"; Move-Build-Artifact "AAB" }
    catch { Write-Host "AAB build failed: $_" -ForegroundColor Red }
}

function app {
    Write-Host "`nBuilding Full Release (APK + AAB)..." -ForegroundColor Green
    try {
        Invoke-Gradle "assembleRelease"; Move-Build-Artifact "APK"
        Invoke-Gradle "bundleRelease"; Move-Build-Artifact "AAB"
        explorer.exe "$PSScriptRoot\AppReleases"
    } catch { Write-Host "Build failed: $_" -ForegroundColor Red }
}

# ——————————————————————————————————————————————————————————————————
# MAINTENANCE & CLEANUP
# ——————————————————————————————————————————————————————————————————

function deps { 
    Write-Host "Checking for unused dependencies (depcheck)..." -ForegroundColor Cyan
    npx depcheck 
}

function unused { 
    Write-Host "Checking for unused files & exports (unimported)..." -ForegroundColor Cyan
    npx unimported 
}

function kill-port {
    Write-Host "Killing Metro/Node processes on port 8081..." -ForegroundColor Red
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Ports cleared." -ForegroundColor Green
}

function clear-cache {
    Write-Host "NUKING CACHE..." -ForegroundColor Red
    Remove-Item -Recurse -Force "$env:TEMP\metro-*" -ErrorAction SilentlyContinue
    watchman watch-del-all
    Invoke-Gradle "clean"
    Write-Host "Cache cleared." -ForegroundColor Green
}

# ——————————————————————————————————————————————————————————————————
# DEVICE CONTROL (ANDROID)
# ——————————————————————————————————————————————————————————————————

function reverse { 
    adb reverse tcp:8081 tcp:8081
    Write-Host "Ports reversed (8081)." -ForegroundColor Green 
}

function shake { 
    adb shell input keyevent 82 
    Write-Host "Shook device (Dev Menu)." -ForegroundColor Cyan
}

function reload { 
    adb shell input text "RR" 
    Write-Host "Reloading JS..." -ForegroundColor Cyan
}

function d { adb devices }

# ——————————————————————————————————————————————————————————————————
# UTILITIES
# ——————————————————————————————————————————————————————————————————

function v-u {
    # Embedded Version Bump Script
    # NOTE: The @' and '@ MUST be flush left. Do not indent them.
$jsCode = @'
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
'@
    $tempFile = "$env:TEMP\universal_version_up.js"
    Set-Content -Path $tempFile -Value $jsCode -Encoding UTF8
    try { Set-Location $PSScriptRoot; node $tempFile } finally { Remove-Item -Path $tempFile -ErrorAction SilentlyContinue }
}

function s { npx react-native start --reset-cache }
function doctor { npx react-native doctor }
function test { npx jest }
function lint { npx eslint . --fix }
function ip { 
    $ipconfig = (ipconfig | Out-String)
    if ($ipconfig -match 'IPv4 Address.*: ([\d\.]+)') { Write-Host $matches[1] -ForegroundColor Green }
}
function i { npm install --force }

# ——————————————————————————————————————————————————————————————————
# GIT COMMANDS
# ——————————————————————————————————————————————————————————————————

function add { git add .; Write-Host "Git: Added." -ForegroundColor Cyan }
function push { git push; Write-Host "Git: Pushed." -ForegroundColor Green }
function pull { git pull; Write-Host "Git: Pulled." -ForegroundColor Green }
function status { git status }
function log { git log --oneline --graph --all }

function commit { 
    $Message = $args -join ' '
    if (-not $Message) { Write-Host "Missing message." -ForegroundColor Red; return }
    git commit -m "$Message"
}

function acp { 
    $Message = $args -join ' '
    if (-not $Message) { $Message = "update" } 
    git add .; git commit -m "$Message"; git push
    Write-Host "ACP Complete: $Message" -ForegroundColor Green
}

function undo {
    # Soft Reset: Undoes the last commit but keeps changes in staging
    git reset --soft HEAD~1
    Write-Host "Undid last commit (Changes are staged)." -ForegroundColor Yellow
}

function nuke {
    # Hard Reset: DESTROYS all local changes
    $confirm = Read-Host "Destroy all local changes? (y/n)"
    if ($confirm -eq 'y') {
        git reset --hard HEAD
        git clean -fd
        Write-Host "NUKED. Reset to HEAD." -ForegroundColor Red
    }
}

function stash { git stash; Write-Host "Stashed changes." -ForegroundColor Cyan }
function pop { git stash pop; Write-Host "Stash popped." -ForegroundColor Green }

function new-branch { param([string]$Name) git checkout -b $Name }
function checkout { param([string]$Name) git checkout $Name }
function merge { param([string]$Name) git merge $Name }