// @ts-nocheck
"use client"
import React, { useState } from 'react'
import { Menu, Moon, Search, Settings, Sun, LogOut, User, PlusSquare } from "lucide-react"
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsDarkMode, setIsSiderbarCollapsed } from '@/app/reduxstate'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import ModalNewProject from '@/app/projects/ModalNewPro'
import Header from './Header'

const Navbar = () => {

  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false)

  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  const dispatch = useAppDispatch();
  const isSiderbarCollapsed = useAppSelector(
    (state) => state.global.isSiderbarCollapsed
  )

  const handleSignOut = () => {

    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
    }
    signOut({ callbackUrl: '/login' });
  }

  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 dark:bg-black w-auto '>
      <div className='flex items-center gap-5'>
        {!isSiderbarCollapsed ? null : (
          <button onClick={() => dispatch(setIsSiderbarCollapsed(!isSiderbarCollapsed))}>
            <Menu className='size-8 dark:text-white hover:text-emerald-500 hover:dark:text-emerald-400' />
          </button>
        )}
        {/* <div className='relative flex flex-row h-min w-[200px]'> */}
        <Link href='/'>
          <Image src="/logo.webp" alt="logo" width={50} height={50} className='rounded' />
        </Link>
        <Link href='/'>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            Flicker
          </div>
        </Link>
        {/* </div> */}
      </div>
      {/* icons */}
      <div className='flex gap-5 items-center'>
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />
        <button
          className="flex items-center px-3 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-300"
          onClick={() => setIsModalNewProjectOpen(true)}
        >
          <PlusSquare className="mr-2 size-5" /> New Board
        </button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        // className={theme === "dark" ? `roudended p-2 ` : `rounded p-2 hover:bg-gray-100 `}
        >
          {theme === "dark" ? (
            <Sun className='size-6 cursor-pointer dark:text-white hover:text-emerald-500 hover:dark:text-emerald-400' />)
            : (<Moon className='size-6 cursor-pointer dark:text-white hover:text-emerald-500 hover:dark:text-emerald-400' />)
          }
        </button>
        <Link href="/settings"
          className={theme === "dark" ? `size-min roudended p-2 ` : `size-min rounded p-2 hover:bg-gray-100`} >
          <Settings className='size-6 cursor-pointer dark:text-white hover:text-emerald-500 hover:dark:text-emerald-400'></Settings>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <User className="size-8 p-1 rounded-full bg-emerald-500 text-white" />
              )}
              <span className="hidden md:block text-sm font-medium dark:text-white">
                {session.user?.name}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Sign out"
            >
              <LogOut className="size-5 cursor-pointer dark:text-white hover:text-red-500 hover:dark:text-red-400" />
            </button>
          </div>
        ) : (
          <div className='flex'>
            <Link
              href="/login"
              className="flex items-center px-3 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-300"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
      {/* <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block">hidsfcds</div> */}
    </div>

  )
}

export default Navbar
