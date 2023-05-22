import { Database } from './db/index.js'
import { randomUUID } from 'crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import { validateBody } from './utils/validate-body.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      console.log(search)

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const validation = validateBody(req, ['title', 'description'])
      if(!validation.valid) return res.writeHead(400).end(JSON.stringify({error: validation.error}))

      const {title, description} = req.body

      const task  = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params
      if(!id) return res.writeHead(400).end(JSON.stringify({error: 'Missing task id'}))

      const task = database.findById('tasks', id)
      if(!task) return res.writeHead(404).end(JSON.stringify({error: 'Task not found'}))

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params
      if(!id) return res.writeHead(400).end(JSON.stringify({error: 'Missing task id'}))

      const task = database.findById('tasks', id)
      if(!task) return res.writeHead(404).end(JSON.stringify({error: 'Task not found'}))

      if(!req.body) return res.writeHead(400).end(JSON.stringify({error: 'Missing request body'}))

      let taskNewData = req.body

      Object.keys(taskNewData).forEach(key => taskNewData[key] === undefined && delete taskNewData[key])

      database.update('tasks', id, taskNewData)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params
      if(!id) return res.writeHead(400).end(JSON.stringify({error: 'Missing task id'}))

      const task = database.findById('tasks', id)
      if(!task) return res.writeHead(404).end(JSON.stringify({error: 'Task not found'}))

      database.update('tasks', id, {completed_at: task.completed_at ? null : new Date().toISOString()})

      return res.writeHead(204).end()
    }
  }
]