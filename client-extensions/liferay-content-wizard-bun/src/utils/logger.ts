import logger, { type LoggerOptions } from 'pino';

export function createLogger(options?: LoggerOptions) {
    return logger({
        ...options,
        transport: { target: 'pino-pretty', options: { colorize: true } },
    });
}

export default createLogger();
