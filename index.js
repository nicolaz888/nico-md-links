#!/usr/bin/env node
const { log } = require('console');
const fs = require('fs');
const path = require('path');


function mdLinks(filePath, options) {
    const args = process.argv;
    const env = process.env;
    const pwd = env.PWD;

    // if (args.length == 3) {
    if (1) {

        //1. verify that the 3rd parameter is a file:
        let argPath = args[2];

        //2. verify if the filePath is absolute or relative
        const isAbsolute = path.isAbsolute(argPath);

        if (!isAbsolute) {
            argPath = path.resolve(argPath);
        }

        try {

            console.log(`PATH A REVISAR:::: ${argPath}`);

            fs.accessSync(argPath, fs.constants.R_OK);

            const arrFiles = getAllFiles(argPath);

            console.log(`ARR FILES COUNT:::: ${arrFiles.length}`);
            console.log(`ARR FILES:::: ${arrFiles}`);
        }
        catch (error) {
            if (error.code == "ENOENT") {
                console.log("archivo no existe");
            }
            else {
                console.log(error);
            }
        }
    }
}

function throughDirectory(directory, arrFiles) {

    fs.readdirSync(directory).forEach((file) => {

        const absolute = path.join(directory, file);

        if (fs.statSync(absolute).isDirectory()) {
            throughDirectory(absolute, arrFiles);
        }
        else {
            arrFiles.push(absolute);
        }
    });
}

function getAllFiles(filePath) {

    let arrFiles = [];

    if (fs.statSync(filePath).isDirectory()) {
        throughDirectory(filePath, arrFiles);
    }
    else {
        arrFiles.push(filePath);
    }

    return arrFiles;

}

mdLinks();
