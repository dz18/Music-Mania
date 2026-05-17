import { Request, Response } from 'express'

export function logApiCall(req: Request) {
  console.log(`\x1b[34m[API CALL]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function TestApiCall(req: Request) {
  console.log(`\x1b[35m[API TEST CALL]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function errorApiCall(req: Request, error: unknown) {
  // Log the actual error message or stack trace
  console.error(`\x1b[31m[API ERROR]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
  
  // Check if the error is an object (e.g., Error object) and log its message or stack trace
  if (error instanceof Error) {
    console.error(`Error Message: ${error.message}`);
    console.error(error)
  } else {
    // If it's not an instance of Error, just log the error directly
    console.error(`Error: ${error}`);
  }
}

export function successApiCall(req: Request) {
  console.log(`\x1b[32m[API SUCCESS]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function notImplemented(req: Request) {
  console.log(`\x1b[33m[API NOT IMPLEMENTED]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export const handleMbError = (req: Request, res: Response, error: any) => {
  if (error.status) {
    errorApiCall(req, `MusicBrainz error: ${error.status}`)
    return res.status(error.status).json({ error: 'MusicBrainz API server returned an error. Try again later.' })
  }
  if (error.cause?.code === 'ECONNRESET') {
    errorApiCall(req, error.message)
    return res.status(502).json({ error: 'Upstream MusicBrainz connection reset' })
  }
  errorApiCall(req, error.message)
  return res.status(500).json({ error: 'Internal server error. Please try again later.' })
}