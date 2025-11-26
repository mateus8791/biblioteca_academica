'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { AvaliacaoAutor, RespostaComentario, curtirComentario, responderComentario, buscarRespostas } from '@/services/comunidade';

interface ComentarioComunidadeProps {
  comentario: AvaliacaoAutor;
  tipo: 'livro' | 'autor';
  onInteracao?: () => void;
}

const ComentarioComunidade: React.FC<ComentarioComunidadeProps> = ({
  comentario,
  tipo,
  onInteracao,
}) => {
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(comentario.interacoes?.total_curtidas || 0);
  const [mostrandoRespostas, setMostrandoRespostas] = useState(false);
  const [respostas, setRespostas] = useState<RespostaComentario[]>([]);
  const [loadingRespostas, setLoadingRespostas] = useState(false);
  const [mostrandoFormResposta, setMostrandoFormResposta] = useState(false);
  const [textoResposta, setTextoResposta] = useState('');
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  const handleCurtir = async () => {
    try {
      const response = await curtirComentario(tipo, comentario.id);
      if (response.success) {
        setCurtido(response.data.curtido);
        setTotalCurtidas(prev => response.data.curtido ? prev + 1 : prev - 1);
        onInteracao?.();
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const carregarRespostas = async () => {
    if (respostas.length > 0) {
      setMostrandoRespostas(!mostrandoRespostas);
      return;
    }

    setLoadingRespostas(true);
    try {
      const response = await buscarRespostas(tipo, comentario.id);
      if (response.success) {
        setRespostas(response.data.respostas);
        setMostrandoRespostas(true);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    } finally {
      setLoadingRespostas(false);
    }
  };

  const handleEnviarResposta = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textoResposta.trim()) return;

    setEnviandoResposta(true);
    try {
      const response = await responderComentario(tipo, comentario.id, textoResposta);
      if (response.success) {
        setRespostas(prev => [...prev, response.data.resposta]);
        setTextoResposta('');
        setMostrandoFormResposta(false);
        setMostrandoRespostas(true);
        onInteracao?.();
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    } finally {
      setEnviandoResposta(false);
    }
  };

  const renderEstrelas = (nota: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <Star
            key={estrela}
            size={14}
            className={`${
              estrela <= nota
                ? 'fill-accent-yellow-500 text-accent-yellow-500'
                : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffEmMs = agora.getTime() - data.getTime();
    const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    if (diffEmDias === 0) return 'Hoje';
    if (diffEmDias === 1) return 'Ontem';
    if (diffEmDias < 7) return `${diffEmDias} dias atrás`;
    if (diffEmDias < 30) return `${Math.floor(diffEmDias / 7)} semanas atrás`;

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalRespostasAtual = respostas.length || comentario.interacoes?.total_respostas || 0;

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-neutral-200 p-5 hover:shadow-lg transition-shadow">
      {/* Header do Comentário */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comentario.usuario.foto_url ? (
            <img
              src={comentario.usuario.foto_url}
              alt={comentario.usuario.nome}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {comentario.usuario.nome.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info do Usuário */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-neutral-900">{comentario.usuario.nome}</h4>
            <span className="text-xs text-neutral-500">{formatarData(comentario.data_criacao)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {renderEstrelas(comentario.nota)}
            <span className="text-sm font-bold text-neutral-700">{comentario.nota}.0</span>
          </div>

          {/* Comentário */}
          <p className="text-neutral-700 leading-relaxed">{comentario.comentario}</p>
        </div>
      </div>

      {/* Botões de Interação */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        {/* Curtir */}
        <button
          onClick={handleCurtir}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            curtido
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Heart
            size={18}
            className={curtido ? 'fill-red-500' : ''}
          />
          <span>{totalCurtidas}</span>
          <span className="hidden sm:inline">Curtidas</span>
        </button>

        {/* Responder */}
        <button
          onClick={() => setMostrandoFormResposta(!mostrandoFormResposta)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-all"
        >
          <MessageCircle size={18} />
          <span>Responder</span>
        </button>

        {/* Ver Respostas */}
        {totalRespostasAtual > 0 && (
          <button
            onClick={carregarRespostas}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all ml-auto"
          >
            <span>{totalRespostasAtual} {totalRespostasAtual === 1 ? 'resposta' : 'respostas'}</span>
            {mostrandoRespostas ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      {/* Formulário de Resposta */}
      {mostrandoFormResposta && (
        <form onSubmit={handleEnviarResposta} className="mt-4 pt-4 border-t border-neutral-200">
          <textarea
            value={textoResposta}
            onChange={(e) => setTextoResposta(e.target.value)}
            placeholder="Escreva sua resposta..."
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setMostrandoFormResposta(false);
                setTextoResposta('');
              }}
              className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!textoResposta.trim() || enviandoResposta}
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {enviandoResposta ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Respostas */}
      {mostrandoRespostas && (
        <div className="mt-4 pt-4 border-t border-neutral-200 space-y-3">
          {loadingRespostas ? (
            <p className="text-center text-neutral-500 text-sm py-4">Carregando respostas...</p>
          ) : respostas.length === 0 ? (
            <p className="text-center text-neutral-500 text-sm py-4">Nenhuma resposta ainda.</p>
          ) : (
            respostas.map((resposta) => (
              <div key={resposta.id} className="flex items-start gap-3 bg-neutral-50 rounded-lg p-3">
                {/* Avatar da Resposta */}
                <div className="flex-shrink-0">
                  {resposta.usuario.foto_url ? (
                    <img
                      src={resposta.usuario.foto_url}
                      alt={resposta.usuario.nome}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {resposta.usuario.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo da Resposta */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-sm text-neutral-800">{resposta.usuario.nome}</h5>
                    <span className="text-xs text-neutral-500">{formatarData(resposta.data_criacao)}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{resposta.texto}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ComentarioComunidade;
