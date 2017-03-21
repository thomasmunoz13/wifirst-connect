let program = require('commander');

module.exports = function(){
    program
        .version('1.0')
        .option('-c, --config <file>', 'Authenticate with the file given file', 'file')
        .parse(process.argv);

    if(program.config === 'file'){
        program.config = false;
    }

    return program.config;
};