/**
 * This script automates the versioning process for the React Native application.
 * It intelligently handles inconsistencies between package.json and native build files.
 *
 * It performs the following steps:
 * 1. Reads the current version from `package.json` and `android/app/build.gradle`.
 * 2. Determines the "master" version by picking the highest one. This prevents accidental version downgrades.
 * 3. Increments the patch number of the master version (e.g., 1.1.15 -> 1.1.16).
 * 4. Syncs this new version and build number across all relevant files:
 * - `package.json`
 * - `android/app/build.gradle` (versionCode and versionName)
 * - `ios/YourApp/Info.plist` (CFBundleVersion and CFBundleShortVersionString)
 */
const fs = require('fs');
const path = require('path');

// --- ❗ IMPORTANT CONFIGURATION ❗ ---
// Replace 'LineupXApp' with the actual name of your iOS project directory.
// This is the name of the folder inside your `/ios` directory that contains the Info.plist file.
const IOS_PROJECT_NAME = 'LineupXApp';
// -------------------------------------

// --- Paths ---
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const gradlePath = path.join(rootDir, 'android/app/build.gradle');
const plistPath = path.join(rootDir, `ios/${IOS_PROJECT_NAME}/Info.plist`);

// --- Helper Functions ---
function log(message) {
  console.log(`\x1b[32m${message}\x1b[0m`); // Green text
}

function logInfo(message) {
  console.log(`\x1b[36m${message}\x1b[0m`); // Cyan text
}

function logError(message) {
  console.error(`\x1b[31m${message}\x1b[0m`); // Red text
}

function exitWithError(message) {
    logError(`❌ ERROR: ${message}`);
    process.exit(1);
}

/**
 * Compares two semantic version strings (e.g., "1.2.3").
 * @returns {number} 1 if v1 > v2, -1 if v1 < v2, 0 if v1 === v2
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    const len = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < len; i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

// --- Main Script ---
try {
  logInfo('🚀 Starting version bump process...');

  // --- Step 1: Read all current versions ---
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const pkgVersion = pkg.version;

  let gradleContent = fs.readFileSync(gradlePath, 'utf8');
  const gradleVersionMatch = gradleContent.match(/versionName "([\d\.]+)"/);
  if (!gradleVersionMatch) exitWithError('Could not find versionName in build.gradle');
  const gradleVersion = gradleVersionMatch[1];

  const versionCodeMatch = gradleContent.match(/versionCode (\d+)/);
  if (!versionCodeMatch) exitWithError('Could not find versionCode in build.gradle');
  const currentVersionCode = parseInt(versionCodeMatch[1]);

  log(`  - Found package.json version: ${pkgVersion}`);
  log(`  - Found Android versionName:  ${gradleVersion}`);
  log(`  - Found Android versionCode:  ${currentVersionCode}`);

  // --- Step 2: Determine the master version and increment it ---
  let masterVersion = pkgVersion;
  if (compareVersions(gradleVersion, pkgVersion) > 0) {
      masterVersion = gradleVersion;
      logInfo(`\n⚠️  Warning: Android versionName (${gradleVersion}) is higher than package.json (${pkgVersion}).`);
      logInfo(`  Using Android version as the new master.`);
  }

  const versionParts = masterVersion.split('.').map(Number);
  // Ensure we have major, minor, patch
  while (versionParts.length < 3) {
      versionParts.push(0);
  }

  versionParts[2] += 1; // Increment patch version
  const newVersion = versionParts.join('.');
  const newVersionCode = currentVersionCode + 1;

  log(`\n✅ Determined new version: ${newVersion} (Build: ${newVersionCode})`);

  // --- Step 3: Write new versions to all files ---

  // Update package.json
  log('  - Updating package.json...');
  pkg.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

  // Update Android (build.gradle)
  log('  - Updating android/app/build.gradle...');
  gradleContent = gradleContent.replace(/versionCode \d+/, `versionCode ${newVersionCode}`);
  gradleContent = gradleContent.replace(/versionName "[\d\.]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(gradlePath, gradleContent);

  // Update iOS (Info.plist)
  if (process.platform === 'darwin') {
    log('  - Updating ios/Info.plist...');
    if (!fs.existsSync(plistPath)) {
        exitWithError(`Info.plist not found at path: ${plistPath}\n  👉 Please update the 'IOS_PROJECT_NAME' variable in this script.`);
    }
    let plistContent = fs.readFileSync(plistPath, 'utf8');
    plistContent = plistContent.replace(/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${newVersion}$2`);
    plistContent = plistContent.replace(/(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/, `$1${newVersionCode}$2`);
    fs.writeFileSync(plistPath, plistContent);
  } else {
    logInfo('  - Skipping iOS update (not on macOS).');
  }

  log('\n✨ Versioning complete! All files are now in sync. ✨');

} catch (error) {
  exitWithError(`An error occurred: ${error.message}`);
}
