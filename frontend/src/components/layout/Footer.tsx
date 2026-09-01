import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070E1A] text-slate-300 pt-12 pb-8 border-t border-amber-500/20 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Column 1: Church Identity & Vision (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Header: Golden Logo & Title */}
            <div className="flex items-center gap-3.5">
              {/* Golden Bible with Cross Emblem SVG */}
              <div className="w-12 h-12 flex-shrink-0 text-amber-400 flex items-center justify-center">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                  {/* Radiant Rays */}
                  <path d="M32 4V10M32 54V60M10 32H4M60 32H54M16 16L20 20M44 44L48 48M16 48L20 44M44 20L48 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  {/* Open Bible */}
                  <path d="M12 44C18 42 26 42 32 46C38 42 46 42 52 44V26C46 24 38 24 32 28C26 24 18 24 12 26V44Z" fill="#0A192F" stroke="#F59E0B" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M32 28V46" stroke="#F59E0B" strokeWidth="2.5"/>
                  {/* Bible Page Base */}
                  <path d="M12 47C18 45 26 45 32 49C38 45 46 45 52 47" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                  {/* Golden Latin Cross */}
                  <path d="M32 12V34M25 18H39" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>

              <div>
                <h3 className="font-extrabold text-amber-400 tracking-wider text-base sm:text-lg uppercase leading-tight">
                  Glorious Apostolic<br className="hidden sm:inline" /> Church India Council
                </h3>
              </div>
            </div>

            {/* Subtle Golden Star Divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="h-[1px] bg-gradient-to-r from-amber-500/40 via-amber-400/20 to-transparent flex-1" />
              <span className="text-amber-400 text-xs">✦</span>
              <div className="h-[1px] bg-gradient-to-l from-amber-500/40 via-amber-400/20 to-transparent flex-1" />
            </div>

            {/* Ministry Statement */}
            <p className="text-xs text-slate-300 leading-relaxed">
              Welcome to <strong>Glorious Apostolic Church India Council</strong> — a God-ordained, prophetic and apostolic ministry raised in this generation to proclaim Truth, demonstrate Power, and establish Deliverance across nations.
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              We are not just a church, but a divine movement of revival, commissioned to restore the purity of the Gospel and prepare the Body of Christ for the return of our Lord Jesus Christ.
            </p>

            {/* Scripture Quote */}
            <div className="pt-1">
              <p className="text-xs text-amber-300/90 font-medium italic flex items-center gap-1.5">
                <span>📖</span>
                <span>&ldquo;And you shall know the truth, and the truth shall make you free.&rdquo; – John 8:32</span>
              </p>
            </div>

          </div>

          {/* Column 2: Follow Us On (3.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                FOLLOW US ON
              </h4>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <div className="h-[1px] bg-amber-500/40 w-12" />
                <span className="text-amber-400 text-[10px]">✦</span>
                <div className="h-[1px] bg-amber-500/20 flex-1" />
              </div>
            </div>

            <div className="space-y-3">
              
              {/* YouTube Link Pill */}
              <a
                href="https://youtube.com/@GloriousTruthTimeTV"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm block"
              >
                {/* YouTube Icon */}
                <div className="w-6 h-6 rounded-md bg-[#FF0000] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="text-xs truncate">
                  <strong className="text-white font-bold">YouTube</strong>
                  <span className="text-slate-500 mx-1.5 font-light">|</span>
                  <span className="text-slate-300 font-medium group-hover:text-amber-400 transition-colors">
                    youtube.com/@GloriousTruthTimeTV
                  </span>
                </div>
              </a>

              {/* Instagram Link Pill */}
              <a
                href="https://instagram.com/glorious_truth_time_tv"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm block"
              >
                {/* Instagram Icon */}
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div className="text-xs truncate">
                  <strong className="text-white font-bold">Instagram</strong>
                  <span className="text-slate-500 mx-1.5 font-light">|</span>
                  <span className="text-slate-300 font-medium group-hover:text-amber-400 transition-colors">
                    instagram.com/glorious_truth_time_tv
                  </span>
                </div>
              </a>

              {/* Facebook Link Pill */}
              <a
                href="https://facebook.com/GloriousTruthTimeTV"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm block"
              >
                {/* Facebook Icon */}
                <div className="w-6 h-6 rounded-md bg-[#1877F2] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="text-xs truncate">
                  <strong className="text-white font-bold">Facebook</strong>
                  <span className="text-slate-500 mx-1.5 font-light">|</span>
                  <span className="text-slate-300 font-medium group-hover:text-amber-400 transition-colors">
                    facebook.com/GloriousTruthTimeTV
                  </span>
                </div>
              </a>

            </div>
          </div>

          {/* Column 3: Contact For More Information (3.5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                CONTACT FOR MORE INFORMATION
              </h4>
              <div className="flex items-center gap-2 mt-2 mb-4">
                <div className="h-[1px] bg-amber-500/40 w-12" />
                <span className="text-amber-400 text-[10px]">✦</span>
                <div className="h-[1px] bg-amber-500/20 flex-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 items-start">
              
              {/* Left Sub-column: Prayer & Contact Numbers */}
              <div className="space-y-4">
                
                {/* Prayer and Counseling */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex-shrink-0 text-amber-400 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M12 2a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                      <path d="M8 21v-4a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v4" />
                      <path d="M18 11v3a6 6 0 0 1-12 0v-3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">
                      PRAYER AND COUNSELING
                    </span>
                  </div>
                </div>

                {/* Contact Numbers List */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 flex-shrink-0 text-amber-400 flex items-center justify-center mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block mb-1">
                      CONTACT NO.
                    </span>
                    <div className="space-y-1 text-xs font-semibold text-slate-200">
                      <a href="tel:+917058887291" className="block hover:text-amber-400 transition-colors">7058887291</a>
                      <a href="tel:+917058886391" className="block hover:text-amber-400 transition-colors">7058886391</a>
                      <a href="tel:+917058887091" className="block hover:text-amber-400 transition-colors">7058887091</a>
                      <a href="tel:+917058886491" className="block hover:text-amber-400 transition-colors">7058886491</a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sub-column: Official Email (with border separator) */}
              <div className="sm:border-l sm:border-slate-800/80 sm:pl-4 pt-2 sm:pt-0">
                <a
                  href="mailto:gloriousapostolicchurch777@gmail.com"
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-900 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="text-xs break-all">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Official Email</span>
                    <span className="text-slate-200 group-hover:text-amber-300 transition-colors font-medium">
                      gloriousapostolicchurch777@gmail.com
                    </span>
                  </div>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>© {new Date().getFullYear()} Glorious Apostolic Church India Council. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Prophetic &amp; Apostolic Ministry</span>
            <span className="text-amber-500">✦</span>
            <span>Kingdom Growth</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
