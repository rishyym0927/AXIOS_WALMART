'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  Home,
  Layout,
  BarChart3,
  HelpCircle,
  Sparkles
} from 'lucide-react';

// Hardcoded data that will be replaced with backend calls later
const HARDCODED_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@retailco.com',
  avatar: null, // Will use initials for now
  role: 'Store Manager',
  store: 'Downtown Branch'
};

const NAVIGATION_ITEMS = [
  { id: 'landing', label: 'Landing', icon: Sparkles, href: '/landing' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: 'layout', label: 'Layout Designer', icon: Layout, href: '/', active: true },
  { id: 'help', label: 'Help', icon: HelpCircle, href: '/help' },
];

const NOTIFICATIONS = [
  { id: '1', message: 'Layout suggestion generated', time: '2 min ago', unread: true },
  { id: '2', message: 'Store dimensions updated', time: '1 hour ago', unread: false },
  { id: '3', message: 'New zone added to layout', time: '3 hours ago', unread: false },
];

interface NavbarProps {
  // Props for future backend integration
  user?: typeof HARDCODED_USER;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Navbar({ 
  user = HARDCODED_USER,
  onLogout,
  onProfileClick,
  onSettingsClick
}: NavbarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Hardcoded logout action - replace with actual logout logic
      console.log('Logout clicked - implement backend logout');
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // Hardcoded profile action - replace with actual profile navigation
      console.log('Profile clicked - implement profile navigation');
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      // Hardcoded settings action - replace with actual settings navigation
      console.log('Settings clicked - implement settings navigation');
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <Layout size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">StoreDesigner</h1>
              <p className="text-xs text-gray-500">Retail Layout Platform</p>
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

        {/* Right section - Search, Notifications, User */}
        <div className="flex items-center space-x-3">
          {/* Search bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search layouts, zones..."
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

          {/* User dropdown */}
          <div className="relative">
            {/* <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getUserInitials(user.name)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button> */}

            {/* User dropdown menu */}
            {/* {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.store}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-3" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )} */}
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
                placeholder="Search layouts, zones..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
