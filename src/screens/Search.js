import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { MdOutlineMail, MdLocalPhone, MdSearch, MdOutlineErrorOutline, MdClose, MdHistory } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const Search = () => {
  const { t } = useTranslation(); // Initialize translation function
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar element

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
              setSidebarOpen(false); // Close sidebar if click outside
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [sidebarRef]);

  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRecentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedRecentSearches);
  }, []);

  const fetchSearchResults = useCallback(async (searchQuery) => {
    if (searchQuery.trim() === '') return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const token = localStorage.getItem('token');
      const bookResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/booksearch?query=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const readerResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/usersearch?query=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (bookResponse.ok && readerResponse.ok) {
        const bookData = await bookResponse.json();
        const readerData = await readerResponse.json();
        setBooks(bookData);
        setReaders(readerData);
        updateRecentSearches(searchQuery, bookData.length + readerData.length);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('Failed to fetch search results'),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: t('An unexpected error occurred'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    if (queryParam) {
      setQuery(queryParam);
      fetchSearchResults(queryParam);
    }
  }, [location.search, fetchSearchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') {
      setShowEmptyMessage(true);
      return;
    }
    setShowEmptyMessage(false);
    navigate(`/search?query=${query}`);
  };

  const handleRecentSearchClick = (search) => {
    navigate(`/search?query=${search.search}`);
  };

  const updateRecentSearches = (newSearch, count) => {
    setRecentSearches((prev) => {
      const existingSearchIndex = prev.findIndex(({ search }) => search === newSearch);
      let updatedSearches;

      if (existingSearchIndex >= 0) {
        updatedSearches = [
          { search: newSearch, count },
          ...prev.filter(({ search }) => search !== newSearch),
        ];
      } else {
        updatedSearches = [
          { search: newSearch, count },
          ...prev,
        ];
      }

      updatedSearches = updatedSearches.slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  const removeRecentSearch = (searchToRemove) => {
    const updatedSearches = recentSearches.filter(({ search }) => search !== searchToRemove);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-gray-100 dark:bg-gray-800 dark:text-white">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="flex flex-col lg:flex-row p-6 min-h-[84vh] gap-5">
          <div className="w-full lg:w-3/4">
            <div className="xl:flex items-center mb-6 gap-4">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm xl:text-base mb-4 xl:mb-0"
                onClick={() => navigate(-1)}
              >
                <IoIosArrowBack /> {t('Back')}
              </button>
              <h1 className="text-xl font-bold">{t('Search')}</h1>
            </div>
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('Search for books or readers...')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring focus:border-red-300 dark:bg-gray-700 dark:text-gray-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring focus:bg-red-300"
                >
                  {t('Search')}
                </button>
              </form>
              {showEmptyMessage && (
                <p className="mt-2 text-red-600">{t('Please enter something to search!')}</p>
              )}
            </div>

            {/* Recent Searches under the search bar only on mobile */}
            <div className="lg:hidden">
              <RecentSearches
                recentSearches={recentSearches}
                onSearchClick={handleRecentSearchClick}
                onClear={clearRecentSearches}
                onRemove={removeRecentSearch}
                t={t}
              />
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Books Section */}
              <SearchSection
                title={t('Books')}
                items={books}
                isLoading={isLoading}
                hasSearched={hasSearched}
                emptyMessage={t('No results found')}
                loadingMessage={t('Start typing to see results...')}
                renderItem={(book) => <BookCard book={book} key={book.id} t={t} />}
              />

              {/* Readers Section */}
              <SearchSection
                title={t('Readers')}
                items={readers}
                isLoading={isLoading}
                hasSearched={hasSearched}
                emptyMessage={t('No results found')}
                loadingMessage={t('Start typing to see results...')}
                renderItem={(user) => <ReaderCard user={user} key={user.id} t={t} />}
              />
            </div>
          </div>
          {/* Recent Searches in the sidebar on desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <RecentSearches
              recentSearches={recentSearches}
              onSearchClick={handleRecentSearchClick}
              onClear={clearRecentSearches}
              onRemove={removeRecentSearch}
              t={t}
            />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

// SearchSection Component
const SearchSection = ({ title, items, isLoading, hasSearched, emptyMessage, loadingMessage, renderItem }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{title}</h2>
      <div className="bg-white dark:bg-primary p-6 rounded-lg shadow-md">
        {isLoading ? (
          <div className="flex flex-wrap">
            <Skeleton width="100%" height="150px" />
          </div>
        ) : !hasSearched ? (
          <div className="flex items-center justify-center flex-col">
            <MdSearch className="text-gray-400 dark:text-gray-500 text-6xl mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{loadingMessage}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center flex-col">
            <MdOutlineErrorOutline className="text-gray-400 dark:text-gray-500 text-6xl mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  );
};

// RecentSearches Component
const RecentSearches = ({ recentSearches, onSearchClick, onClear, onRemove }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{t('Recent Searches')}</h2>
      {recentSearches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <MdHistory className="text-gray-400 dark:text-gray-500 text-6xl mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">{t('Your search history will appear here')}</p>
        </div>
      ) : (
        <>
          <ul className="space-y-2 mb-[40px]">
            {recentSearches.map(({ search, count }, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="cursor-pointer text-red-600 hover:underline" onClick={() => onSearchClick({ search })}>
                  {search} ({count})
                </span>
                <MdClose
                  className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  onClick={() => onRemove(search)}
                />
              </li>
            ))}
          </ul>
          <button
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
            onClick={onClear}
          >
            {t('Clear All')}
          </button>
        </>
      )}
    </div>
  );
};

// BookCard Component
const BookCard = ({ book, t }) => (
  <div className="bg-white dark:bg-gray-700 shadow-md rounded transition-transform transform hover:scale-105">
    <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
    <div className='px-4'>
      <div className='w-[100px] bg-[#ffffff] dark:bg-gray-900 mr-auto mt-[-25%] rounded-[4px]'>
        <img className={book?.coverImage ? 'w-[100px] h-[159px] object-cover rounded-[4px]' : 'w-[100px] h-[159px] rounded-[4px]'} src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${book.title}`} />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-1 dark:text-white">{book.title}</h3>
      <p className="mb-1 flex gap-3 items-center dark:text-gray-300"><IoPerson /> {book.author}</p>
      <p className="flex gap-3 items-center dark:text-gray-300"><BsCalendarDate /> {new Date(book.publicationDate).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>
      <Link to={`/bookdetails/${book.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">{t('Details')} <RiExternalLinkFill /></Link>
    </div>
  </div>
);

// ReaderCard Component
const ReaderCard = ({ user, t }) => (
  <div key={user.id} className="bg-white dark:bg-gray-700 shadow-md rounded transition-transform transform hover:scale-105">
    <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
    <div className='w-[140px] rounded-full bg-[#ffffff] dark:bg-gray-900 mx-auto mt-[-25%] border-4 border-[#ef4444]'>
      <img className='w-[132px] h-[132px] object-cover rounded-full' src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt={`${user.first_name} ${user.last_name}`} />
    </div>

    <div className="p-4">
      <h3 className="text-2xl font-bold mb-1 dark:text-white">{user.first_name} {user.last_name}</h3>
      <p className="mb-1 flex gap-3 items-center dark:text-gray-300"><MdOutlineMail /> {user.email}</p>
      <p className="flex gap-3 items-center dark:text-gray-300"><MdLocalPhone /> {user.phone_number}</p>
      <Link to={`/readerdetails/${user.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">{t('Details')} <RiExternalLinkFill /></Link>
    </div>
  </div>
);

export default Search;
