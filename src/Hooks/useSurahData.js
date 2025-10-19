import { useState, useEffect } from 'react';
import quranData from '../Data/quran.json';

export const useSurahData = keysToInclude => {
  const [surahList, setSurahList] = useState([]);

  useEffect(() => {
    // Pass an array of strings like ['id', 'name', 'transliteration', 'translation', 'type', 'total_verses', 'bismillah_pre', 'verse_timings', 'verses']
    if (keysToInclude && keysToInclude.length > 0) {
      const processedData = quranData.map(surah => {
        return keysToInclude.reduce((newObj, key) => {
          if (Object.prototype.hasOwnProperty.call(surah, key)) {
            newObj[key] = surah[key];
          }
          return newObj;
        }, {});
      });
      setSurahList(processedData);
    } else {
      setSurahList(quranData);
    }
  }, [keysToInclude]);

  return surahList;
};
