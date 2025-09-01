'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Home,
  ArrowLeft
} from 'lucide-react';

export interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  breadcrumbs?: Breadcrumb[];
  title?: string;
  subtitle?: string;
  cartItemCount?: number;
}

export default function Header({
  showBackButton = false,
  backButtonText = "Back to Shop",
  backButtonHref = "/",
  breadcrumbs = [],
  title,
  subtitle,
  cartItemCount = 0
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const focusTrapRef = useFocusTrap(isMobileMenuOpen);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeClose = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('focustrap:escape', handleEscapeClose);
    return () => document.removeEventListener('focustrap:escape', handleEscapeClose);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white" role="banner">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left Section - Logo & Back Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Back Button (if needed) */}
            {showBackButton && (
              <Link href={backButtonHref}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {backButtonText}
                </Button>
              </Link>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl">👕</span>
              <div>
                <div className="text-lg font-bold text-gray-900">FunnyTees</div>
              </div>
            </Link>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form role="search" className="relative w-full">
              <label htmlFor="desktop-search" className="sr-only">
                Search funny t-shirts
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                id="desktop-search"
                type="search"
                name="search"
                placeholder="Search funny t-shirts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Search for t-shirts by name, category, or description
              </div>
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-1">
            {/* Search Button (Mobile) */}
            <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open search">
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="sm" aria-label="User account menu">
              <User className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Shopping Cart */}
            <Button variant="ghost" size="sm" className="relative" aria-label={`Shopping cart ${cartItemCount > 0 ? `with ${cartItemCount} items` : '(empty)'}`}>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="main-navigation" className="hidden md:flex items-center space-x-6 py-2 border-t border-gray-100" role="navigation" aria-label="Main navigation">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <Link 
            href="/categories/tech" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Tech Tees
          </Link>
          <Link 
            href="/categories/coffee" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Coffee Humor
          </Link>
          <Link 
            href="/categories/office" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Office Life
          </Link>
          <Link 
            href="/categories/sarcastic" 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Sarcastic
          </Link>
        </nav>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="py-2 border-t border-gray-100">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    {breadcrumb.active ? (
                      <span className="font-medium text-gray-900">
                        {breadcrumb.label}
                      </span>
                    ) : (
                      <Link 
                        href={breadcrumb.href}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {breadcrumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* Page Title Section */}
        {(title || subtitle) && (
          <div className="py-4 border-t border-gray-100">
            {title && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div 
            className="fixed inset-0 z-50 bg-black/50" 
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
          <div 
            ref={focusTrapRef}
            id="mobile-menu"
            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm border-r bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div id="mobile-menu-title" className="sr-only">Mobile Menu</div>
            {/* Close button for screen readers and keyboard users */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4"
              aria-label="Close mobile menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl">👕</span>
              <div>
                <div className="text-lg font-bold text-gray-900">FunnyTees</div>
              </div>
            </div>
            
            {/* Mobile Search */}
            <form role="search" className="relative mb-6">
              <label htmlFor="mobile-search" className="sr-only">
                Search funny t-shirts
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                id="mobile-search"
                type="search"
                name="search"
                placeholder="Search t-shirts..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {showBackButton && (
                <Link 
                  href={backButtonHref}
                  className="flex items-center space-x-3 text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{backButtonText}</span>
                </Link>
              )}
              <Link 
                href="/"
                className="flex items-center space-x-3 text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMobileMenu}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                href="/categories/tech"
                className="block text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMobileMenu}
              >
                Tech Tees
              </Link>
              <Link 
                href="/categories/coffee"
                className="block text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMobileMenu}
              >
                Coffee Humor
              </Link>
              <Link 
                href="/categories/office"
                className="block text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMobileMenu}
              >
                Office Life
              </Link>
              <Link 
                href="/categories/sarcastic"
                className="block text-sm font-medium p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={toggleMobileMenu}
              >
                Sarcastic
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}