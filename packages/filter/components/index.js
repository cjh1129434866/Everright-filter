import _ from 'lodash-es'
const importModules = import.meta.glob('./*.vue', { eager: true })
const modules = {}
_.forIn(importModules, (func, path) => {
  modules[`${path.replace(/(.\/|\.vue)/g, '')}Component`] = func.default
})
console.log('modules===', modules)
export default modules
