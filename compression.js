const fs = require('fs');
const archiver = require("archiver");


const exec = (inputGlob,outputFile) => {

    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    output.on('close', function () {
       //null
    });
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });
    archive.on('error', function (err) {
        throw err;
    });
    archive.pipe(output);
    
    archive.glob(inputGlob.pattern, inputGlob.options);
    return archive.finalize();
}

module.exports.exec = exec;