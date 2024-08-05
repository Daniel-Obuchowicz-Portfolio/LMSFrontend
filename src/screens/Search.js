import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { MdOutlineMail, MdLocalPhone, MdSearch, MdOutlineErrorOutline, MdClose, MdHistory } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const Search = () => {
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
    // Load recent searches from localStorage
    const storedRecentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedRecentSearches);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    if (queryParam) {
      setQuery(queryParam);
      fetchSearchResults(queryParam);
    }
  }, [location.search]);

  const fetchSearchResults = async (searchQuery) => {
    if (searchQuery.trim() === '') return;

    setIsLoading(true);
    setHasSearched(true); // Mark that a search has been initiated
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
          title: 'Błąd',
          text: 'Nie udało się pobrać wyników wyszukiwania',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Błąd',
        text: 'Wystąpił niespodziewany błąd',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecentSearches = (newSearch, count) => {
    setRecentSearches((prev) => {
      // Sprawdź, czy wyszukiwanie już istnieje w historii
      const existingSearchIndex = prev.findIndex(({ search }) => search === newSearch);
      let updatedSearches;
      
      if (existingSearchIndex >= 0) {
        // Jeśli istnieje, przenieś na początek listy
        updatedSearches = [
          { search: newSearch, count },
          ...prev.filter(({ search }) => search !== newSearch),
        ];
      } else {
        // Jeśli nie istnieje, dodaj na początek listy
        updatedSearches = [
          { search: newSearch, count },
          ...prev,
        ];
      }
  
      // Ogranicz liczbę ostatnich wyszukiwań do 5
      updatedSearches = updatedSearches.slice(0, 5);
  
      // Zapisz w localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };
  

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
    <div className="min-h-screen flex font-montserrat bg-gray-100">
      <Menu />
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="flex p-6 gap-6 min-h-[84vh]">
          {/* Main Content */}
          <div className="w-3/4">
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Wyszukaj książki lub czytelników..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:border-red-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring focus:bg-red-300"
                >
                  Szukaj
                </button>
              </form>
              {showEmptyMessage && (
                <p className="mt-2 text-red-600">Proszę wpisać coś, aby wyszukać!</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-8">
              {/* Books Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Książki</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {isLoading ? (
                    <div className="flex flex-wrap">
                      <Skeleton width="100%" height="150px" />
                    </div>
                  ) : !hasSearched ? (
                    <div className="flex items-center justify-center flex-col">
                      <MdSearch className="text-gray-400 text-6xl mb-4" />
                      <p className="text-gray-500">Zacznij pisać, aby wyświetlić wyniki...</p>
                    </div>
                  ) : books.length === 0 ? (
                    <div className="flex items-center justify-center flex-col">
                      <MdOutlineErrorOutline className="text-gray-400 text-6xl mb-4" />
                      <p className="text-gray-500">Brak wyników</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {books.map((book) => (
                        <div key={book.id} className="bg-white shadow-md rounded transition-transform transform hover:scale-105">
                          <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
                          <div className='px-4'>
                            <div className='w-[100px] bg-[#ffffff] mr-auto mt-[-25%] rounded-[4px]'>
                              <img className={book?.coverImage ? 'w-[100px] h-[159px] object-cover rounded-[4px]' : 'w-[100px] h-[159px] rounded-[4px]'} src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${book.title}`} />
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-2xl font-bold mb-1">{book.title}</h3>
                            <p className="mb-1 flex gap-3 items-center"><IoPerson /> {book.author}</p>
                            <p className="flex gap-3 items-center"><BsCalendarDate /> {new Date(book.publicationDate).toLocaleDateString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                            <Link to={`/bookdetails/${book.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Szczegóły <RiExternalLinkFill /></Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Readers Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Czytelnicy</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {isLoading ? (
                    <div className="flex flex-wrap">
                      <Skeleton width="100%" height="150px" />
                    </div>
                  ) : !hasSearched ? (
                    <div className="flex items-center justify-center flex-col">
                      <MdSearch className="text-gray-400 text-6xl mb-4" />
                      <p className="text-gray-500">Zacznij pisać, aby wyświetlić wyniki...</p>
                    </div>
                  ) : readers.length === 0 ? (
                    <div className="flex items-center justify-center flex-col">
                      <MdOutlineErrorOutline className="text-gray-400 text-6xl mb-4" />
                      <p className="text-gray-500">Brak wyników</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {readers.map((user) => (
                        <div key={user.id} className="bg-white shadow-md rounded transition-transform transform hover:scale-105">
                          <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
                          <div className='w-[140px] rounded-full bg-[#ffffff] mx-auto mt-[-25%] border-4 border-[#ef4444]'>
                            <img className='w-[132px] h-[132px] object-cover rounded-full' src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt={`${user.first_name} ${user.last_name}`} />
                          </div>

                          <div className="p-4">
                            <h3 className="text-2xl font-bold mb-1">{user.first_name} {user.last_name}</h3>
                            <p className="mb-1 flex gap-3 items-center"><MdOutlineMail /> {user.email}</p>
                            <p className="flex gap-3 items-center"><MdLocalPhone /> {user.phone_number}</p>
                            <Link to={`/readerdetails/${user.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Szczegóły <RiExternalLinkFill /> </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Recent Searches */}
          <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md relative h-fit pb-8 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ostatnie wyszukiwania</h2>
            {recentSearches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <MdHistory className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-center">Twoja historia wyszukiwania pojawi się tutaj</p>
              </div>
            ) : (
              <>
                <ul className="space-y-2 mb-[40px]">
                  {recentSearches.map(({ search, count }, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="cursor-pointer text-red-600 hover:underline" onClick={() => handleRecentSearchClick({ search })}>
                        {search} ({count})
                      </span>
                      <MdClose
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => removeRecentSearch(search)}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 absolute bottom-[1rem] w-[92%] "
                  onClick={clearRecentSearches}
                >
                  Wyczyść wszystko
                </button>
              </>
            )}
          </aside>

        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Search;
