import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import Footer from '../components/Footer';
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const BookDetails = () => {
  const { t } = useTranslation('bookdetails'); // Initialize useTranslation hook
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
  
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'), // Use t for translations
          text: t('Failed to fetch book data'), // Use t for translations
        });
      }
    };

    const fetchBorrowings = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowings/book/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBorrowings(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'), // Use t for translations
          text: t('Failed to fetch borrowings data'), // Use t for translations
        });
      }
    };

    fetchBook();
    fetchBorrowings();
  }, [id, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBook((prevBook) => ({ ...prevBook, coverImage: URL.createObjectURL(file) }));
      setFile(file);
    }
  };

  const submitBookData = async (updatedBook, token) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}/put`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedBook)
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t('Success'), // Use t for translations
        text: t('Book updated successfully'), // Use t for translations
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: t('Error'), // Use t for translations
        text: t('Failed to update book'), // Use t for translations
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const updatedBook = { ...book, profile_picture_p: reader.result };
        await submitBookData(updatedBook, token);
      };
      reader.onerror = error => console.log('Error: ', error);
    } else {
      await submitBookData(book, token);
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] dark:bg-gray-800 dark:text-white">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="xl:flex items-center mb-6 gap-4">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm xl:text-base mb-4 xl:mb-0"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack /> {t('Back')} {/* Use t for translations */}
            </button>
            <h1 className="text-xl font-bold">{t('Edit Book')}</h1> {/* Use t for translations */}
          </div>
          <div className="xl:flex">
            <div className="xl:w-2/5">
              <div className="bg-white dark:bg-primary shadow-md rounded p-6 h-fit">
                <h2 className="text-xl font-bold mb-4 text-left dark:text-white">{t('Quick Info')}</h2> {/* Use t for translations */}
                <div className="flex flex-col items-center mb-4">
                  <div className='px-4'>
                    <div className='w-[140px] bg-[#ffffff] dark:bg-gray-700 rounded-[4px]'>
                      <img className='w-[132px] object-cover rounded-[4px] mb-3' src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={book?.title} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">{book?.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t('Author')}: {book?.author}</p> {/* Use t for translations */}
                </div>
              </div>
              <div className="bg-white dark:bg-primary shadow-md rounded p-6 h-fit mt-5">
                <h2 className="text-xl font-bold text-left dark:text-white">{t('Recent Borrowings')}</h2> {/* Use t for translations */}
                {borrowings.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mt-8">
                    <FaInfoCircle className="mr-2" />
                    <span>{t('No data available')}</span> {/* Use t for translations */}
                  </div>
                ) : (
                  <div className="min-w-full">
                    {borrowings.map(borrowing => (
                      <div key={borrowing.id} className="grid grid-cols-1 xl:grid-cols-2 gap-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-6">
                          <img
                            src={borrowing.user.profile_picture}
                            alt={`${borrowing.user.first_name}'s profile`}
                            className="rounded-full w-16 h-16 border border-gray-300 dark:border-gray-600 object-cover shadow-lg"
                          />
                          <div>
                            <div className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                              {borrowing.user.first_name} {borrowing.user.last_name}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-400">
                              {borrowing.user.email}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-400">
                              {borrowing.user.phone_number}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center bg-blue-100 dark:bg-blue-800 p-4 rounded-lg shadow-inner">
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium text-blue-600 dark:text-blue-400">{t('Borrow Date')}:</span> {new Date(borrowing.borrowing_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium text-blue-600 dark:text-blue-400">{t('Return Date')}:</span> {new Date(borrowing.realreturndate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="xl:w-3/5 bg-white dark:bg-primary shadow-md rounded p-8 xl:ml-4 h-fit mt-4 xl:mt-0">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('Book Information')}</h2> {/* Use t for translations */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Title')}</label> {/* Use t for translations */}
                    <input
                      type="text"
                      name="title"
                      value={book?.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Author')}</label> {/* Use t for translations */}
                    <input
                      type="text"
                      name="author"
                      value={book?.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('ISBN')}</label> {/* Use t for translations */}
                    <input
                      type="text"
                      name="isbn"
                      value={book?.isbn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Publication Date')}</label> {/* Use t for translations */}
                    <input
                      type="date"
                      name="publicationDate"
                      value={book?.publicationDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Publisher')}</label> {/* Use t for translations */}
                    <input
                      type="text"
                      name="publisher"
                      value={book?.publisher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Genre')}</label> {/* Use t for translations */}
                    <input
                      type="text"
                      name="genre"
                      value={book?.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Summary')}</label> {/* Use t for translations */}
                    <textarea
                      name="summary"
                      value={book?.summary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-32"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Page Count')}</label> {/* Use t for translations */}
                    <input
                      type="number"
                      name="pageCount"
                      value={book?.pageCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Cover')}</label> {/* Use t for translations */}
                    <input
                      name='profile_picture_p'
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    {t('Save changes')} {/* Use t for translations */}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default BookDetails;
