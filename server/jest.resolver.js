module.exports = (request, options) => {
  if (request.startsWith('node:')) {
    return options.defaultResolver(request.slice(5), options)
  }
  return options.defaultResolver(request, options)
}
