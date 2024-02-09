/*eslint new-cap: */

function singleton(className) {
  let instance
  return new Proxy(className, {
    construct(target, args) {
      if (!instance) {
        instance = new className(...args)
        instance.destroyed = () => {
          if ('clear' in instance && typeof instance.clear === 'function') {
            instance.clear()
          }
          instance = null
        }
      }
      return instance
    }
  })
}

export { singleton }
