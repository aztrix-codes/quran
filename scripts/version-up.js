/**
 * Universal Version Bump Script
 * Automates versioning for React Native (Android + iOS)
 * * 1. Detects iOS Project Name automatically.
 * 2. Syncs version in package.json, build.gradle, and Info.plist.
 * 3. Auto-increments patch version (1.0.0 -> 1.0.1) if no version is supplied.
 */
const fs = require('fs');
const path = require('path');

// --- Paths ---
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const gradlePath = path.join(rootDir, 'android/app/build.gradle');
const iosDir = path.join(rootDir, 'ios');

// --- Helper: Dynamic iOS Project Detection ---
function getIosProjectName() {
  if (!fs.existsSync(iosDir)) return null;
  const files = fs.readdirSync(iosDir);
  // Look for the .xcodeproj directory (e.g., "Quran.xcodeproj")
  const projFile = files.find(file => file.endsWith('.xcodeproj'));
  if (projFile) {
    return projFile.replace('.xcodeproj', '');
  }
  return null;
}

const IOS_PROJECT_NAME = getIosProjectName();
const plistPath = IOS_PROJECT_NAME 
  ? path.join(rootDir, `ios/${IOS_PROJECT_NAME}/Info.plist`) 
  : null;

// --- Helper Functions ---
function log(message) { console.log(`\x1b[32m${message}\x1b[0m`); } // Green
function logInfo(message) { console.log(`\x1b[36m${message}\x1b[0m`); } // Cyan
function logError(message) { console.error(`\x1b[31m${message}\x1b[0m`); } // Red
function exitWithError(message) { logError(`❌ ERROR: ${message}`); process.exit(1); }

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
  logInfo('🚀 Starting universal version bump...');

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

  log(`  - package.json: ${pkgVersion}`);
  log(`  - Android:      ${gradleVersion} (Code: ${currentVersionCode})`);
  if (IOS_PROJECT_NAME) log(`  - iOS Project:  ${IOS_PROJECT_NAME}`);

  // --- Step 2: Determine new version ---
  let masterVersion = pkgVersion;
  if (compareVersions(gradleVersion, pkgVersion) > 0) {
    masterVersion = gradleVersion;
    logInfo(`\n⚠️  Syncing to higher Android version (${gradleVersion})`);
  }

  const versionParts = masterVersion.split('.').map(Number);
  while (versionParts.length < 3) versionParts.push(0);
  
  versionParts[2] += 1; // Increment patch
  const newVersion = versionParts.join('.');
  const newVersionCode = currentVersionCode + 1;

  log(`\n✅ New Version: ${newVersion} (Build: ${newVersionCode})`);

  // --- Step 3: Write Updates ---

  // 1. package.json
  log('  - Updating package.json...');
  pkg.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

  // 2. Android build.gradle
  log('  - Updating Android build.gradle...');
  gradleContent = gradleContent.replace(/versionCode \d+/, `versionCode ${newVersionCode}`);
  gradleContent = gradleContent.replace(/versionName "[\d\.]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(gradlePath, gradleContent);

  // 3. iOS Info.plist
  if (plistPath && fs.existsSync(plistPath)) {
    log(`  - Updating iOS Info.plist (${IOS_PROJECT_NAME})...`);
    let plistContent = fs.readFileSync(plistPath, 'utf8');
    
    // Updates CFBundleShortVersionString (Version)
    plistContent = plistContent.replace(
      /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/, 
      `$1${newVersion}$2`
    );
    
    // Updates CFBundleVersion (Build Number)
    plistContent = plistContent.replace(
      /(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/, 
      `$1${newVersionCode}$2`
    );
    
    fs.writeFileSync(plistPath, plistContent);
  } else {
    logInfo('  - Skipping iOS (Info.plist not found or not an iOS project).');
  }

  log('\n✨ Versioning complete! ✨');

} catch (error) {
  exitWithError(`Failed: ${error.message}`);
}