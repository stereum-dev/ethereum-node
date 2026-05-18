const { execSync } = require("child_process");
const path = require("path");

// electron-builder v26 no longer re-signs bundled frameworks when no certificate is
// provided. The Electron Framework ships pre-signed with the Electron project's Apple
// Team ID, causing macOS 26+ to reject the load because the main executable has no
// Team ID. Re-sign everything with ad-hoc ("-") so all binaries share a consistent
// (empty) Team ID and dyld's validation passes.
exports.default = async function afterPackMac(context) {
  if (context.electronPlatformName !== "darwin") return;

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);

  console.log(`[afterPackMac] Ad-hoc re-signing for macOS 26+ Team ID compatibility:`);
  console.log(`[afterPackMac] ${appPath}`);

  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: "inherit" });

  console.log(`[afterPackMac] Done.`);
};
