// エラー関連の型定義

export interface AppError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, any>;
}

export interface ApiError extends AppError {
  statusCode: number;
  endpoint: string;
}

export interface NetworkError extends AppError {
  isNetworkError: true;
  isTimeout?: boolean;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
}

// エラーコード定数
export const ERROR_CODES = {
  // API関連
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  API_TIMEOUT: 'API_TIMEOUT',
  API_INTERNAL_ERROR: 'API_INTERNAL_ERROR',
  
  // ネットワーク関連
  NETWORK_ERROR: 'NETWORK_ERROR',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  
  // データ関連
  CHARACTER_NOT_FOUND: 'CHARACTER_NOT_FOUND',
  CHARACTER_LOAD_FAILED: 'CHARACTER_LOAD_FAILED',
  INVALID_CHARACTER_DATA: 'INVALID_CHARACTER_DATA',
  
  // バリデーション関連
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // 一般的なエラー
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// エラーメッセージのマッピング
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.API_KEY_MISSING]: 'APIキーが設定されていません',
  [ERROR_CODES.API_KEY_INVALID]: 'APIキーが無効です',
  [ERROR_CODES.API_RATE_LIMIT]: 'リクエストが多すぎます。しばらく待ってから再試行してください',
  [ERROR_CODES.API_QUOTA_EXCEEDED]: 'API使用量の上限に達しました',
  [ERROR_CODES.API_TIMEOUT]: 'リクエストがタイムアウトしました',
  [ERROR_CODES.API_INTERNAL_ERROR]: 'AIサービスに一時的な問題が発生しています',
  
  [ERROR_CODES.NETWORK_ERROR]: 'ネットワーク接続に問題があります',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'ネットワーク接続がタイムアウトしました',
  [ERROR_CODES.NETWORK_OFFLINE]: 'インターネット接続を確認してください',
  
  [ERROR_CODES.CHARACTER_NOT_FOUND]: '指定されたキャラクターが見つかりません',
  [ERROR_CODES.CHARACTER_LOAD_FAILED]: 'キャラクター情報の読み込みに失敗しました',
  [ERROR_CODES.INVALID_CHARACTER_DATA]: 'キャラクターデータが破損しています',
  
  [ERROR_CODES.INVALID_INPUT]: '入力内容に問題があります',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: '必須項目が入力されていません',
  
  [ERROR_CODES.UNKNOWN_ERROR]: '予期しないエラーが発生しました',
  [ERROR_CODES.INTERNAL_ERROR]: 'システム内部エラーが発生しました'
};

// 再試行可能なエラーコード
export const RETRYABLE_ERROR_CODES: Set<ErrorCode> = new Set([
  ERROR_CODES.API_TIMEOUT,
  ERROR_CODES.API_INTERNAL_ERROR,
  ERROR_CODES.NETWORK_ERROR,
  ERROR_CODES.NETWORK_TIMEOUT,
  ERROR_CODES.CHARACTER_LOAD_FAILED
]);