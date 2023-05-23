import { parse } from 'csv-parse';
import fs from 'node:fs'

const path = new URL('./tasks.csv', import.meta.url)
const file = fs.createReadStream(path)

const parseCSV = parse({
  delimiter: ',',
  from_line: 2,
  skipEmptyLines: true,
})

async function bootstrap() {
  for await (const line of file.pipe(parseCSV)) {
    const [title, description] = line

    console.log({ title, description})

    await fetch('http://localhost:3332/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    })
  }
}

bootstrap()