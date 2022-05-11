#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');


function mdLinks(filePath, options) {

    const args = process.argv;
    const env = process.env;

    // if (args.length == 3) {
    if (1) {
        let argPath = args[2];

        const isAbsolute = path.isAbsolute(argPath);

        if (!isAbsolute) {
            argPath = path.resolve(argPath);
        }

        try {
            fs.accessSync(argPath, fs.constants.R_OK);

            const arrFiles = getAllFiles(argPath);

            const arrLinks = getAllLinks(arrFiles);

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

function getAllLinks(arrFiles) {
    let arrLinks = [];

    arrFiles.forEach((file) => {
        arrLinks = arrLinks.concat(getLinksFromFile(file));
    });

    return arrLinks;
}

function getLinksFromFile(file) {
    const allFileContents = fs.readFileSync(file, 'utf-8');
    let arrLinks = allFileContents.split(/\r?\n/);

    //TODO: delete this block
    // arrLinks = arrLinks.filter((line) => {
    //     return getLinkFromLine(element);
    // });

    arrLinks = arrLinks.reduce(function (filtered, element) {
        const link = getLinkFromLine(element);
        if (link) {
            filtered.push({ "file": file, "href": "hola.com", "line": link });
        }
        return filtered;
    }, []);

    console.log(`para el archivo ${file} tenemos ${arrLinks.length} links`);

    return arrLinks;
}

function getLinkFromLine(line) {
    let character = '';
    let bracketOpen = false;
    let bracketContent = '';
    let braceOpen = false;
    let braceContent = '';
    for (let i = 0; i < line.length; i++) {
        character = line[i];

        // square bracket
        if (character === ']') {
            bracketOpen = false;
        }
        if (bracketOpen) {
            bracketContent += character;
        }
        if (character === '[') {
            bracketOpen = true;
        }
        // parenthesis
        if (character === '(' && i > 0 && bracketContent.length > 0 && line[i - 1] === ']') {
            braceOpen = true;
        }
        if (braceOpen) {
            braceContent += character;
        }
        if (character === ')') {
            braceOpen = false;
        }
    }

    //determine if there was a valid link:
    if (bracketOpen == false && bracketContent.length > 0 && braceOpen == false && braceContent.length > 0) {
        return line;
    }
    else {
        return null;
    }
}

function analyzeDirectory(directory, arrFiles) {

    fs.readdirSync(directory).forEach((file) => {

        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isDirectory()) {
            analyzeDirectory(filePath, arrFiles);
        }
        else {
            if (path.extname(filePath) === '.md') {
                arrFiles.push(filePath);
            }
        }
    });
}

function getAllFiles(filePath) {

    let arrFiles = [];

    if (fs.statSync(filePath).isDirectory()) {
        analyzeDirectory(filePath, arrFiles);
    }
    else {
        console.log(path.extname(filePath));
        if (path.extname(filePath) === '.md') {
            arrFiles.push(filePath);
        }
    }

    return arrFiles;
}

module.exports = {
    getLinkFromLine
}


if (require.main === module) {
    mdLinks();
}
