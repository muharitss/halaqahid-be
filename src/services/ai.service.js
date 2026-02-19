"use strict";
/**
 * AI Service - Placeholder untuk fitur Mutasyabihat
 *
 * Saat ini mengembalikan array kosong karena belum ada database Quran.
 * Akan diimplementasikan dengan AI/NLP untuk menemukan ayat yang mirip.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTajwid = exports.findSimilarVerses = void 0;
/**
 * Mencari ayat-ayat yang mirip (mutasyabihat) berdasarkan teks input
 *
 * @param text - Teks ayat atau potongan ayat untuk dicari kesamaannya
 * @returns Array of SimilarVerse - Daftar ayat yang mirip (saat ini kosong/placeholder)
 */
const findSimilarVerses = async (text) => {
    // TODO: Implementasi dengan database Quran dan algoritma pencarian
    // Opsi implementasi:
    // 1. Fuzzy string matching dengan database ayat Quran
    // 2. Integrasi dengan AI/NLP model untuk semantic similarity
    // 3. Database mutasyabihat yang sudah dikurasi
    console.log(`[AI Service] findSimilarVerses called with: ${text}`);
    // Placeholder: return empty array
    // Frontend harus handle case kosong ini
    return [];
};
exports.findSimilarVerses = findSimilarVerses;
/**
 * Placeholder untuk analisis tajwid (future feature)
 */
const analyzeTajwid = async (_text) => {
    // Placeholder untuk fitur analisis tajwid
    return [];
};
exports.analyzeTajwid = analyzeTajwid;
