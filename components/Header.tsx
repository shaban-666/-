
import React from 'react';
import { BookOpenIcon } from './IconComponents';

const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-center space-x-3 space-x-reverse">
                <BookOpenIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                    القرآن الكريم - قراء مصر
                </h1>
            </div>
        </header>
    );
};

export default Header;
