import { 
  AppError, 
  ApiError, 
  NetworkError, 
  ErrorCode, 
  ERROR_CODES, 
  ERROR_MESSAGES, 
  RETRYABLE_ERROR_CODES 
} from '@/types/error';

// エラー作成ユーティリティ
export class ErrorFactory {
  static createAppError(
    code: ErrorCode, 
    message?: string, 
    severity: AppError['severity'] = 'medium',
    context?: Record<string, any>
  ): AppError {
    return {
      code,
      message: message || ERROR_MESSAGES[code],
      severity,
      timestamp: new Date(),
      context
    };
  }

  static createApiError(
    code: ErrorCode,
    statusCode: number,
    endpoint: string,
    message?: string,
    context?: Record<string, any>
  ): ApiError {
    return {
      ...this.createAppError(code, message, 'high', context),
      statusCode,
      endpoint
    };
  }

  static createNetworkError(
    message?: string,
    isTimeout: boolean = false,
    context?: Record<string, any>
  ): NetworkError {
    const code = isTimeout ? ERROR_CODES.NETWORK_TIMEOUT : ERROR_CODES.NETWORK_ERROR;
    return {
      ...this.createAppError(code, message, 'high', context),
      isNetworkError: true,
      isTimeout
    };
  }

  static fromFetchError(error: Error, endpoint: string): ApiError | NetworkError {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return this.createNetworkError(
        'リクエストがタイムアウトしました',
        true,
        { originalError: error.message }
      );
    }

    if (error.message.includes('fetch') || error.message.includes('network')) {
      return this.createNetworkError(
        'ネットワーク接続に問題があります',
        false,
        { originalError: error.message }
      );
    }

    return this.createApiError(
      ERROR_CODES.API_INTERNAL_ERROR,
      500,
      endpoint,
      undefined,
      { originalError: error.message }
    );
  }

  static fromGeminiError(error: any, context?: Record<string, any>): ApiError {
    // Gemini APIの具体的なエラーパターンを処理
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('API_KEY') || errorMessage.includes('authentication')) {
      return this.createApiError(
        ERROR_CODES.API_KEY_INVALID,
        401,
        '/api/chat',
        'APIキーが無効です',
        context
      );
    }

    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return this.createApiError(
        ERROR_CODES.API_QUOTA_EXCEEDED,
        429,
        '/api/chat',
        'API使用量の上限に達しました',
        context
      );
    }

    if (errorMessage.includes('rate')) {
      return this.createApiError(
        ERROR_CODES.API_RATE_LIMIT,
        429,
        '/api/chat',
        'リクエストが多すぎます',
        context
      );
    }

    return this.createApiError(
      ERROR_CODES.API_INTERNAL_ERROR,
      500,
      '/api/chat',
      'AIサービスに一時的な問題が発生しています',
      context
    );
  }
}

// 再試行ユーティリティ
export class RetryUtils {
  static isRetryable(error: AppError): boolean {
    return RETRYABLE_ERROR_CODES.has(error.code as ErrorCode);
  }

  static calculateDelay(attempt: number, baseDelay: number = 1000): number {
    // 指数バックオフ（最大30秒）
    return Math.min(baseDelay * Math.pow(2, attempt), 30000);
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000,
    onRetry?: (attempt: number, error: AppError) => void
  ): Promise<T> {
    let lastError: AppError | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const appError = error instanceof Error 
          ? ErrorFactory.fromFetchError(error, 'unknown')
          : error as AppError;

        lastError = appError;

        // 再試行可能でない、または最後の試行の場合は即座にエラーを投げる
        if (!this.isRetryable(appError) || attempt === maxAttempts - 1) {
          throw appError;
        }

        // 再試行前の待機
        if (attempt < maxAttempts - 1) {
          const delay = this.calculateDelay(attempt, baseDelay);
          await new Promise(resolve => setTimeout(resolve, delay));
          onRetry?.(attempt + 1, appError);
        }
      }
    }

    throw lastError;
  }
}

// タイムアウト付きfetch
export function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

// エラーログ関数
export function logError(error: AppError, context?: string): void {
  const logData = {
    context,
    error: {
      code: error.code,
      message: error.message,
      severity: error.severity,
      timestamp: error.timestamp,
      ...(error.context && { context: error.context })
    }
  };

  if (error.severity === 'critical' || error.severity === 'high') {
    console.error('[ERROR]', logData);
  } else {
    console.warn('[WARNING]', logData);
  }
}