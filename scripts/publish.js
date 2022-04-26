import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import semver from "semver";

let currentVersion;

function startVerdaccio() {
  console.log("Waiting for verdaccio to boot...");
  execSync("rm -rf ./scripts/storage");
  const res = exec("verdaccio --config ./scripts/config.yaml");
  console.log("Pointing npm to verdaccio");
  execSync(`npm config set @test:registry http://localhost:4873/`);
  execSync(`npx wait-on http://localhost:4873/`);
  console.log("Success, verdaccio is running...");
  return res;
}

function beforeExit() {
  console.log("Setting npm back to npmjs.org");
  execSync(`npm config set @test:registry https://registry.npmjs.org/`);
  if (verdaccioProcess) {
    try {
      console.log("Killing verdaccio");
      verdaccioProcess.kill();
    } catch {}
  }
}

function publishLibs(reload = false) {
  const packageJsonPath = "dist/schematics-testing/schematics/package.json";
  if (!currentVersion || reload) {
    currentVersion = semver.parse(
      JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")).version
    );
  }

  // Bump version to publish
  semver.inc(currentVersion, "patch");

  // Update version in package
  const content = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  content.version = currentVersion.version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(content, undefined, 2));

  // Publish package
  const dir = path.dirname(packageJsonPath);
  console.log(`\nPublishing ${content.name}`);
  execSync(
    `yarn publish --cwd ${dir} --new-version ${currentVersion.version} --registry=http://localhost:4873/ --no-git-tag-version`,
    { stdio: "inherit" }
  );
}

function buildSchematics(options) {
  execSync("yarn build:schematics", { stdio: "inherit" });
  console.log("build complete.");
  if (options.publish) {
    publishLibs();
  }
}

let verdaccioProcess;

async function program() {
  verdaccioProcess = startVerdaccio();
  buildSchematics({ publish: true });
}

// Handle killing the script
process.once("SIGINT", function () {
  beforeExit();
  process.exit();
});

process.on("SIGHUP", function () {
  beforeExit();
  process.exit();
});

process.once("SIGTERM", function () {
  beforeExit();
  process.exit();
});

program();
