import React from 'react';
import { FaUsers, FaBookOpen } from 'react-icons/fa';
import { MdStars } from 'react-icons/md';
import { UsuarioAtivo, EstatisticasComunidade } from '@/services/comunidade';

interface StatsSectionProps {
  usuariosAtivos: UsuarioAtivo[];
  estatisticas: EstatisticasComunidade;
}

export default function StatsSection({ usuariosAtivos, estatisticas }: StatsSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16 relative z-20">
      <div className="bg-white rounded-3xl shadow-2xl border border-neutral-100 p-8 hover:shadow-3xl transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Avatares Sobrepostos */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {usuariosAtivos.slice(0, 5).map((usuario) => (
                <div key={usuario.id} className="relative group">
                  {usuario.foto_url ? (
                    <img
                      src={usuario.foto_url}
                      alt={usuario.nome}
                      loading="lazy"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer">
                      <span className="text-white font-bold text-lg">
                        {usuario.nome
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  {usuario.online && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-2xl">
                    {usuario.nome}
                    {usuario.online && <span className="text-green-400 ml-2">● Online</span>}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
                  </div>
                </div>
              ))}
              {usuariosAtivos.length > 5 && (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <span className="text-neutral-700 font-black text-base">+{usuariosAtivos.length - 5}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards - Maior espaçamento */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Online */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl px-6 py-4 border-2 border-green-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <FaUsers size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-green-900">{estatisticas.usuarios_online}</p>
                  <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Online</p>
                </div>
              </div>
            </div>

            {/* Livros */}
            <div className="group bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl px-6 py-4 border-2 border-primary-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <FaBookOpen size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-primary-900">{estatisticas.total_livros}</p>
                  <p className="text-sm font-bold text-primary-700 uppercase tracking-wide">Livros</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="group bg-gradient-to-br from-accent-yellow-50 to-accent-yellow-100 rounded-2xl px-6 py-4 border-2 border-accent-yellow-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-yellow-400 to-accent-yellow-500 flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <MdStars size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-accent-yellow-900">{estatisticas.total_avaliacoes}</p>
                  <p className="text-sm font-bold text-accent-yellow-700 uppercase tracking-wide">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
