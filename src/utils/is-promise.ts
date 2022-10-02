export const isPromise = (target: any): boolean =>
  typeof target?.then === 'function' && typeof target?.catch === 'function' && typeof target?.finally === 'function'
