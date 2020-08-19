let { join } = require('path')
let getLambdaName = require('./get-lambda-name')

module.exports = function populateHTTP ({ item, dir, cwd }) {
  let methods = [ 'get', 'post', 'put', 'patch', 'delete', /* 'options'*/ ]
  let validMethod = str => methods.some(m => m === str.toLowerCase())
  let validPath = str => str.match(/^\/[a-zA-Z0-9/\-:._]*$/) // TODO add more validation
  if (Array.isArray(item) && item.length === 2) {
    let method = item[0].toLowerCase()
    let path = item[1]
    let valid = validMethod(method) && validPath(path)
    if (valid) {
      let name = `${method} ${path}`
      let lambdaName = `${method}${getLambdaName(path)}`
      let srcDir = join(cwd, dir, lambdaName)
      let route = { name, method, path, srcDir }
      if (name === 'get /') route.explicit = true
      return route
    }
  }
  else if (typeof item === 'object') {
    let path = Object.keys(item)[0]
    let method = item[path].method.toLowerCase()
    let valid = validMethod(method) && validPath(path)
    if (valid) {
      let name = `${method} ${path}`
      let lambdaName = `${method}${getLambdaName(path)}`
      let srcDir = item[path].path
        ? join(cwd, item[path].path)
        : join(cwd, dir, lambdaName)
      let route = { name, method, path, srcDir }
      if (name === 'get /') route.explicit = true
      return route
    }
  }
  throw Error(`Invalid @http item: ${item}`)
}
