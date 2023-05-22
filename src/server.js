import http from 'node:http';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';
import { routes } from './routes.js';

const PORT = 3332

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route) {
    const routeParameters = req.url.match(route.path)

    const {query, ...params} = routeParameters.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})