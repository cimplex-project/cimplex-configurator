const { spawn, spawnSync, exec, execSync } = require("child_process");
const path = require("path");
const { tmpdir } = require("os");
const uuidv4 = require("uuid/v4");
const ora = require("ora");
const rimraf = require("rimraf");
const opener = require("opener");

function checkDocker() {
    return new Promise((resolve, reject) => {
        exec("docker-compose version", (error, stdin, stdout) => {
            if(error === null) {
                resolve();
            } else {
                reject();
            }
        });
    })
}

function getDockerIp() {
    try {
        const stdout = execSync("docker-machine ip", { stdio: ["ignore", "ignore", "ignore"]}).toString();
        return stdout.slice(0, stdout.length - 1); // remove new line from string
    }
    catch(e) {
        return "localhost";
    }
}

function install(targetDir, dockerIp) {
    return new Promise((resolve, reject) => {
        const spinner = ora("Building docker compose").start();
        const build = spawn("docker-compose", ["build",
                     "--build-arg", `LOCAL_ADDRESS=${dockerIp}`, "visframework"], {
            cwd: targetDir
        });

        build.stdout.on("data", (data) => {
            if(printDebug) {
                console.log(data.toString());
            }
        }); 

        build.stderr.on("data", (data) => {
            if(printDebug) {
                console.log(data.toString());
            }
        });

        build.on("close", (code) => {
            if(code === 0) {
                spinner.succeed(["Build successfull!"])
                resolve();
            } else {
                spinner.fail("Building failed");
                reject();
            }
        });
    })
}

function run(targetDir) {
    return new Promise((resolve, reject) => {
        const spinner = ora("Running docker compose").start();
        const run = spawn("docker-compose", ["up", "-d"], {
            cwd: targetDir
        });

        run.stdout.on("data", (data) => {
            if(printDebug) {
                console.log(data.toString());
            }
        }); 

        run.stderr.on("data", (data) => {
            if(printDebug) {
                console.log(data.toString());
            }
        });

        process.on("SIGINT", function () {
            if (targetDir) {
                stop(targetDir)
                    .then(() => {
                        remove(targetDir)
                            .then(() => {
                                removeExtractedAssets(targetDir);
                                process.exit();
                            })
                    });
            }
        });

        run.on("close", (code) => {
            if(code === 0) {
                spinner.succeed(["Run successfull!"])
                resolve(run);
            } else {
                spinner.fail("Run failed");
                reject();
            }
        });
    })
}

function stop(targetDir) {
    return new Promise((resolve, reject) => {
        const spinner = ora("Stopping docker compose").start();
        const down = spawn("docker-compose", ["stop"], {
            cwd: targetDir
        });
        
        down.on("close", (code) => {
            spinner.succeed(["Stop successfull"]);
            resolve();
        });
    })
}

function remove(targetDir) {
    return new Promise((resolve, reject) => {
        const spinner = ora("Remove docker compose").start();
        const down = spawn("docker-compose", ["rm", "-f"], {
            cwd: targetDir
        });
        
        down.on("close", (code) => {
            spinner.succeed(["Remove successfull"]);
            resolve();
        });
    })
}

function extractAssets() {
    const copydir = require("copy-dir");
    const targetDir = path.join(tmpdir(), uuidv4());
    copydir.sync(path.join(__dirname, "docker"), targetDir);
    return targetDir;
}

function removeExtractedAssets(targetDir) {
    rimraf.sync(targetDir);
}

// windows does not support the sigint signal (remove )
if (process.platform === "win32") {
    const rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

console.log(`   
   ___ _            _          
  / __(_)_ __  _ __| |_____ __ 
 | (__| | '  \\| '_ \\ / -_) \\ / 
  \\___|_|_|_|_| .__/_\\___/_\\_\\ 
              |_| https://www.cimplex-project.eu/
                          (press ctrl+c to close)
`);

let printDebug = false;

process.argv.forEach((argument)  => {
    if(argument === "-v" || argument === "--v") {
        printDebug = true;
    }
});

checkDocker()   
    .then(() => {
        const dockerIp = getDockerIp();
        const targetDir = extractAssets();
        install(targetDir, dockerIp)
            .then(() => {
                return run(targetDir)
                    .then(() => {
                        setTimeout(() => opener(`http://${dockerIp}:9999/`), 3000);
                    });
            })
            .catch(() => {
                removeExtractedAssets(targetDir);
                process.exit();
            });
    })
    .catch(() => {
        console.log("docker-compose not found. Please install docker from: http://www.docker.com")
        opener("http://www.docker.com", () => {
            process.exit();
        });
    });
