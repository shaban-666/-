
import React from 'react';
import { Reciter } from '../types';

interface ReciterSelectorProps {
    reciters: Reciter[];
    selectedReciter: Reciter;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ReciterSelector: React.FC<ReciterSelectorProps> = ({ reciters, selectedReciter, onChange }) => {
    return (
        <div>
            <label htmlFor="reciter-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اختر القارئ</label>
            <select
                id="reciter-select"
                value={selectedReciter.identifier}
                onChange={onChange}
                className="block w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out"
            >
                {reciters.map(reciter => (
                    <option key={reciter.identifier} value={reciter.identifier}>
                        {reciter.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ReciterSelector;
