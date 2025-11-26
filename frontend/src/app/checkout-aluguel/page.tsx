'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

interface DadosAluguel {
  livro: {
    id: number;
    titulo: string;
    capa_url?: string;
    autores: string;
  };
  quantidade: number;
  periodoAluguel: number;
  valorTotal: number;
  taxaDiaria: number;
}

export default function CheckoutAluguelPage() {
  const router = useRouter();
  const [dadosAluguel, setDadosAluguel] = useState<DadosAluguel | null>(null);
  const [etapa, setEtapa] = useState(1); // 1: Dados, 2: Pagamento, 3: Confirmação
  const [loading, setLoading] = useState(false);

  // Formulário de dados do cliente
  const [formCliente, setFormCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  // Formulário de pagamento
  const [formPagamento, setFormPagamento] = useState({
    metodoPagamento: 'credito', // credito, debito, pix, boleto
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvvCartao: '',
  });

  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  useEffect(() => {
    // Recuperar dados do localStorage
    const dadosSalvos = localStorage.getItem('dadosAluguel');
    if (dadosSalvos) {
      setDadosAluguel(JSON.parse(dadosSalvos));
    } else {
      // Se não houver dados, redirecionar para home
      router.push('/');
    }
  }, [router]);

  const handleInputCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCliente({
      ...formCliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputPagamento = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormPagamento({
      ...formPagamento,
      [e.target.name]: e.target.value,
    });
  };

  const validarEtapa1 = () => {
    const { nome, email, telefone, cpf, endereco, cidade, estado, cep } = formCliente;
    return nome && email && telefone && cpf && endereco && cidade && estado && cep;
  };

  const validarEtapa2 = () => {
    if (formPagamento.metodoPagamento === 'pix' || formPagamento.metodoPagamento === 'boleto') {
      return true;
    }
    const { numeroCartao, nomeCartao, validadeCartao, cvvCartao } = formPagamento;
    return numeroCartao && nomeCartao && validadeCartao && cvvCartao;
  };

  const avancarEtapa = () => {
    if (etapa === 1 && validarEtapa1()) {
      setEtapa(2);
    } else if (etapa === 2 && validarEtapa2()) {
      finalizarPedido();
    }
  };

  const finalizarPedido = async () => {
    setLoading(true);

    // Simular processamento (em produção, chamar API)
    setTimeout(() => {
      setPedidoConfirmado(true);
      setEtapa(3);
      setLoading(false);

      // Limpar localStorage
      localStorage.removeItem('dadosAluguel');
    }, 2000);
  };

  if (!dadosAluguel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Calcular data de devolução
  const dataRetirada = new Date();
  const dataDevolucao = new Date();
  dataDevolucao.setDate(dataDevolucao.getDate() + dadosAluguel.periodoAluguel);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {!pedidoConfirmado && (
              <button
                onClick={() => etapa > 1 ? setEtapa(etapa - 1) : router.push('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Voltar</span>
              </button>
            )}

            <h1 className="text-2xl font-bold text-gray-900">
              {pedidoConfirmado ? 'Pedido Confirmado' : 'Checkout de Aluguel'}
            </h1>

            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicador de etapas */}
        {!pedidoConfirmado && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${etapa >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${etapa >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {etapa > 1 ? <Check className="h-5 w-5" /> : '1'}
                  </div>
                  <span className="font-medium hidden sm:inline">Dados</span>
                </div>

                <div className={`w-16 h-1 ${etapa >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

                <div className={`flex items-center gap-2 ${etapa >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${etapa >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="font-medium hidden sm:inline">Pagamento</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do pedido (lateral direita) */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Aluguel</h2>

              {/* Livro */}
              <div className="flex gap-4 mb-6 pb-6 border-b">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {dadosAluguel.livro.capa_url ? (
                    <Image
                      src={dadosAluguel.livro.capa_url}
                      alt={dadosAluguel.livro.titulo}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {dadosAluguel.livro.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {dadosAluguel.livro.autores}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Quantidade: {dadosAluguel.quantidade}
                  </p>
                </div>
              </div>

              {/* Detalhes do período */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Retirada
                  </span>
                  <span className="font-medium">{formatarData(dataRetirada)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Devolução
                  </span>
                  <span className="font-medium">{formatarData(dataDevolucao)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Período</span>
                  <span className="font-medium">{dadosAluguel.periodoAluguel} dias</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxa diária</span>
                  <span className="font-medium">R$ {dadosAluguel.taxaDiaria.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {dadosAluguel.valorTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Valor inclui taxa de aluguel por {dadosAluguel.periodoAluguel} dias
                </p>
              </div>

              {/* Segurança */}
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Lock className="h-4 w-4" />
                <span>Pagamento 100% seguro</span>
              </div>
            </motion.div>
          </div>

          {/* Formulário principal (lateral esquerda) */}
          <div className="lg:col-span-2">
            {pedidoConfirmado ? (
              /* Tela de confirmação */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Aluguel Confirmado!
                </h2>

                <p className="text-gray-600 mb-8">
                  Seu pedido de aluguel foi processado com sucesso. Você receberá um email com os
                  detalhes e instruções de retirada.
                </p>

                <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-900 mb-4">Próximos passos:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Você receberá um email de confirmação em <strong>{formCliente.email}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        O livro estará disponível para retirada a partir de <strong>{formatarData(dataRetirada)}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Devolução até <strong>{formatarData(dataDevolucao)}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Em caso de dúvidas, entre em contato pelo email: contato@biblioteca.com
                      </span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Voltar para a Home
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Etapa 1: Dados do cliente */}
                {etapa === 1 && (
                  <motion.div
                    key="etapa1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados do Cliente</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="nome"
                            value={formCliente.nome}
                            onChange={handleInputCliente}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="João da Silva"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formCliente.email}
                            onChange={handleInputCliente}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="joao@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="telefone"
                            value={formCliente.telefone}
                            onChange={handleInputCliente}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CPF *
                        </label>
                        <input
                          type="text"
                          name="cpf"
                          value={formCliente.cpf}
                          onChange={handleInputCliente}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Endereço *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="endereco"
                            value={formCliente.endereco}
                            onChange={handleInputCliente}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Rua, número, bairro"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="cidade"
                            value={formCliente.cidade}
                            onChange={handleInputCliente}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="São Paulo"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado *
                          </label>
                          <input
                            type="text"
                            name="estado"
                            value={formCliente.estado}
                            onChange={handleInputCliente}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CEP *
                          </label>
                          <input
                            type="text"
                            name="cep"
                            value={formCliente.cep}
                            onChange={handleInputCliente}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="00000-000"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={avancarEtapa}
                      disabled={!validarEtapa1()}
                      className="w-full mt-8 bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar para Pagamento
                    </button>
                  </motion.div>
                )}

                {/* Etapa 2: Pagamento */}
                {etapa === 2 && (
                  <motion.div
                    key="etapa2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h2>

                    {/* Método de pagamento */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Forma de Pagamento
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'credito', label: 'Crédito' },
                          { value: 'debito', label: 'Débito' },
                          { value: 'pix', label: 'PIX' },
                          { value: 'boleto', label: 'Boleto' },
                        ].map((metodo) => (
                          <button
                            key={metodo.value}
                            type="button"
                            onClick={() =>
                              setFormPagamento({ ...formPagamento, metodoPagamento: metodo.value })
                            }
                            className={`p-3 border-2 rounded-lg font-medium transition ${
                              formPagamento.metodoPagamento === metodo.value
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {metodo.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dados do cartão (se crédito ou débito) */}
                    {(formPagamento.metodoPagamento === 'credito' ||
                      formPagamento.metodoPagamento === 'debito') && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número do Cartão *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="numeroCartao"
                              value={formPagamento.numeroCartao}
                              onChange={handleInputPagamento}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome no Cartão *
                          </label>
                          <input
                            type="text"
                            name="nomeCartao"
                            value={formPagamento.nomeCartao}
                            onChange={handleInputPagamento}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Validade *
                            </label>
                            <input
                              type="text"
                              name="validadeCartao"
                              value={formPagamento.validadeCartao}
                              onChange={handleInputPagamento}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="MM/AA"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvvCartao"
                              value={formPagamento.cvvCartao}
                              onChange={handleInputPagamento}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PIX */}
                    {formPagamento.metodoPagamento === 'pix' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <p className="text-gray-700 mb-4">
                          Ao confirmar, você receberá um código PIX para pagamento.
                        </p>
                        <p className="text-sm text-gray-600">
                          O pagamento via PIX é instantâneo e seguro.
                        </p>
                      </div>
                    )}

                    {/* Boleto */}
                    {formPagamento.metodoPagamento === 'boleto' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <p className="text-gray-700 mb-4">
                          Ao confirmar, você receberá um boleto bancário para pagamento.
                        </p>
                        <p className="text-sm text-gray-600">
                          O boleto pode levar até 2 dias úteis para compensar.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={avancarEtapa}
                      disabled={!validarEtapa2() || loading}
                      className="w-full mt-8 bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Confirmar Aluguel</span>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Ao confirmar, você concorda com os termos de aluguel da biblioteca.
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
