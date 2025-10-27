/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ativa checagens e avisos adicionais para desenvolvimento. É uma boa prática manter true.
  reactStrictMode: true,

  images: {
    // A configuração 'remotePatterns' é a forma moderna e correta de definir fontes de imagens externas.
    remotePatterns: [
      {
        // Permite imagens de qualquer domínio que use o protocolo seguro HTTPS.
        protocol: 'https',
        hostname: '**',
      },
      {
        // Permite imagens de qualquer domínio que use o protocolo não seguro HTTP.
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;