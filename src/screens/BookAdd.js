import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import Footer from '../components/Footer';

const BookAdd = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);


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
        // Submit without a profile picture
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
            title: 'Success',
            text: 'Book addes successfully',
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to register user',
        });
    }
};

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff]">
      <Menu />
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="p-6 min-h-[84.2vh]">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-3 items-center" onClick={() => navigate(-1)}>
              <IoIosArrowBack /> Powrót
            </button>
            <h1 className="text-xl font-bold">Dodaj Książkę</h1>
          </div>
          <div className="flex">
            <div className="w-2/5 bg-white shadow-md rounded p-6 h-fit">
              <div className="flex flex-col items-center mb-4">
                <div className='px-4'>
                    <div className='w-[240px] bg-[#ffffff] rounded-[4px]'>
                      <img className='w-[232px] object-cover rounded-[4px] mb-3' src={book?.profile_picture || '/img/blank-book-cover-over-png.png'} alt={book?.title} />
                    </div>
                  </div>
                <h3 className="text-xl font-bold">{book?.title}</h3>
                <p className="text-gray-600">Author: {book?.author}</p>
              </div>
            </div>
            <div className="w-3/5 bg-white shadow-md rounded p-8 ml-4">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-4">Informacje o książce</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Tytuł</label>
                    <input
                      type="text"
                      name="title"
                      value={book?.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Autor</label>
                    <input
                      type="text"
                      name="author"
                      value={book?.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      value={book?.isbn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Data Publikacji</label>
                    <input
                      type="date"
                      name="publicationDate"
                      value={book?.publicationDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Wydawca</label>
                    <input
                      type="text"
                      name="publisher"
                      value={book?.publisher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Gatunek</label>
                    <input
                      type="text"
                      name="genre"
                      value={book?.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Streszczenie</label>
                    <textarea
                      name="summary"
                      value={book?.summary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 h-32"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Liczba Stron</label>
                    <input
                      type="number"
                      name="pageCount"
                      value={book?.pageCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Okładka</label>
                    <input
                      name='profile_picture_p'
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 text-gray-700 rounded-lg border border-gray-300"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Zapisz zmiany
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

export default BookAdd;
