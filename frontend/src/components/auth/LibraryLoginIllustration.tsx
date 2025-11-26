'use client';

interface LibraryLoginIllustrationProps {
  className?: string;
}

export function LibraryLoginIllustration({ className = '' }: LibraryLoginIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {/* Definições de gradientes e padrões */}
      <defs>
        <linearGradient id="gradient-bg" x1="0" y1="0" x2="800" y2="600">
          <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="book-gradient-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="book-gradient-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient id="book-gradient-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        <linearGradient id="person-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
      </defs>

      {/* Estante de Livros - Fundo */}
      <g id="bookshelf">
        {/* Prateleira Superior */}
        <rect x="150" y="180" width="500" height="8" fill="#1E40AF" opacity="0.3" rx="2" />

        {/* Livros na prateleira superior */}
        <motion.g
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <rect x="160" y="120" width="45" height="60" fill="url(#book-gradient-1)" rx="2" />
          <rect x="160" y="120" width="45" height="8" fill="#1E40AF" opacity="0.3" />
          <line x1="170" y1="130" x2="170" y2="170" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="210" y="130" width="50" height="50" fill="url(#book-gradient-2)" rx="2" />
          <rect x="210" y="130" width="50" height="8" fill="#1E40AF" opacity="0.3" />

          <rect x="265" y="115" width="40" height="65" fill="url(#book-gradient-3)" rx="2" />
          <rect x="265" y="115" width="40" height="8" fill="#1E40AF" opacity="0.3" />
          <line x1="275" y1="125" x2="275" y2="170" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="310" y="125" width="48" height="55" fill="url(#book-gradient-1)" rx="2" />
          <rect x="310" y="125" width="48" height="8" fill="#1E40AF" opacity="0.3" />

          <rect x="363" y="120" width="42" height="60" fill="url(#book-gradient-2)" rx="2" />
          <line x1="373" y1="130" x2="373" y2="170" stroke="white" strokeWidth="1" opacity="0.3" />
        </motion.g>

        {/* Prateleira do meio */}
        <rect x="150" y="320" width="500" height="8" fill="#1E40AF" opacity="0.3" rx="2" />

        {/* Livros na prateleira do meio */}
        <motion.g
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <rect x="160" y="250" width="52" height="70" fill="url(#book-gradient-3)" rx="2" />
          <rect x="160" y="250" width="52" height="8" fill="#1E40AF" opacity="0.3" />
          <line x1="172" y1="260" x2="172" y2="310" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="217" y="255" width="45" height="65" fill="url(#book-gradient-1)" rx="2" />
          <rect x="217" y="255" width="45" height="8" fill="#1E40AF" opacity="0.3" />

          <rect x="267" y="245" width="50" height="75" fill="url(#book-gradient-2)" rx="2" />
          <rect x="267" y="245" width="50" height="8" fill="#1E40AF" opacity="0.3" />
          <line x1="280" y1="255" x2="280" y2="310" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="322" y="258" width="43" height="62" fill="url(#book-gradient-3)" rx="2" />

          <rect x="370" y="250" width="48" height="70" fill="url(#book-gradient-1)" rx="2" />
          <line x1="382" y1="260" x2="382" y2="310" stroke="white" strokeWidth="1" opacity="0.3" />
        </motion.g>

        {/* Prateleira inferior */}
        <rect x="150" y="460" width="500" height="8" fill="#1E40AF" opacity="0.3" rx="2" />

        {/* Livros na prateleira inferior */}
        <motion.g
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <rect x="160" y="385" width="46" height="75" fill="url(#book-gradient-2)" rx="2" />
          <rect x="160" y="385" width="46" height="8" fill="#1E40AF" opacity="0.3" />

          <rect x="211" y="390" width="50" height="70" fill="url(#book-gradient-3)" rx="2" />
          <line x1="223" y1="400" x2="223" y2="450" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="266" y="380" width="44" height="80" fill="url(#book-gradient-1)" rx="2" />
          <rect x="266" y="380" width="44" height="8" fill="#1E40AF" opacity="0.3" />

          <rect x="315" y="388" width="48" height="72" fill="url(#book-gradient-2)" rx="2" />
          <line x1="327" y1="398" x2="327" y2="450" stroke="white" strokeWidth="1" opacity="0.3" />

          <rect x="368" y="395" width="42" height="65" fill="url(#book-gradient-3)" rx="2" />
        </motion.g>
      </g>

      {/* Pessoa lendo - Lado direito */}
      <motion.g
        id="reading-person"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {/* Cadeira */}
        <ellipse cx="520" cy="480" rx="45" ry="12" fill="#1E40AF" opacity="0.2" />
        <rect x="490" y="420" width="60" height="60" rx="8" fill="#BFDBFE" opacity="0.5" />

        {/* Corpo */}
        <circle cx="520" cy="380" r="28" fill="url(#person-gradient)" />
        <ellipse cx="520" cy="425" rx="35" ry="45" fill="#3B82F6" opacity="0.8" />

        {/* Cabeça */}
        <circle cx="520" cy="360" r="22" fill="#DBEAFE" />

        {/* Cabelo */}
        <path
          d="M 498 360 Q 498 340 520 338 Q 542 340 542 360 Z"
          fill="#1E40AF"
          opacity="0.6"
        />

        {/* Livro nas mãos */}
        <rect x="495" y="395" width="50" height="35" rx="2" fill="#3B82F6" />
        <line x1="520" y1="400" x2="520" y2="425" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="500" y1="405" x2="515" y2="405" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="525" y1="405" x2="540" y2="405" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="500" y1="415" x2="515" y2="415" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="525" y1="415" x2="540" y2="415" stroke="white" strokeWidth="1" opacity="0.3" />
      </motion.g>

      {/* Elementos decorativos flutuantes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {/* Estrelas/Sparkles de conhecimento */}
        <motion.circle
          cx="200"
          cy="100"
          r="3"
          fill="#3B82F6"
          opacity="0.6"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.circle
          cx="600"
          cy="150"
          r="4"
          fill="#60A5FA"
          opacity="0.6"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        <motion.circle
          cx="350"
          cy="80"
          r="2.5"
          fill="#93C5FD"
          opacity="0.6"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.circle
          cx="580"
          cy="280"
          r="3.5"
          fill="#3B82F6"
          opacity="0.6"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        />
      </motion.g>

      {/* Livro aberto em destaque - canto inferior esquerdo */}
      <motion.g
        id="open-book"
        initial={{ rotate: -5, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <ellipse cx="220" cy="520" rx="60" ry="15" fill="#1E40AF" opacity="0.15" />

        {/* Livro aberto */}
        <path
          d="M 160 480 Q 160 460 180 460 L 220 460 L 220 510 L 180 510 Q 160 510 160 490 Z"
          fill="#DBEAFE"
        />
        <path
          d="M 220 460 L 260 460 Q 280 460 280 480 L 280 490 Q 280 510 260 510 L 220 510 Z"
          fill="#BFDBFE"
        />

        {/* Linhas do texto */}
        <line x1="170" y1="470" x2="210" y2="470" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="170" y1="478" x2="210" y2="478" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="170" y1="486" x2="205" y2="486" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="170" y1="494" x2="210" y2="494" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />

        <line x1="230" y1="470" x2="270" y2="470" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="230" y1="478" x2="270" y2="478" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="230" y1="486" x2="265" y2="486" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />
        <line x1="230" y1="494" x2="270" y2="494" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" />

        {/* Lombada do livro */}
        <line x1="220" y1="460" x2="220" y2="510" stroke="#93C5FD" strokeWidth="2" />
      </motion.g>

      {/* Ícones flutuantes de conhecimento */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 0.4 }}
        transition={{
          delay: 1.5,
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {/* Lâmpada de ideia */}
        <circle cx="650" cy="220" r="15" fill="none" stroke="#60A5FA" strokeWidth="2" />
        <path d="M 645 210 L 650 200 L 655 210" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        <rect x="647" y="232" width="6" height="4" rx="1" fill="#60A5FA" />
        <path d="M 642 225 Q 642 235 650 235 Q 658 235 658 225" fill="none" stroke="#60A5FA" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}
