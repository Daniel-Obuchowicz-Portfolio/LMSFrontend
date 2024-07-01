import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaHome } from 'react-icons/fa';
import { Transition } from '@headlessui/react';



const Dashboard = () => {
  const data = [
    { title: 'Intro to CSS', author: 'Adam' },
    {
      title: 'A Long and Winding',
      author: 'Adam',
    },
    { title: 'Intro to JavaScript', author: 'Chris' },
  ];
  const [user, setUser] = useState({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    address: '',
    profile_picture: '',
    is_active: false,
    created_at: '',
    updated_at: ''
  });
  const [sidebar, setSidebar] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
            setUser({
              id: data.id,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              date_of_birth: data.date_of_birth,
              gender: data.gender,
              phone_number: data.phone_number,
              address: data.address,
              profile_picture: data.profile_picture,
              is_active: data.is_active,
              created_at: data.created_at,
              updated_at: data.updated_at
            });
        } else {
          console.error('Failed to fetch user data');
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff]">
      {/* Sidebar */}
      <aside
        id="sidebar-menu"
        aria-expanded={sidebar}
        className={`transition-all duration-500 ease-in-out h-screen bg-white bg-cover bg-[url('https://wallpapers.com/images/hd/minimalist-phone-1440-x-2560-background-l50nd91jwe8kergc.jpg')]  shadow-sm w-64 ${sidebar ? 'w-64 md:-ms-64' : 'w-64 -ms-64 md:ms-0'
          }`}
      >
        <div className="h-full overflow-y-auto scrollbars">
          {/* Logo */}
          <div className="text-center p-5">
            <a href="#" className="relative">
              <img className="h-12 w-auto" src="/img/workflow-mark-indigo-600.svg" alt="Workflow" />
              <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">
                Taildash
              </h2>
            </a>
          </div>

          {/* Sidebar menu */}
          <ul
            id="side-menu"
            className="w-full float-none font-medium"
          >
            {/* Dropdown */}
            <li className="relative text-white">
              <a
                className={`block py-2.5 px-6 ${selected === 1 ? 'text-indigo-500 dark:text-indigo-400' : ''
                  } hover:text-indigo-500 dark:hover:text-indigo-400`}
                href="javascript:;"
                onClick={() => setSelected(selected !== 1 ? 1 : null)}
              >
                <div className="flex items-center justify-between">
                  <div>
              
                  <span className="flex items-center gap-3"> <FaHome className="" /> Dashboards</span>
                  </div>
                  {/* Caret */}
                <span className="inline-block float-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className={`transform transition duration-300 ${selected === 1 ? 'rotate-0' : 'ltr:-rotate-90 rtl:rotate-90'
                      }`}
                    width=".8rem"
                    height=".8rem"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </span>
                </div>
                
              </a>
              {/* Dropdown menu */}
              <Transition
                show={selected === 1}
                enter="transition-all duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                className="block rounded rounded-t-none top-full z-50 py-0.5 text-start mb-1 font-normal bg-[#0000004a]"
              >
                <ul>
                  <li className="relative">
                    <a
                      className="active block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index.html"
                    >
                      CMS
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-analytics.html"
                    >
                      Analytics
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-ecommerce.html"
                    >
                      Ecommerce
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-projects.html"
                    >
                      Projects
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-crm.html"
                    >
                      CRM
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-hosting.html"
                    >
                      Hosting
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-saas.html"
                    >
                      Saas
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-sales.html"
                    >
                      Sales
                    </a>
                  </li>
                  <li className="relative">
                    <a
                      className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                      href="index-marketing.html"
                    >
                      Marketing
                    </a>
                  </li>
                </ul>
              </Transition>
            </li>

            <li>
              <a
                className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400"
                href="calendar.html"
              >
                <span>Calendar</span>
              </a>
            </li>

            {/* More dropdowns similar to the one above */}
          </ul>

          {/* Banner */}
          <div className="px-4 box-banner">
            <div className="my-8 p-4 text-center bg-white rounded-lg">
              <h4 className="font-bold inline-block mb-2">Sales Report</h4>
              <div className="mb-3 text-sm">
                Monthly sales report is ready for download!
              </div>
              <div className="grid">
                <a
                  href="landing.html"
                  className="py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-100 bg-pink-500 border border-pink-500 hover:text-white hover:bg-pink-600 focus:bg-pink-600 focus:outline-none"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white">
          <div className="flex items-center space-x-4">
            <FaBars className="text-gray-700 text-2xl cursor-pointer" />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 rounded-lg border border-gray-300 pr-10"
              />
              <FaSearch className="absolute right-3 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
          <div class="hidden lg:flex items-center space-x-4">
            <img src={user.profile_picture} alt="Dr. Jose Simmons" class="w-10 h-10 rounded-full"/><div>
              <h2 class="text-sm font-semibold">{user.first_name} {user.last_name}</h2>
              <p class="text-xs text-gray-500">General Practitioner</p></div>
              <div class="flex items-center space-x-[12px]">
                <div class="border-l h-6"></div>
                <div class="flex gap-[12px]">
                  <img src="/img/settings_FILL0_wght300_GRAD0_opsz24.svg" alt="Settings" class="h-[20px]"/>
                  <img src="/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" alt="Three dots" class="h-[18px]"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Dashboard</h1>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Łączna ilość czytelników</h2>
              <p className="text-2xl mt-2">$53,000</p>
              <p className="text-green-500 mt-1">+55% since yesterday</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Łączna ilość księgozbioru</h2>
              <p className="text-2xl mt-2">2,300</p>
              <p className="text-green-500 mt-1">+3% since last week</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Łączna ilość wypożyczeń</h2>
              <p className="text-2xl mt-2">+3,462</p>
              <p className="text-red-500 mt-1">-2% since last quarter</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Szybka statystyka</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 bg-indigo-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="py-3 px-4 bg-indigo-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{item.title}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{item.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Sales Overview</h2>
              <div className="h-48 bg-gray-200 mt-4"></div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Get started with Argon</h2>
              <p className="mt-2">There's nothing I really wanted to do in life that I wasn't able to get good at.</p>
              <div className="h-48 bg-gray-200 mt-4"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
