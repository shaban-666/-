
import React from 'react';
import { Ayah, TafsirAyah } from '../types';
import { CloseIcon } from './IconComponents';

interface TafsirModalProps {
    tafsirInfo: {
        ayah: Ayah;
        tafsir: TafsirAyah;
    };
    onClose: () => void;
}

const TafsirModal: React.FC<TafsirModalProps> = ({ tafsirInfo, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-auto p-6 md:p-8 transform transition-all duration-300 scale-95 hover:scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b-2 border-yellow-500/50 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">تفسير الآية رقم {tafsirInfo.ayah.numberInSurah}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                    </button>
                </div>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-gray-700 dark:text-gray-200">الآية:</h4>
                        <p className="text-xl quran-text bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">{tafsirInfo.ayah.text}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-gray-700 dark:text-gray-200">التفسير الميسر:</h4>
                        <p className="text-lg tafsir-text leading-relaxed text-gray-600 dark:text-gray-300">{tafsirInfo.tafsir.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TafsirModal;
