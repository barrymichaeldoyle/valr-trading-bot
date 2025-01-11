export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle standard Error objects
    return error.message;
  } else if (typeof error === 'object' && error !== null) {
    // Handle API error objects that might have specific fields
    const errorObj = error as Record<string, any>;
    if (errorObj.message) return errorObj.message;
    if (errorObj.error) return errorObj.error;
    if (errorObj.description) return errorObj.description;
    return JSON.stringify(error); // Fallback to stringify if no known fields
  }
  // Handle primitive error values
  return String(error);
}
