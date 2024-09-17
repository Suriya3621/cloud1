import React, { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { CiSettings } from 'react-icons/ci';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CgLogOut } from "react-icons/cg";

const Navbar = () => {
  const userData = useSelector((state) => state.user.value);
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(['userId']);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('userId', { path: '/' });
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="nav-index dark:text-white absolute w-full z-40 bg-slate-100 text-black dark:bg-gray-800">
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
              <MenuItems className="absolute right-0 z-30 mt-2 w-48 origin-top-right bg-slate-200 dark:text-white dark:bg-slate-700 rounded-md  py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                {cookies.userId ? (
                  <>
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-sm  hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 float-left size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
  Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        <CgLogOut className="float-left size-5"/>Sign out
                      </button>
                    </MenuItem>
                  </>
                ) : null}
                <hr />
                <MenuItem>
                  <Link to="/settings" className="block px-4 py-2 text-sm  hover:bg-gray-100">
                   <CiSettings className="float-left size-6"/> Settings
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <hr />
      <DisclosurePanel className="text-center bg-slate-100 dark:bg-slate-800 dark:text-white text-violet-600">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link to="/home" className="block rounded-md px-3 py-2 text-base dark:hover:bg-violet-400 dark:hover:text-white font-medium hover:bg-violet-200 hover:border-2 hover:border-violet-800">
            Home
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