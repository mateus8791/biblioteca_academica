// Utilit\u00e1rio para redirecionar usu\u00e1rios baseado em suas roles/accessLevel

export type AccessLevel = 'admin' | 'bibliotecario' | 'aluno';

export const getDefaultRoute = (accessLevel: AccessLevel): string => {
  switch (accessLevel) {
    case 'admin':
      return '/admin/dashboard';
    case 'bibliotecario':
      return '/bibliotecario/dashboard';
    case 'aluno':
      return '/aluno/dashboard';
    default:
      return '/';
  }
};

export const redirectToDefaultRoute = (accessLevel: AccessLevel) => {
  const route = getDefaultRoute(accessLevel);
  if (typeof window !== 'undefined') {
    window.location.href = route;
  }
};
