'use client';

import { useState, useEffect } from 'react';
import { AppError } from '@/types/error';

interface ErrorToastProps {
  error: AppError | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ErrorToast({ 
  error, 
  onClose, 
  autoClose = true, 
  autoCloseDelay = 5000 
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [error, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // アニメーション完了を待つ
  };

  if (!error) return null;

  const getSeverityStyles = () => {
    switch (error.severity) {
      case 'critical':
        return 'bg-red-600 border-red-700 text-white';
      case 'high':
        return 'bg-red-500 border-red-600 text-white';
      case 'medium':
        return 'bg-orange-500 border-orange-600 text-white';
      case 'low':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getSeverityIcon = () => {
    switch (error.severity) {
      case 'critical':
      case 'high':
        return '⚠️';
      case 'medium':
        return '🔔';
      case 'low':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border-2
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${getSeverityStyles()}
    `}>
      <div className="flex items-start space-x-3">
        <div className="text-xl flex-shrink-0">
          {getSeverityIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm mb-1">
            エラーが発生しました
          </div>
          <div className="text-sm leading-relaxed">
            {error.message}
          </div>
          {error.code && (
            <div className="text-xs mt-2 opacity-75">
              エラーコード: {error.code}
            </div>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white hover:text-gray-300 transition-colors"
          aria-label="エラー通知を閉じる"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}