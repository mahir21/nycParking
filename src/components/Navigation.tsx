'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              🚗 NYC Parking Lookup
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <span className="text-gray-700 text-sm">
                  {session.user.firstName || session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}