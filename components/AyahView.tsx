
import React from 'react';
import { Ayah } from '../types';
import { PlayIcon, PauseIcon, BookOpenIcon } from './IconComponents';

interface AyahViewProps {
    ayah: Ayah;
    isPlaying: boolean;
    onPlay: () => void;
    onShowTafsir: () => void;
}

const AyahView: React.FC<AyahViewProps> = ({ ayah, isPlaying, onPlay, onShowTafsir }) => {
    return (
        <div className={`p-4 rounded-lg transition-all duration-300 ${isPlaying ? 'bg-yellow-50 dark:bg-yellow-900/40 ring-2 ring-yellow-500/50' : 'bg-transparent'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-shrink-0 flex items-center gap-4">
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{ayah.numberInSurah}</span>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={onPlay}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <PauseIcon className="w-6 h-6 text-yellow-600" /> : <PlayIcon className="w-6 h-6" />}
                        </button>
                        <button
                            onClick={onShowTafsir}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Show Tafsir"
                        >
                            <BookOpenIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <p className="flex-grow text-2xl md:text-3xl leading-loose text-right quran-text text-gray-800 dark:text-gray-100">
                    {ayah.text}
                </p>
            </div>
        </div>
    );
};

export default AyahView;
