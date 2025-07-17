import React, { useState, useEffect } from 'react';
import { Home, Search, Ticket } from 'lucide-react';
import TrueFocus from './reactbits/TrueFocus';
import { useNavigate } from 'react-router-dom';

const GlitchText = ({ text, className = "" }) => {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      <span className={`transition-all duration-200 ${glitching ? 'animate-pulse' : ''}`}>
        {text}
      </span>
      {glitching && (
        <>
          <span className="absolute inset-0 text-blue-300 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
            {text}
          </span>
          <span className="absolute inset-0 text-blue-400 animate-pulse" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
            {text}
          </span>
        </>
      )}
    </div>
  );
};

const FloatingTicket = ({ delay = 0 }) => {
  return (
    <div 
      className="absolute opacity-10 pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float 12s ease-in-out infinite ${delay}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }}
    >
      <Ticket size={40} className="text-gray-600" />
    </div>
  );
};

function PageNotFound() {
  const navigate = useNavigate();

  const floatingTickets = Array.from({ length: 10 }, (_, i) => (
    <FloatingTicket key={i} delay={i * 1} />
  ));
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {floatingTickets}
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <GlitchText 
              text="404" 
              className="text-9xl font-bold text-blue-600"
            />
            <TrueFocus 
              sentence="Page Not Found"
              manualMode={false}
              blurAmount={5}
              borderColor="blue"
              animationDuration={2}
              pauseBetweenAnimations={1}
              />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-[-4] justify-center items-center">            
            <button 
              className="group relative px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 border-2 border-blue-600"
              onClick={() => navigate('/')}
            
            >
              <Search size={20} />
              <span>Explore</span>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

export default PageNotFound;