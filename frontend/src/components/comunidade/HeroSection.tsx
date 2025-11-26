'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, ArrowRight } from 'lucide-react'; 

// --- LISTA DE IMAGENS DO CARROSSEL ---
// Adicione aqui os caminhos das suas outras imagens na pasta public/images
const HERO_IMAGES = [
  '/images/hero-slide-1.png', // Sua imagem principal atual
  '/images/hero-slide-2.png',   // Exemplo: Coloque o nome da sua segunda imagem aqui
  '/images/hero-slide-3.png',   // Exemplo: Coloque o nome da sua terceira imagem aqui
];

export default function HeroSection() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efeito para trocar a imagem a cada 4 segundos (50000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(timer); // Limpa o timer se o usuário sair da página
  }, []);

  const handleVerCatalogo = () => {
    router.push('/aluno/catalogo');
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-blue-600"
      style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #172554 100%)',
      }}
    >
      {/* --- EFEITOS DE FUNDO --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* LADO ESQUERDO (TEXTO) - MANTIDO IGUAL */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <Users size={16} className="text-blue-200" />
              <span className="text-sm font-bold text-blue-50 uppercase tracking-wider">
                Comunidade Ativa
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-md">
              Conecte-se através <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                da leitura
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Descubra novos livros, veja o que seus amigos estão lendo e compartilhe suas opiniões com nossa comunidade de leitores.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleVerCatalogo}
                className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
              >
                <BookOpen size={24} />
                Ver Catálogo
              </button>
              <button className="px-8 py-4 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                Como funciona
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LADO DIREITO: CARROSSEL DE IMAGENS         */}
          {/* ========================================== */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative">
            
            <div className="relative w-full max-w-[450px] lg:max-w-[550px] aspect-square">
                
                {/* Renderizamos TODAS as imagens, mas controlamos a opacidade (Fade) */}
                {HERO_IMAGES.map((src, index) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Ilustração Comunidade ${index + 1}`}
                      fill
                      priority={index === 0} // Prioriza apenas a primeira
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}

                {/* Indicadores (Bolinhas) abaixo da imagem para saber qual está ativa */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                  {HERO_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)} // Permite clicar para mudar
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'bg-white scale-125 shadow-lg' 
                          : 'bg-blue-400/50 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Elementos decorativos flutuantes (ficam fixos sobre a troca de imagens) */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 w-16 h-16 rounded-2xl opacity-90 blur-xl animate-pulse z-20"></div>
                <div className="absolute bottom-10 -left-10 bg-blue-400 w-20 h-20 rounded-full opacity-60 blur-xl animate-bounce z-20" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Divisor de onda */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1">
         <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-slate-50 fill-current">
             <path d="M0 60L48 65C96 70 192 80 288 81.7C384 83 480 77 576 68.3C672 60 768 50 864 48.3C960 47 1056 53 1152 61.7C1248 70 1344 80 1392 85L1440 90V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V60Z" />
         </svg>
      </div>
    </div>
  );
}