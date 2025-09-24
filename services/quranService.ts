
import { Surah, SurahData, TafsirData } from '../types';

const API_BASE_URL = "https://api.alquran.cloud/v1";

export const fetchSurahs = async (): Promise<Surah[]> => {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};

export const fetchSurahData = async (surahNumber: number, reciterIdentifier: string): Promise<SurahData> => {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};

export const fetchTafsirData = async (surahNumber: number): Promise<TafsirData> => {
    // Using Tafsir Al-Muyassar
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/ar.muyassar`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};
