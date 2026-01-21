import React from 'react';
import { Zap, Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-vibe-secondary text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-vibe-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-vibe-dark" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">TCO-Rechner</h3>
                <p className="text-xs text-vibe-gray-400">by vibe moves you</p>
              </div>
            </div>
            <p className="text-sm text-vibe-gray-400 leading-relaxed">
              Transparenter Kostenvergleich zwischen E-Auto und Verbrenner. 
              Datenbasiert, neutral, verständlich.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Schnellzugriff</h4>
            <ul className="space-y-2 text-sm text-vibe-gray-400">
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors">
                  TCO-Rechner starten
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors">
                  So funktioniert's
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors">
                  Häufige Fragen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors">
                  Methodik & Quellen
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressourcen</h4>
            <ul className="space-y-2 text-sm text-vibe-gray-400">
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors flex items-center gap-1">
                  ADAC Kostenvergleich
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors flex items-center gap-1">
                  BDEW Strompreise
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors flex items-center gap-1">
                  KBA Statistiken
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-vibe-primary transition-colors flex items-center gap-1">
                  THG-Quote beantragen
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-vibe-gray-400">
              <li>
                <a 
                  href="mailto:hello@vibe-moves.de" 
                  className="hover:text-vibe-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  hello@vibe-moves.de
                </a>
              </li>
            </ul>
            
            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-vibe-gray-700 flex items-center justify-center hover:bg-vibe-primary hover:text-vibe-dark transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-vibe-gray-700 flex items-center justify-center hover:bg-vibe-primary hover:text-vibe-dark transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-vibe-gray-700 flex items-center justify-center hover:bg-vibe-primary hover:text-vibe-dark transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-vibe-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-vibe-gray-400">
            © {currentYear} vibe moves you. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm text-vibe-gray-400">
            <a href="#" className="hover:text-vibe-primary transition-colors">
              Impressum
            </a>
            <a href="#" className="hover:text-vibe-primary transition-colors">
              Datenschutz
            </a>
            <a href="#" className="hover:text-vibe-primary transition-colors">
              Cookie-Einstellungen
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
