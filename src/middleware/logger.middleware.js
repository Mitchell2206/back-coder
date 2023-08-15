import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'register.log', level: 'warn' }),
    ],
})






export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;
    logger.http(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`)
    next()
}