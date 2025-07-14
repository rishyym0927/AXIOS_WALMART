'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  Home,
  Layout,
  BarChart3,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { id: 'landing', label: 'Landing', icon: Sparkles, href: '/landing' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: 'layout', label: 'Store Designer', icon: Layout, href: '/', active: true },
  { id: 'analytics', label: 'Analytics', icon: Home, href: '/analytics' },
  { id: 'help', label: 'Help', icon: HelpCircle, href: '/help' },
];

// Hardcoded data that will be replaced with backend calls later
const NOTIFICATIONS = [
  { id: '1', message: 'AI product placement suggestion generated', time: '2 min ago', unread: true },
  { id: '2', message: 'Store layout optimized', time: '1 hour ago', unread: false },
  { id: '3', message: 'New analytics report available', time: '3 hours ago', unread: false },
];

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifications = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left section - Logo and Navigation */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center ml-2 lg:ml-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg mr-3">
              <Layout size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Axios</h1>
              <p className="text-xs text-gray-500">Smart Retail Analytics</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center ml-8 space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} className="mr-2" />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right section - Search and Notifications */}
        <div className="flex items-center space-x-3">
          {/* Search bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, layouts, analytics..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-3 border-t border-gray-200 pt-3">
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} className="mr-3" />
                {item.label}
              </a>
            ))}
          </div>
          {/* Mobile search */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, layouts, analytics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
