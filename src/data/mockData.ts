import type {
  ChatMessage,
  Discipline,
  EventItem,
  ExamItem,
  ForumAnswer,
  ForumQuestion,
  Group,
  MaterialFolder,
  MaterialItem,
  Notice,
  Professor,
  UserProfile
} from '../types/app';

export const userProfile: UserProfile = {
  name: 'Aluno UniFácil',
  ra: '2026001234',
  course: 'Análise e Desenvolvimento de Sistemas',
  institution: 'UNISOCIESC',
  email: 'aluno@unifacil.edu.br'
};

export const professors: Professor[] = [
  {
    id: 'prof-bd',
    name: 'Profa. Marina Ribeiro',
    area: 'Banco de Dados',
    email: 'marina.ribeiro@unifacil.edu.br',
    officeHours: 'Terças, 18h30 às 19h'
  },
  {
    id: 'prof-es',
    name: 'Prof. Lucas Fernandes',
    area: 'Engenharia de Software',
    email: 'lucas.fernandes@unifacil.edu.br',
    officeHours: 'Quartas, 20h40 às 21h10'
  },
  {
    id: 'prof-ed',
    name: 'Profa. Camila Duarte',
    area: 'Estrutura de Dados',
    email: 'camila.duarte@unifacil.edu.br',
    officeHours: 'Segundas, 18h às 18h30'
  },
  {
    id: 'prof-lp',
    name: 'Prof. Renato Azevedo',
    area: 'Linguagem de Programação',
    email: 'renato.azevedo@unifacil.edu.br',
    officeHours: 'Quintas, 21h às 21h30'
  },
  {
    id: 'prof-ux',
    name: 'Profa. Juliana Martins',
    area: 'Usabilidade e Mobile',
    email: 'juliana.martins@unifacil.edu.br',
    officeHours: 'Sextas, 19h às 19h30'
  },
  {
    id: 'prof-apd',
    name: 'Prof. Tiago Moreira',
    area: 'Arquiteturas Distribuídas',
    email: 'tiago.moreira@unifacil.edu.br',
    officeHours: 'Quartas, 18h às 18h30'
  }
];

export const disciplines: Discipline[] = [
  {
    id: 'bd',
    name: 'Banco de Dados',
    professorId: 'prof-bd',
    schedule: 'Ter e Qui · 19h00 às 20h40',
    location: 'Laboratório 4',
    averageRating: 4.4,
    reviewCount: 124,
    icon: 'database',
    nextTopics: ['Normalização avançada', 'Consultas com JOIN', 'Modelagem física do projeto final']
  },
  {
    id: 'es',
    name: 'Engenharia de Software',
    professorId: 'prof-es',
    schedule: 'Seg e Qua · 20h50 às 22h20',
    location: 'Sala 203',
    averageRating: 4.6,
    reviewCount: 98,
    icon: 'layout',
    nextTopics: ['Backlog do semestre', 'Histórias de usuário', 'Planejamento da sprint de apresentação']
  },
  {
    id: 'ed',
    name: 'Estrutura de Dados',
    professorId: 'prof-ed',
    schedule: 'Ter e Qui · 20h50 às 22h20',
    location: 'Sala 110',
    averageRating: 4.2,
    reviewCount: 116,
    icon: 'blocks',
    nextTopics: ['Árvores binárias', 'Hashing', 'Listas duplamente encadeadas']
  },
  {
    id: 'lp',
    name: 'Linguagem de Programação',
    professorId: 'prof-lp',
    schedule: 'Seg e Qua · 19h00 às 20h40',
    location: 'Laboratório 1',
    averageRating: 4.5,
    reviewCount: 132,
    icon: 'code',
    nextTopics: ['Componentização', 'Tipagem de formulários', 'Tratamento de estado']
  },
  {
    id: 'ux',
    name: 'Usabilidade e Desenvolvimento Mobile',
    professorId: 'prof-ux',
    schedule: 'Sex · 19h00 às 22h20',
    location: 'Sala Maker',
    averageRating: 4.8,
    reviewCount: 88,
    icon: 'smartphone',
    nextTopics: ['Protótipos de baixa fidelidade', 'Arquitetura mobile-first', 'Avaliação heurística']
  },
  {
    id: 'apd',
    name: 'Arquiteturas Paralelas e Distribuídas',
    professorId: 'prof-apd',
    schedule: 'Qua · 19h00 às 22h20',
    location: 'Sala 305',
    averageRating: 4.1,
    reviewCount: 67,
    icon: 'network',
    nextTopics: ['Sistemas distribuídos', 'Escalabilidade horizontal', 'Concorrência e sincronização']
  }
];

export const groups: Group[] = [
  {
    id: 'ads-unisociesc',
    name: 'ADS - UNISOCIESC',
    members: 248,
    description: 'Espaço geral para avisos rápidos, oportunidades e integração da turma.',
    icon: 'users'
  },
  {
    id: 'calouros-2026',
    name: 'Calouros 2026',
    members: 186,
    description: 'Grupo de recepção para novos alunos com dúvidas acadêmicas e dicas práticas.',
    icon: 'sparkles'
  },
  {
    id: 'estudos-bd',
    name: 'Estudos - Banco de Dados',
    members: 72,
    description: 'Discussões sobre consultas, normalização e preparação para provas.',
    icon: 'database'
  },
  {
    id: 'engenharia-software',
    name: 'Engenharia de Software',
    members: 94,
    description: 'Canal para alinhamento de entregas, requisitos e trabalhos em grupo.',
    icon: 'layout'
  },
  {
    id: 'trabalhos-provas',
    name: 'Trabalhos e Provas',
    members: 138,
    description: 'Troca de cronogramas, lembretes de avaliações e revisão coletiva.',
    icon: 'clipboard'
  },
  {
    id: 'eventos-academicos',
    name: 'Eventos Acadêmicos',
    members: 121,
    description: 'Divulgação de palestras, feiras e encontros do semestre.',
    icon: 'calendar'
  }
];

export const forumQuestions: ForumQuestion[] = [
  {
    id: 'q-1',
    title: 'Como funciona a prova de segunda chamada?',
    author: 'Ana Souza',
    tag: 'Acadêmico',
    body: 'Perdi a data da prova de Engenharia de Software por causa de estágio. Queria entender qual é o procedimento e o prazo para solicitar a segunda chamada.',
    helpfulCount: 14,
    createdAt: '2026-05-08T10:00:00.000Z'
  },
  {
    id: 'q-2',
    title: 'Alguém tem resumo de Estrutura de Dados?',
    author: 'Pedro Lima',
    tag: 'Estrutura de Dados',
    body: 'Preciso revisar listas, pilhas e filas antes da próxima avaliação. Se alguém tiver um resumo organizado, já ajuda bastante.',
    helpfulCount: 9,
    createdAt: '2026-05-08T08:00:00.000Z'
  },
  {
    id: 'q-3',
    title: 'Dúvida sobre normalização em Banco de Dados',
    author: 'Lucas Rodrigues',
    tag: 'Banco de Dados',
    body: 'Na terceira forma normal eu ainda fico em dúvida sobre dependências transitivas. Alguém consegue explicar com um exemplo simples?',
    helpfulCount: 17,
    createdAt: '2026-05-07T23:00:00.000Z'
  },
  {
    id: 'q-4',
    title: 'Melhor forma de estudar para Algoritmos?',
    author: 'Mariana Teixeira',
    tag: 'Estudos',
    body: 'Quero montar uma rotina de estudos mais prática para resolver exercícios sem travar tanto no começo.',
    helpfulCount: 11,
    createdAt: '2026-05-07T19:00:00.000Z'
  },
  {
    id: 'q-5',
    title: 'Onde encontro os slides da última aula?',
    author: 'Rafael Costa',
    tag: 'Materiais',
    body: 'Procurei no ambiente da disciplina, mas não achei os slides da aula de Usabilidade Mobile. Eles já foram enviados?',
    helpfulCount: 7,
    createdAt: '2026-05-07T16:00:00.000Z'
  }
];

export const forumAnswers: ForumAnswer[] = [
  {
    id: 'a-1',
    questionId: 'q-1',
    author: 'Camila Prado',
    message: 'Normalmente a coordenação pede o formulário e um comprovante. Vale falar com o professor no mesmo dia para agilizar.',
    createdAt: '2026-05-08T11:10:00.000Z'
  },
  {
    id: 'a-2',
    questionId: 'q-2',
    author: 'João Batista',
    message: 'Tenho um resumo com exercícios resolvidos. Posso enviar no grupo de Materiais mais tarde.',
    createdAt: '2026-05-08T09:15:00.000Z'
  },
  {
    id: 'a-3',
    questionId: 'q-3',
    author: 'Bianca Lopes',
    message: 'Pensa em uma tabela onde uma coluna depende de outra coluna que não é chave. Esse é o tipo de ajuste que a 3FN tenta eliminar.',
    createdAt: '2026-05-08T00:10:00.000Z'
  },
  {
    id: 'a-4',
    questionId: 'q-4',
    author: 'Marcos Vinicius',
    message: 'O que mais ajudou para mim foi misturar teoria curta com listas pequenas todos os dias.',
    createdAt: '2026-05-07T20:20:00.000Z'
  },
  {
    id: 'a-5',
    questionId: 'q-5',
    author: 'Juliana Nunes',
    message: 'A professora comentou que vai subir os slides ainda hoje à noite.',
    createdAt: '2026-05-07T17:30:00.000Z'
  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    author: 'Lucas',
    message: 'Alguém vai no evento de amanhã?',
    createdAt: '2026-05-08T18:15:00.000Z',
    isOwn: false
  },
  {
    id: 'm-2',
    author: 'Maria',
    message: 'Vou sim! Vai ser demais.',
    createdAt: '2026-05-08T18:18:00.000Z',
    isOwn: false
  },
  {
    id: 'm-3',
    author: 'João',
    message: 'Bora marcar um estudo depois disso.',
    createdAt: '2026-05-08T18:20:00.000Z',
    isOwn: false
  },
  {
    id: 'm-4',
    author: 'Lucas',
    message: 'Ótima ideia!',
    createdAt: '2026-05-08T18:21:00.000Z',
    isOwn: false
  }
];

export const materialFolders: MaterialFolder[] = [
  { id: 'resumos', name: 'Resumos', itemsCount: 24, icon: 'book-open' },
  { id: 'provas-antigas', name: 'Provas Antigas', itemsCount: 15, icon: 'clipboard' },
  { id: 'apostilas', name: 'Apostilas', itemsCount: 18, icon: 'file-stack' },
  { id: 'slides', name: 'Slides de Aula', itemsCount: 32, icon: 'layout' },
  { id: 'links', name: 'Links Úteis', itemsCount: 11, icon: 'sparkles' },
  { id: 'outros', name: 'Outros', itemsCount: 10, icon: 'folder' }
];

export const materials: MaterialItem[] = [
  {
    id: 'mat-1',
    title: 'Resumo de Banco de Dados.pdf',
    category: 'Resumos',
    typeLabel: 'PDF',
    addedAt: '2026-05-08T13:00:00.000Z',
    disciplineId: 'bd'
  },
  {
    id: 'mat-2',
    title: 'Slides - Usabilidade Mobile.pdf',
    category: 'Slides de Aula',
    typeLabel: 'PDF',
    addedAt: '2026-05-08T11:20:00.000Z',
    disciplineId: 'ux'
  },
  {
    id: 'mat-3',
    title: 'Prova Antiga - Estrutura de Dados.pdf',
    category: 'Provas Antigas',
    typeLabel: 'PDF',
    addedAt: '2026-05-07T21:30:00.000Z',
    disciplineId: 'ed'
  },
  {
    id: 'mat-4',
    title: 'Checklist de Estudos.docx',
    category: 'Outros',
    typeLabel: 'DOCX',
    addedAt: '2026-05-07T18:10:00.000Z'
  },
  {
    id: 'mat-5',
    title: 'Guia de Requisitos Funcionais.pdf',
    category: 'Apostilas',
    typeLabel: 'PDF',
    addedAt: '2026-05-06T20:00:00.000Z',
    disciplineId: 'es'
  },
  {
    id: 'mat-6',
    title: 'Coleção de exercícios de Programação.pdf',
    category: 'Resumos',
    typeLabel: 'PDF',
    addedAt: '2026-05-05T19:10:00.000Z',
    disciplineId: 'lp'
  }
];

export const events: EventItem[] = [
  {
    id: 'event-1',
    title: 'Palestra: Carreira em TI',
    startsAt: '2026-05-20T19:00:00.000Z',
    location: 'Auditório Principal',
    category: 'Palestra',
    icon: 'calendar',
    description: 'Conversa com profissionais da área sobre trilhas de carreira, mercado e desenvolvimento contínuo.'
  },
  {
    id: 'event-2',
    title: 'Workshop: Git e GitHub',
    startsAt: '2026-06-03T14:00:00.000Z',
    location: 'Laboratório 2',
    category: 'Workshop',
    icon: 'sparkles',
    description: 'Oficina prática com fluxo de versionamento, branches, pull requests e colaboração em equipe.'
  },
  {
    id: 'event-3',
    title: 'Feira de Estágios',
    startsAt: '2026-06-10T09:00:00.000Z',
    location: 'Ginásio Acadêmico',
    category: 'Carreira',
    icon: 'map-pin',
    description: 'Empresas convidadas, vagas, networking e orientações para currículo e entrevistas.'
  },
  {
    id: 'event-4',
    title: 'Encontro de Estudos - Banco de Dados',
    startsAt: '2026-05-23T18:30:00.000Z',
    location: 'Sala 110',
    category: 'Estudos',
    icon: 'database',
    description: 'Sessão colaborativa para revisar modelagem relacional e consultas SQL.'
  },
  {
    id: 'event-5',
    title: 'Apresentação de Projetos Acadêmicos',
    startsAt: '2026-06-17T19:30:00.000Z',
    location: 'Auditório B',
    category: 'Projetos',
    icon: 'graduation-cap',
    description: 'Mostra dos principais projetos integradores desenvolvidos pelas turmas do semestre.'
  }
];

export const notices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Prazo de rematrícula',
    message: 'A rematrícula do próximo semestre fecha nesta sexta-feira às 22h.',
    tone: 'warning',
    createdAt: '2026-05-08T12:00:00.000Z'
  },
  {
    id: 'notice-2',
    title: 'Biblioteca com horário estendido',
    message: 'Durante a semana de provas, a biblioteca ficará aberta até as 23h.',
    tone: 'info',
    createdAt: '2026-05-07T18:00:00.000Z'
  },
  {
    id: 'notice-3',
    title: 'Entrega de projeto',
    message: 'O projeto de Engenharia de Software deve ser enviado até 28/05 com apresentação em sala.',
    tone: 'danger',
    createdAt: '2026-05-06T20:00:00.000Z'
  }
];

export const exams: ExamItem[] = [
  {
    id: 'exam-1',
    disciplineId: 'bd',
    title: 'Prova parcial de Banco de Dados',
    scheduledAt: '2026-05-22T19:00:00.000Z',
    location: 'Sala 204'
  },
  {
    id: 'exam-2',
    disciplineId: 'ed',
    title: 'Avaliação de Estrutura de Dados',
    scheduledAt: '2026-05-27T20:50:00.000Z',
    location: 'Laboratório 1'
  },
  {
    id: 'exam-3',
    disciplineId: 'ux',
    title: 'Entrega avaliativa de Mobile',
    scheduledAt: '2026-05-30T19:00:00.000Z',
    location: 'Sala Maker'
  }
];
