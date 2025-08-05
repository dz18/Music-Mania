export function logApiCall(method, route) {
  console.log(route)
  console.log(`\x1b[34m[API CALL]\x1b[0m -> ${method.toUpperCase()} ${route} @ ${new Date().toLocaleString()}`);
}

export function errorApiCall(method, route, error) {
  // Log the actual error message or stack trace
  console.error(`\x1b[31m[API ERROR]\x1b[0m -> ${method.toUpperCase()} ${route} @ ${new Date().toLocaleString()}`);
  
  // Check if the error is an object (e.g., Error object) and log its message or stack trace
  if (error instanceof Error) {
    console.error(`Error Message: ${error.message}`);
  } else {
    // If it's not an instance of Error, just log the error directly
    console.error(`Error: ${error}`);
  }
}

export function successApiCall(method, route) {
  console.log(`\x1b[32m[API SUCCESS]\x1b[0m -> ${method.toUpperCase()} ${route} @ ${new Date().toLocaleString()}`);
}

export function notImplemented(method, route) {
  console.log(`\x1b[33m[API NOT IMPLEMENTED]\x1b[0m -> ${method.toUpperCase()} ${route} @ ${new Date().toLocaleString()}`);
}
