
import React from 'react';
import { Surah } from '../types';

interface SurahSelectorProps {
    surahs: Surah[];
    selectedSurah: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SurahSelector: React.FC<SurahSelectorProps> = ({ surahs, selectedSurah, onChange }) => {
    return (
        <div>
            <label htmlFor="surah-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اختر السورة</label>
            <select
                id="surah-select"
                value={selectedSurah}
                onChange={onChange}
                className="block w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out"
            >
                {surahs.map(surah => (
                    <option key={surah.number} value={surah.number}>
                        {surah.number}. {surah.name} ({surah.englishName})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SurahSelector;
