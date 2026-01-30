import React from 'react';

export const Topbar: React.FC = () => {
    return (
        <div className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-600 flex items-center justify-between px-6">
            <div className="text-gray-600 dark:text-gray-300 font-medium">Welcome back!</div>
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    U
                </div>
            </div>
        </div>
    );
};
