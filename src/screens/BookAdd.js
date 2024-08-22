import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const BookAdd = () => {
  const { t } = useTranslation('books');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationDate: '',
    publisher: '',
    genre: '',
    summary: '',
    pageCount: '',
    profile_picture: ''
  });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
              setSidebarOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [sidebarRef]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBook((prevBook) => ({ ...prevBook, profile_picture: URL.createObjectURL(file) }));
      setFile(file);
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

  const submitBookData = async (bookData, token) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t('Success'),
        text: t('Book added successfully'),
      });
      navigate('/books');  // Redirect after successful save
    } else {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: t('Failed to add book'),
      });
    }
  };

  const fetchBookData = async (isbn) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const bookData = data.items[0].volumeInfo;
        
        // Handle the published date
        let publicationDate = bookData.publishedDate || '';
        if (publicationDate.length === 4) {  // Year only
          publicationDate = `${publicationDate}-01-01`;  // Default to January 1st
        }
  
        let coverImage = '';
        if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
          // Use the URL directly from Google Books API
          coverImage = bookData.imageLinks.thumbnail;
        }
  
        setBook({
          title: bookData.title || '',
          author: bookData.authors ? bookData.authors.join(', ') : '',
          isbn,
          publicationDate,
          publisher: bookData.publisher || '',
          genre: bookData.categories ? bookData.categories.join(', ') : '',
          summary: bookData.description || '',
          pageCount: bookData.pageCount || '',
          profile_picture: coverImage || '/img/blank-book-cover-over-png.png', // Use the image URL directly
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: t('Not Found'),
          text: t('No data found for the given ISBN'),
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: t('Failed to fetch data from the API'),
      });
    }
  };

  const handleFillData = () => {
    Swal.fire({
      title: t('Enter ISBN'),
      input: 'text',
      inputPlaceholder: t('Enter ISBN number'),
      showCancelButton: true,
      confirmButtonText: t('Fetch Data'),
      cancelButtonText: t('Cancel'),
      preConfirm: (isbn) => {
        if (!isbn) {
          Swal.showValidationMessage(t('ISBN is required'));
          return;
        }
        return isbn;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        fetchBookData(result.value);
      }
    });
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
              <IoIosArrowBack /> {t('Back')}
            </button>
            <h1 className="text-xl font-bold">{t('Add Book')}</h1>
          </div>
          <div className="flex flex-col xl:flex-row">
            <div className="w-full xl:w-2/5 bg-white dark:bg-primary shadow-md rounded p-6 h-fit mb-4 xl:mb-0">
              <div className="flex flex-col items-center mb-4">
                <div className='px-4'>
                  <div className='w-[240px] bg-[#ffffff] dark:bg-gray-700 rounded-[4px]'>
                    <img className='w-[232px] object-cover rounded-[4px] mb-3' src={book?.profile_picture || '/img/blank-book-cover-over-png.png'} alt={book?.title} />
                  </div>
                </div>
                <h3 className="text-xl font-bold dark:text-white">{book?.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('Author')}: {book?.author}</p>
              </div>
            </div>
            <div className="w-full xl:w-3/5 bg-white dark:bg-primary shadow-md rounded p-8 xl:ml-4">
              <div className="mx-auto flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('Book Information')}</h2>
                <button
                  type="button"
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm xl:text-base mb-4 xl:mb-0"
                  onClick={handleFillData}
                >
                  {t('Fill Data')}
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Title')}</label>
                  <input
                    type="text"
                    name="title"
                    value={book?.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Author')}</label>
                  <input
                    type="text"
                    name="author"
                    value={book?.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('ISBN')}</label>
                  <input
                    type="text"
                    name="isbn"
                    value={book?.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Publication Date')}</label>
                  <input
                    type="date"
                    name="publicationDate"
                    value={book?.publicationDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Publisher')}</label>
                  <input
                    type="text"
                    name="publisher"
                    value={book?.publisher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Genre')}</label>
                  <input
                    type="text"
                    name="genre"
                    value={book?.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Summary')}</label>
                  <textarea
                    name="summary"
                    value={book?.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-32"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Page Count')}</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={book?.pageCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">{t('Cover')}</label>
                  <input
                    name='profile_picture_p'
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  {t('Save Changes')}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default BookAdd;
