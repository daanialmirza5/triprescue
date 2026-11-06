/**
 * API error response parser and normalization utilities.
 */

export interface NormalizedApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

/**
 * Safely extracts a user-readable error message from unknown error objects or API responses.
 */
export function formatApiError(error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.'): string {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.detail === 'string') {
      return errorObj.detail;
    }
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
  }

  return fallbackMessage;
}
