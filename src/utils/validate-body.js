export function validateBody(req, expectedFields) {
  const {body} = req

  if(!body) {
    return {
      valid: false,
      error: 'Missing request body'
    }
  }

  const receivedFields = Object.keys(body)

  const missingFields = expectedFields.filter(field => !receivedFields.includes(field))

  if(missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing fields: ${missingFields.join(', ')}`
    }
  }

  return {
    valid: true,
    error: null
  }
}