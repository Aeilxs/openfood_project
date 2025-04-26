import { Injectable } from '@angular/core';
import { LogLevel } from '@src/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private currentLogLevel: LogLevel = LogLevel.TRACE;

  private readonly styles: Record<LogLevel, string> = {
    [LogLevel.TRACE]: 'color: #999; font-weight: bold;',
    [LogLevel.DEBUG]: 'color: #1E90FF; font-weight: bold;',
    [LogLevel.INFO]: 'color: green; font-weight: bold;',
    [LogLevel.WARN]: 'color: orange; font-weight: bold;',
    [LogLevel.ERROR]: 'color: red; font-weight: bold;',
    [LogLevel.OFF]: 'color: transparent;',
  };

  setLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * Helper method to log a message with a given level.
   * @param level The LogLevel of the message.
   * @param prefix The string prefix (e.g., 'TRACE', 'DEBUG').
   * @param logFn The console function to use (e.g., console.log, console.warn).
   * @param message The message to log.
   * @param vargs Additional parameters to log.
   */
  private logMessage(
    level: LogLevel,
    prefix: string,
    logFn: (...args: any[]) => void,
    message: any,
    ...vargs: any[]
  ): void {
    if (this.currentLogLevel <= level) {
      logFn(`%c[${prefix}] %c`, this.styles[level], '', message, ...vargs);
    }
  }

  trace(message: any, ...vargs: any[]): void {
    this.logMessage(LogLevel.TRACE, 'TRACE', console.log, message, ...vargs);
  }

  debug(message: any, ...vargs: any[]): void {
    this.logMessage(LogLevel.DEBUG, 'DEBUG', console.log, message, ...vargs);
  }

  info(message: any, ...vargs: any[]): void {
    this.logMessage(LogLevel.INFO, 'INFO', console.log, message, ...vargs);
  }

  warn(message: any, ...vargs: any[]): void {
    this.logMessage(LogLevel.WARN, 'WARN', console.warn, message, ...vargs);
  }

  error(message: any, ...vargs: any[]): void {
    this.logMessage(LogLevel.ERROR, 'ERROR', console.error, message, ...vargs);
  }
}
