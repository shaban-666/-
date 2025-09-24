
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">جار التحميل...</p>
        </div>
    );
};

export default LoadingSpinner;
