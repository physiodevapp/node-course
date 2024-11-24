import { createRequire } from 'node:module'

// - import.meta.url toma el path absoluto de la carpeta del actual fichero
// - a partir de aquí construye las paths relativas del require
const require = createRequire(import.meta.url)

export const requireJSON = (path) => {
  return require(path)
}
