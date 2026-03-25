/**
 * Whether debug messages should be printed.
 */
let enableDebug = false

/**
 * Toggle debug logging on or off.
 *
 * @param   {boolean}  state  Whether to turn it on or off.
 */
export function toggleDebug (state: boolean) {
  enableDebug = state
}

/**
 * Convenience function for conditional logging. Use this function like you
 * would `console.log` (the parameters are identical and will be passed through)
 * but rest assured that logging will only occur if debug logging is enabled.
 *
 * @param   {any}    message         The message
 * @param   {any[]}  optionalParams  Any optional parameters
 */
export function debug (message?: any, ...optionalParams: any[]) {
  if (!enableDebug) {
    return
  }

  console.log(message, ...optionalParams)
}
