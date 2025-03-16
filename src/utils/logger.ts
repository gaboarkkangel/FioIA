import { config } from '@/config';

interface LogMeta {
    [key: string]: any;
}

class Logger {
    private env: string;

    constructor() {
        this.env = config.server.env;
    }

    info(message: string, meta: LogMeta = {}): void {
        this._log('info', message, meta);
    }

    error(message: string | Error, meta: LogMeta = {}): void {
        if (message instanceof Error) {
            meta.stack = message.stack;
            message = message.message;
        }
        this._log('error', message, meta);
    }

    warn(message: string, meta: LogMeta = {}): void {
        this._log('warn', message, meta);
    }

    private _log(level: 'info' | 'error' | 'warn', message: string, meta: LogMeta): void {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta,
            env: this.env
        };

        console.log(JSON.stringify(logEntry));
    }
}

export const logger = new Logger(); 