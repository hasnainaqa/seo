declare module 'node-cron' {
  /**
   * Schedules a task to be executed according to the cron pattern
   * @param pattern The cron pattern to use
   * @param task The task to execute
   * @param options Options for the scheduled task
   * @returns The scheduled task
   */
  export function schedule(
    pattern: string,
    task: () => void,
    options?: {
      scheduled?: boolean;
      timezone?: string;
    }
  ): {
    start: () => void;
    stop: () => void;
  };

  /**
   * Validates a cron pattern
   * @param pattern The cron pattern to validate
   * @returns Whether the pattern is valid
   */
  export function validate(pattern: string): boolean;
}
