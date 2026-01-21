import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-vibe-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-vibe flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-ice-orange rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">VS</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-vibe-secondary text-lg leading-none">
                TCO-Rechner
              </h1>
              <p className="text-xs text-vibe-gray-500">
                by <span className="text-vibe-primary font-medium">vibe</span> moves you
              </p>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
            >
              So funktioniert's
            </a>
            <a
              href="#"
              className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
            >
              FAQ
            </a>
            <a
              href="#"
              className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
            >
              Über uns
            </a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-vibe-primary text-vibe-dark text-sm font-medium rounded-lg hover:bg-vibe-primary/90 transition-colors"
            >
              Beratung anfragen
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-vibe-gray-600 hover:text-vibe-secondary"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-vibe-gray-100"
          >
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
              >
                So funktioniert's
              </a>
              <a
                href="#"
                className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-sm font-medium text-vibe-gray-600 hover:text-vibe-primary transition-colors"
              >
                Über uns
              </a>
              <a
                href="#"
                className="px-4 py-2 bg-vibe-primary text-vibe-dark text-sm font-medium rounded-lg text-center"
              >
                Beratung anfragen
              </a>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};
