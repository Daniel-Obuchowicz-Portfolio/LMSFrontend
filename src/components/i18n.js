import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import settingsEn from './locales/en/settings.json';
import dashboardEn from './locales/en/dashboard.json';
import readersEn from './locales/en/readers.json';
import booksEn from './locales/en/books.json';
import delaysEn from './locales/en/delays.json';
import readerdetailsEn from './locales/en/readerdetails.json';
import bookdetailsEn from './locales/en/bookdetails.json'; // Import for Bookdetails

import commonPl from './locales/pl/common.json';
import settingsPl from './locales/pl/settings.json';
import dashboardPl from './locales/pl/dashboard.json';
import readersPl from './locales/pl/readers.json';
import booksPl from './locales/pl/books.json';
import delaysPl from './locales/pl/delays.json';
import readerdetailsPl from './locales/pl/readerdetails.json';
import bookdetailsPl from './locales/pl/bookdetails.json'; // Import for Bookdetails

import commonEs from './locales/es/common.json';
import settingsEs from './locales/es/settings.json';
import dashboardEs from './locales/es/dashboard.json';
import readersEs from './locales/es/readers.json';
import booksEs from './locales/es/books.json';
import delaysEs from './locales/es/delays.json';
import readerdetailsEs from './locales/es/readerdetails.json';
import bookdetailsEs from './locales/es/bookdetails.json'; // Import for Bookdetails

import commonFr from './locales/fr/common.json';
import settingsFr from './locales/fr/settings.json';
import dashboardFr from './locales/fr/dashboard.json';
import readersFr from './locales/fr/readers.json';
import booksFr from './locales/fr/books.json';
import delaysFr from './locales/fr/delays.json';
import readerdetailsFr from './locales/fr/readerdetails.json';
import bookdetailsFr from './locales/fr/bookdetails.json'; // Import for Bookdetails

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      settings: settingsEn,
      dashboard: dashboardEn,
      readers: readersEn,
      books: booksEn,
      delays: delaysEn,
      readerdetails: readerdetailsEn,
      bookdetails: bookdetailsEn, // Add Bookdetails namespace
    },
    pl: {
      common: commonPl,
      settings: settingsPl,
      dashboard: dashboardPl,
      readers: readersPl,
      books: booksPl,
      delays: delaysPl,
      readerdetails: readerdetailsPl,
      bookdetails: bookdetailsPl, // Add Bookdetails namespace
    },
    es: {
      common: commonEs,
      settings: settingsEs,
      dashboard: dashboardEs,
      readers: readersEs,
      books: booksEs,
      delays: delaysEs,
      readerdetails: readerdetailsEs,
      bookdetails: bookdetailsEs, // Add Bookdetails namespace
    },
    fr: {
      common: commonFr,
      settings: settingsFr,
      dashboard: dashboardFr,
      readers: readersFr,
      books: booksFr,
      delays: delaysFr,
      readerdetails: readerdetailsFr,
      bookdetails: bookdetailsFr, // Add Bookdetails namespace
    },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  ns: ['common', 'settings', 'dashboard', 'readers', 'books', 'delays', 'readerdetails', 'bookdetails'], // Add 'bookdetails' to namespaces
  defaultNS: 'common',
});

export default i18n;
