let program = require('commander');

module.exports = function(){
    program
        .version('1.0')
        .option('-c, --config <file>', 'Authenticate with the file given file', 'file')
        .parse(process.argv);

    if(program.config === 'file'){
        console.error("No file given, you must give a file");
        program.help();
        process.exit(1);
    }

    return program.config;
};