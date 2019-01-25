"use strict";

const http = require("http");
const fs = require("fs");
const url = require("url");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const { generateDockerfile, generateDockerComposeFile } = require("./src/generate_docker");
const serve = serveStatic("public");
const uuidv4 = require("uuid/v4");
const parser = require("ua-parser-js");
const rimraf = require("rimraf");
const ncp = require("ncp");
const { tmpdir,platform }= require("os");
const { exec } = require("pkg");
const { join } = require("path");
const { spawn } = require("child_process");

function writeDockerFile(views, connectors, path) {
    return new Promise((resolve, reject) => {
        const df = generateDockerfile(views, connectors);
        fs.writeFile(join(path, "/DockerFile"), new Buffer(df), (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

function writeDockerComposeFile(views, connectors, path) {
    return new Promise((resolve, reject) => {
        const df = generateDockerComposeFile(views, connectors);
        fs.writeFile(join(path, "/docker-compose.yml"), new Buffer(df), (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

function createInstaller(views, connectors, os) {
    return new Promise((resolve, reject) => {
        const folder = join(tmpdir(),uuidv4());
        fs.mkdir(folder, () => {
            const filename = "cimplex" + (os === "win" ? ".exe" : "");
            const filepath = join(folder, filename);
            ncp("installer", folder, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                const visframeworkPath = join(folder, join("docker", "visframework"));
                fs.mkdir(visframeworkPath, () => {
                    writeDockerComposeFile(views, connectors, join(folder, "docker")).then(() => {
                        return writeDockerFile(views, connectors, visframeworkPath).then(() => {
                            return exec([folder, "--targets", `node8-${os}-x64`, "--output", filepath]);
                        });
                    })
                    .then(() => {    
                        fs.readFile(filepath, (error, file) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            rimraf(folder, (error) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                resolve(file)
                            });
                        });
                    })
                    .catch(error => reject(error));
                });
            });
        });
    });
}

const server = http.createServer((req, res) => {
    const location = url.parse(req.url, true)
    if (location.pathname !== "/generate") {
        serve(req, res, finalhandler(req, res));
    } else {
        const views = location.query.views;
        const connectors = location.query.connectors;
        let os = null;
        switch (parser(req.headers["user-agent"]).os.name) {
            case "Mac OS":
                os = "macos"
                break;
            case "Windows":
                os = "win"
                break;
        }

        createInstaller(views, connectors, os).then((installer) => {
            const filename = "cimplex" + (os === "win" ? ".exe" : "");
            res.writeHead(200, {
                "content-type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
            });
            res.write(installer);
        }).catch((error) => {
            res.write(error)
        }).then(() => {
            res.end();
        });
    }
});

server.listen(9998);

console.log("server listening on 9998");
