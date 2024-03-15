import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { serviceName: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    );
}

export default logger;
