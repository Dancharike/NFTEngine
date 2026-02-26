const fsExtra = require("fs-extra");
const cp = require("child_process");

console.log("\x1b[35m***BUILD***\x1b[0m");

console.log("Cleaning...");
fsExtra.emptyDirSync("dist");

console.log("Copying web...");
fsExtra.copySync("web/", "dist");

console.log("Building...");
try
{
    cp.execSync("npx webpack --mode=production", {
        stdio: "inherit"
    });
    console.log("\x1b[35m***BUILD COMPLETE***\x1b[0m");
}
catch(ex)
{
    console.log(ex.stdout);
    console.log("\x1b[35m***BUILD FAILED***\x1b[0m");
}
