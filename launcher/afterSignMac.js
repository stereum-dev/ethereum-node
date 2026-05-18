const { execSync } = require("child_process");
const path = require("path");

// electron-builder v26 no longer re-signs bundled frameworks when no certificate is
// provided. The Electron Framework ships pre-signed with the Electron project's Apple
// Team ID, causing macOS 26+ to reject the load because the main executable has no
// Team ID. Re-sign everything with ad-hoc ("-") so all binaries share a consistent
// (empty) Team ID and dyld's validation passes.
//
// This must be afterSign (not afterPack) for --universal builds: afterPack fires once
// per arch on the temporary per-arch outputs before @electron/universal merges them.
// Re-signing those temps makes CodeResources differ between architectures, causing the
// merge to fail with "non-binary files have different SHAs". afterSign fires once on
// the final merged universal .app, after the merge succeeds.
exports.default = async function afterSignMac(context) {
  if (context.electronPlatformName !== "darwin") return;

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);

  console.log(`[afterSignMac] Ad-hoc re-signing for macOS 26+ Team ID compatibility:`);
  console.log(`[afterSignMac] ${appPath}`);

  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: "inherit" });

  console.log(`[afterSignMac] Done.`);
};
