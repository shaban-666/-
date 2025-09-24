
export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface Reciter {
    name: string;
    identifier: string;
}

export interface Ayah {
    number: number;
    audio: string;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface SurahData {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
}

export interface TafsirAyah {
    number: number;
    text: string;
}

export interface TafsirData {
    number: number;
    name: string;
    ayahs: TafsirAyah[];
}
