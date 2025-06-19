'use client';

import React, { Component, ReactNode } from 'react';
import { AppError, ERROR_CODES } from '@/types/error';
import { ErrorFactory, logError } from '@/lib/error-utils';

interface Props {
  children: ReactNode;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = ErrorFactory.createAppError(
      ERROR_CODES.INTERNAL_ERROR,
      error.message,
      'high',
      { stack: error.stack }
    );

    return {
      hasError: true,
      error: appError
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = ErrorFactory.createAppError(
      ERROR_CODES.INTERNAL_ERROR,
      error.message,
      'high',
      { 
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }
    );

    logError(appError, 'ErrorBoundary');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              予期しないエラーが発生しました
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {this.state.error.message}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                再試行
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                ページを再読み込み
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <details className="text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  技術的な詳細
                </summary>
                <div className="mt-2 text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded">
                  <div>エラーコード: {this.state.error.code}</div>
                  <div>タイムスタンプ: {this.state.error.timestamp.toISOString()}</div>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}