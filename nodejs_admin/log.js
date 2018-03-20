var log4js = require('log4js');
log4js.configure({
    appenders: [
    {
        type: 'console',
        category: "console"
    }, 
    {
        type: "dateFile",
        filename: 'logs-admin/log.log',
        pattern: "_yyyy-MM-dd",
        alwaysIncludePattern: false,
        category: '|'
    }
    ],
    replaceConsole: true,   
    levels:{
        dateFileLog: 'INFO'
    }
});


exports.logger=function(){
  var logger = log4js.getLogger("|");
  logger.setLevel('INFO');
  return logger;
}

