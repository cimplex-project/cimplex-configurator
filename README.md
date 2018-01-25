# Cimplex Configurator #

DFKI together with USTUTT developed, a configurator that tremendously reduces the time to configure and deploy a custom version of the visualization framework including all data and simulation services. Based on a web page, a user is now able to select which views, data and simulation services he wants to include in his custom deployment. The server backend then creates a unique executable file, depending on the selections, and offers it for download. The downloaded executable, based on node.js and Docker, then fully automatically installs all dependencies, including data and simulation services, locally on the client machine. By using Docker, the installation is isolated and does not affect or modify the client host system. The configurator creates executables for Windows, Mac OSX and Linux.

### How to build run? ###
1. Run *npm install*
2. Run *npm start*

## Creating a custom version of the Visualization Framework ### 

1. Open http://127.0.0.1:9998 to start the configuration wizard (or any external ip)
2. Select view, data and simualation services to include in the custom installation
3. Download the custom installer via the download button

## Running the Installer ##

The executable depends on the current os and supports Linux, Windows and Mac OSX. In order to run
the installer an working installation of [docker](https://www.docker.com) is needed.

## Authors

Authors of this project (comprising ideas, architecture, and code) are:

* Sebastian Alberternst <sebastian.alberternst@dfki.de>
* Jan Sutter <jan.sutter@dfki.de>

This project and code was mainly developed by:

* [DFKI](https://www.dfki.de/web/research/asr/index_html) - German Research Center for Artificial Intelligence
* [USTUTT](https://www.uni-stuttgart.de/en/index.html) - University of Stuttgart, Institute for Visualization and Interactive Systems

Parts of the project and code were developed as part of the [EU H2020](https://ec.europa.eu/programmes/horizon2020/) [project](https://www.cimplex-project.eu/) *CIMPLEX* - Bringing *CI*tizens, *M*odels and Data together in *P*articipatory, Interactive Socia*L* *EX*ploratories.

Futher partners that deliver data and simulations via webservice access are:

* ETHZ (ETH Zurich)
* UCL (University College of London)
* Közép-európai Egyetem (Central European University, CEU)
* ISI (Fondazione Istituto per l'Interscambio Scientifico)
* CNR (National Research Council)
* FBK (Bruno Kessler Foundation)

## License

For the license of cimplex-configurator and all used dependencies see [LICENSES](./LICENSES).
