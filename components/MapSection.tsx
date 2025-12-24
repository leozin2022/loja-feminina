
import React from 'react';
import { STORE_ADDRESS } from '../constants';

const MapSection: React.FC = () => {
  const encodedAddress = encodeURIComponent(STORE_ADDRESS);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  
  // Usando a URL de embed padrão do Google que funciona sem chaves de API restritas
  // Isso evita o erro de 'process is not defined' no console
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-pink-50 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-pink-100 shadow-sm">
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-pink-400"></span>
              <span className="text-pink-500 font-bold uppercase tracking-[0.3em] text-[10px]">Localização</span>
            </div>
            <h2 className="text-4xl font-serif text-gray-900 mb-6 italic">Venha nos Visitar</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed uppercase tracking-widest font-bold">
              Experimente a sofisticação pessoalmente em nossa loja conceito em Osasco. 
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-gray-700">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 shrink-0 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">Endereço</p>
                  <span className="text-sm font-bold uppercase tracking-tight text-gray-600">{STORE_ADDRESS}</span>
                </div>
              </div>
            </div>
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] py-5 px-10 rounded-full shadow-xl hover:bg-pink-600 transition-all text-center transform active:scale-95"
            >
              Traçar Rota no Google Maps
            </a>
          </div>
          <div className="h-[400px] lg:h-auto min-h-[450px] relative">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              title="Localização da Loja Boutique Glamour"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-l border-pink-100/50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
