
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Surah, Reciter, SurahData, TafsirData, Ayah, TafsirAyah } from './types';
import { EGYPTIAN_RECITERS } from './constants';
import { fetchSurahs, fetchSurahData, fetchTafsirData } from './services/quranService';
import Header from './components/Header';
import SurahSelector from './components/SurahSelector';
import ReciterSelector from './components/ReciterSelector';
import LoadingSpinner from './components/LoadingSpinner';
import AyahView from './components/AyahView';
import TafsirModal from './components/TafsirModal';
import { PlayIcon, PauseIcon, SearchIcon } from './components/IconComponents';

const App: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<number>(1);
    const [selectedReciter, setSelectedReciter] = useState<Reciter>(EGYPTIAN_RECITERS[0]);
    const [surahData, setSurahData] = useState<SurahData | null>(null);
    const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // FIX: Replaced NodeJS.Timeout with number for browser compatibility as setInterval returns a number in browsers.
    const fadeIntervalRef = useRef<number | null>(null);
    const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
    const [isFullSurahPlaying, setIsFullSurahPlaying] = useState<boolean>(false);

    const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<{ ayah: Ayah, tafsir: TafsirAyah } | null>(null);

    const stopCurrentPlayback = useCallback((onStopped?: () => void) => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }

        const audio = audioRef.current;
        if (audio && audio.volume > 0.01) {
            const fadeDuration = 300;
            const fadeSteps = 20;
            const interval = fadeDuration / fadeSteps;
            let currentVolume = audio.volume;

            fadeIntervalRef.current = setInterval(() => {
                currentVolume -= (1 / fadeSteps);
                if (currentVolume > 0) {
                    try { audio.volume = Math.max(0, currentVolume); } catch (e) { /* Ignore errors on detached elements */ }
                } else {
                    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                    audio.pause();
                    if (audioRef.current === audio) {
                        audioRef.current = null;
                    }
                    setPlayingAyahNumber(null);
                    setIsFullSurahPlaying(false);
                    onStopped?.();
                }
            }, interval);
        } else {
            if (audio) audio.pause();
            audioRef.current = null;
            setPlayingAyahNumber(null);
            setIsFullSurahPlaying(false);
            onStopped?.();
        }
    }, []);
    
    const fadeInAndPlay = useCallback((audio: HTMLAudioElement) => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }
        
        audio.volume = 0;
        audio.play().catch(() => {
            setError("Could not play audio.");
            stopCurrentPlayback();
        });

        const fadeDuration = 400;
        const fadeSteps = 20;
        const interval = fadeDuration / fadeSteps;
        let currentVolume = 0;

        fadeIntervalRef.current = setInterval(() => {
            currentVolume += (1 / fadeSteps);
            if (currentVolume < 1) {
                try { audio.volume = Math.min(1, currentVolume); } catch (e) { /* Ignore errors */ }
            } else {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                try { audio.volume = 1; } catch(e) { /* Ignore errors */ }
            }
        }, interval);
    }, [stopCurrentPlayback]);


    useEffect(() => {
        const loadSurahs = async () => {
            try {
                const surahList = await fetchSurahs();
                setSurahs(surahList);
            } catch (err) {
                setError('Failed to load Surah list.');
            }
        };
        loadSurahs();
    }, []);

    const loadQuranData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSurahData(null);
        setTafsirData(null);
        setSearchQuery('');
        stopCurrentPlayback();

        try {
            const [surahResponse, tafsirResponse] = await Promise.all([
                fetchSurahData(selectedSurah, selectedReciter.identifier),
                fetchTafsirData(selectedSurah)
            ]);
            setSurahData(surahResponse);
            setTafsirData(tafsirResponse);
        } catch (err) {
            setError('Failed to load Surah data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedSurah, selectedReciter, stopCurrentPlayback]);

    useEffect(() => {
        loadQuranData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSurah, selectedReciter]);
    
    useEffect(() => {
      // Cleanup audio on component unmount
      return () => {
        stopCurrentPlayback();
      };
    }, [stopCurrentPlayback]);

    const handlePlayAudio = (audioUrl: string, ayahNumber: number) => {
        if (playingAyahNumber === ayahNumber && !isFullSurahPlaying) {
            stopCurrentPlayback();
            return;
        }
        
        const playNewAudio = () => {
            const newAudio = new Audio(audioUrl);
            audioRef.current = newAudio;
            setPlayingAyahNumber(ayahNumber);
            setIsFullSurahPlaying(false);

            newAudio.onended = () => stopCurrentPlayback();
            newAudio.onerror = () => {
                setError("An error occurred during audio playback.");
                stopCurrentPlayback();
            };
            
            fadeInAndPlay(newAudio);
        };

        stopCurrentPlayback(playNewAudio);
    };

    const handlePlayFullSurah = () => {
        if (isFullSurahPlaying) {
            stopCurrentPlayback();
            return;
        }

        const ayahs = surahData?.ayahs;
        if (!ayahs || ayahs.length === 0) return;
        
        const startPlaybackChain = () => {
            setIsFullSurahPlaying(true);
            setPlayingAyahNumber(null); 

            const playAyahAtIndex = (index: number) => {
                if (index >= ayahs.length) {
                    stopCurrentPlayback();
                    return;
                }

                // If playback was stopped manually, halt the chain.
                if (index > 0 && !audioRef.current) {
                    setIsFullSurahPlaying(false);
                    setPlayingAyahNumber(null);
                    return;
                }

                const ayahToPlay = ayahs[index];
                setPlayingAyahNumber(ayahToPlay.numberInSurah);
                const newAudio = new Audio(ayahToPlay.audio);
                audioRef.current = newAudio;
                
                newAudio.onended = () => {
                    playAyahAtIndex(index + 1);
                };
                newAudio.onerror = () => {
                    console.error("Error playing audio for ayah:", ayahToPlay.numberInSurah);
                    setError("An error occurred during audio playback.");
                    stopCurrentPlayback();
                }

                if (index === 0) {
                    fadeInAndPlay(newAudio);
                } else {
                    newAudio.volume = 1;
                    newAudio.play().catch(e => {
                        console.error("Playback failed for ayah:", ayahToPlay.numberInSurah, e);
                        setError("Playback was interrupted or failed to start.");
                        stopCurrentPlayback();
                    });
                }
            };

            playAyahAtIndex(0);
        };
        
        stopCurrentPlayback(startPlaybackChain);
    };

    const openTafsir = (ayah: Ayah) => {
        const tafsir = tafsirData?.ayahs.find(t => t.number === ayah.number);
        if (tafsir) {
            setSelectedTafsirAyah({ ayah, tafsir });
        }
    };

    const closeTafsir = () => {
        setSelectedTafsirAyah(null);
    };

    const filteredAyahs = useMemo(() => {
        if (!searchQuery.trim() || !surahData || !tafsirData) {
            return surahData?.ayahs || [];
        }

        const lowerCaseQuery = searchQuery.trim();

        return surahData.ayahs.filter(ayah => {
            const correspondingTafsir = tafsirData.ayahs.find(t => t.number === ayah.number);
            return correspondingTafsir?.text.includes(lowerCaseQuery);
        });

    }, [searchQuery, surahData, tafsirData]);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-4xl">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SurahSelector surahs={surahs} selectedSurah={selectedSurah} onChange={e => setSelectedSurah(Number(e.target.value))} />
                        <ReciterSelector reciters={EGYPTIAN_RECITERS} selectedReciter={selectedReciter} onChange={e => setSelectedReciter(EGYPTIAN_RECITERS.find(r => r.identifier === e.target.value) || EGYPTIAN_RECITERS[0])} />
                    </div>
                </div>

                {loading && <div className="flex justify-center items-center py-20"><LoadingSpinner /></div>}
                
                {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}

                {!loading && !error && surahData && (
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 sm:p-6">
                        <div className="mb-6 border-b-2 border-yellow-500/50 pb-4 flex justify-between items-center gap-4">
                             <button
                                onClick={handlePlayFullSurah}
                                className="p-3 rounded-full text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors flex-shrink-0"
                                aria-label={isFullSurahPlaying ? "إيقاف السورة" : "تشغيل السورة كاملة"}
                            >
                                {isFullSurahPlaying ? <PauseIcon className="w-7 h-7 text-yellow-600" /> : <PlayIcon className="w-7 h-7" />}
                            </button>
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 font-serif">{surahData.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400">{surahData.englishName} - {surahData.revelationType}</p>
                            </div>
                        </div>

                        <div className="my-6">
                            <div className="relative">
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <SearchIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="ابحث في التفسير..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-3 pr-10 bg-gray-100 dark:bg-gray-700/50 border border-transparent rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    aria-label="Search Tafsir"
                                />
                            </div>
                        </div>

                        {filteredAyahs.length > 0 ? (
                            <div className="space-y-6">
                                {filteredAyahs.map(ayah => (
                                    <AyahView 
                                        key={ayah.number}
                                        ayah={ayah}
                                        isPlaying={playingAyahNumber === ayah.numberInSurah}
                                        onPlay={() => handlePlayAudio(ayah.audio, ayah.numberInSurah)}
                                        onShowTafsir={() => openTafsir(ayah)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p>لا توجد نتائج بحث مطابقة.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            {selectedTafsirAyah && <TafsirModal tafsirInfo={selectedTafsirAyah} onClose={closeTafsir} />}
        </div>
    );
};

export default App;