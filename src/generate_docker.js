"use strict";

const visframeworkDockerFileTemplate = `FROM node:8.0
WORKDIR /visframework

ARG LOCAL_ADDRESS=localhost

RUN apt-get update && apt-get install -y git
RUN git clone --depth 1 https://github.com/cimplex-project/visualization-framework.git .

RUN mkdir dist
RUN npm install .
RUN npm install serve
RUN npm run build:production -- /*views*/ /*connectors*/

RUN sed -i.bak "s#http://schwalbe.visus.uni-stuttgart.de:8080/VisTwitterDataService2017-07-17/services#http://$LOCAL_ADDRESS:8080/VisTwitterDataService/services#g" ./dist/visframework.js
RUN sed -i.bak "s#http://schwalbe.visus.uni-stuttgart.de:5000/#http://$LOCAL_ADDRESS:5000/#g" ./dist/visframework.js
RUN mv ./index_production.html ./index.html

EXPOSE 80

CMD npm start
`;

function generateDockerfile(views = [], connectors = []) {
    let result = visframeworkDockerFileTemplate;
    views = Array.isArray(views) ? views : [views];
    connectors = Array.isArray(connectors) ? connectors : [connectors];
    const viewsString = views.length > 0 ? views.join(" ") : "";
    const connectorsString = connectors.length > 0 ? connectors.join(" ") : "";
    return result.replace("/*views*/", `--views ${viewsString}`).replace("/*connectors*/", `--connectors ${connectorsString}`);
}


function generateDockerComposeFile(views = [], connectors = []) {
  return `
    version: '3'
    services:
        visframework:
            build: ./visframework
            ports:
             - "9999:80"
    ${connectors.includes("nds_cnr") ?
        `
        ndlib:
            build: ./ndlib
            ports:
            - "5000:5000"
        ` : ''
    }
   `;
}

if (require.main === module) {
    const fs = require("fs");
    const args = process.argv.slice(2);

    const viewsIndex = args.indexOf("--views");
    const connectorsIndex = args.indexOf("--connectors");
    const views = [];
    if (viewsIndex !== -1) {
        const slicedArgs = args.slice(viewsIndex + 1);
        const connectorsIndex = slicedArgs.indexOf("--connectors");
        views = slicedArgs;
        if (connectorsIndex !== -1 && connectorsIndex > viewsIndex) {
            views = slicedArgs.slice(0, connectorsIndex)
        }
    }
    const connectors = [];
    if (connectorsIndex !== -1) {
        const slicedArgs = args.slice(connectorsIndex + 1);
        const viewsIndex = slicedArgs.indexOf("--views");
        connectors = slicedArgs;
        if (viewsIndex !== -1 && viewsIndex > connectorsIndex) {
            connectors = slicedArgs.slice(0, viewsIndex)
        }
    }

    fs.writeFileSync("../Dockerfile", generateDockerfile(views, connectors));
} else {
    exports = module.exports = { generateDockerfile, generateDockerComposeFile };
}
