import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CiDark, CiLight } from 'react-icons/ci';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';



const Navbar = () => {
  const userData = useSelector((state) => state.user.value);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [cookies, , removeCookie] = useCookies(['userId']);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    removeCookie('userId', { path: '/' });
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="dark:text-white absolute w-full z-50 bg-slate-100 text-black dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center">
            <DisclosureButton
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              {/* Add any logo or branding here */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              className="bg-transparent dark:text-white text-black text-2xl p-1"
              onClick={() => setDarkMode(prev => !prev)}
            >
              {darkMode ? <CiLight /> : <CiDark />}
            </button>

            {/* Notification Bell */}
            <button
              className="relative rounded-full dark:bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex rounded-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                <img
                  alt="User avatar"
                  src={userData?.avatar || "/image/cloud_login.png"}
                  className="h-10 w-10 bg-transparent rounded-full"
                />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-slate-200 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                {cookies.userId ? (
                  <>
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </>
                ) : null}
                <MenuItem>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <hr />
      <DisclosurePanel className="text-center bg-slate-100 dark:bg-slate-800 text-violet-600">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link to="/home" className="block rounded-md px-3 py-2 text-base dark:hover:bg-violet-400 dark:hover:text-white font-medium hover:bg-violet-200 hover:border-2 hover:border-violet-800">
            Home
          </Link>
          <Link to="/chat" className="block rounded-md px-3 py-2 text-base font-medium dark:hover:bg-violet-400 dark:hover:text-white hover:bg-violet-200 hover:border-2 hover:border-violet-800">
            Chat
          </Link>
          <Link to="/public/social-view" className="block rounded-md px-3 py-2 text-base font-medium dark:hover:bg-violet-400 dark:hover:text-white hover:bg-violet-200 hover:border-2 hover:border-violet-800">
            Social View
          </Link>
          <Link to="/about" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-violet-200 dark:hover:bg-violet-400 dark:hover:text-white hover:border-2 hover:border-violet-800">
            About
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;