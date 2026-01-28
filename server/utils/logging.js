export function logApiCall(req) {
  console.log(`\x1b[34m[API CALL]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function TestApiCall(req) {
  console.log(`\x1b[35m[API TEST CALL]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function errorApiCall(req, error) {
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

export function successApiCall(req) {
  console.log(`\x1b[32m[API SUCCESS]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}

export function notImplemented(req) {
  console.log(`\x1b[33m[API NOT IMPLEMENTED]\x1b[0m -> ${req.method.toUpperCase()} ${req.originalUrl} @ ${new Date().toLocaleString()}`);
}
