import winston from "winston";


const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'white',
};


winston.addColors(colors);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple(),
                winston.format.printf((info) => {
                    return `${info.level}: ${info.message}`;
                })
            )
        }),
        new winston.transports.File({ filename: 'register.log', level: 'warn' }),
    ],
});

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    logger.info(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
    next();
};

