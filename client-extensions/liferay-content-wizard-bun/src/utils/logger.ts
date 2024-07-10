import logger from 'pino';

export default logger({
  transport: { target: 'pino-pretty', options: { colorize: true } },
});
