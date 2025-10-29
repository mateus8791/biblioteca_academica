// frontend/src/app/select-profile/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

// Card reutilizável
const ProfileCard = ({
  href,
  iconSrc,
  title,
  description,
}: {
  href: string;
  iconSrc: string;
  title: string;
  description: string;
}) => (
  <Link href={href}>
    <div className="flex flex-col items-center justify-between w-64 h-72 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:scale-105 cursor-pointer">
      <div className="w-24 h-24 relative mb-4">
        <Image
          src={iconSrc}
          alt={`Ícone ${title}`}
          fill
          className="rounded-full object-contain"
          sizes="96px"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 text-center">{title}</h3>
      <p className="text-sm text-gray-500 text-center mt-2 leading-snug max-w-[220px]">
        {description}
      </p>
    </div>
  </Link>
);

export default function ProfileSelectPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Bem-vindo(a) ao <span className="text-blue-600">Bibliotech</span>!
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Para otimizar sua experiência, por favor, selecione seu perfil de acesso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <ProfileCard
          href="/enter-id?profile=student"
          iconSrc="/icons/student-icon.png"
          title="Aluno"
          description="Acesse seus empréstimos, faça reservas e explore nosso acervo."
        />
        <ProfileCard
          href="/enter-id?profile=librarian"
          iconSrc="/icons/librarian-icon.png"
          title="Bibliotecário"
          description="Gerencie o acervo, empréstimos, usuários e relatórios do sistema."
        />
        <ProfileCard
          href="/loja"
          iconSrc="/icons/other-icon.png"
          title="Visitante"
          description="Explore, adicione e finalize, simples assim. Nenhum cadastro, só boas leituras"
        />
      </div>
    </main>
  );
}
