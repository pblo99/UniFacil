import type { Discipline, ForumAnswer, ForumQuestion, Group, MaterialItem } from '../types/app';
import type {
  CategorySuggestion,
  ExternalIntelligencePayload,
  ForumDiscussionSummary,
  IntelligenceContext,
  IntelligenceStateInput,
  MaterialRecommendationResult,
  QuestionCategory,
  WeeklyPlan,
  WeeklyPriority
} from '../types/intelligence';
import { formatDateLabel, formatDateTimeLabel } from '../utils/format';

const questionCategoryKeywords: Record<QuestionCategory, string[]> = {
  'Banco de Dados': [
    'normalização',
    'sql',
    'join',
    'chave estrangeira',
    'tabela',
    'consulta',
    'banco',
    'dados',
    'modelagem',
    'relacionamento',
    'entidade'
  ],
  'Estrutura de Dados': ['pilha', 'fila', 'lista', 'árvore', 'grafo', 'algoritmo', 'ordenação', 'busca', 'estrutura'],
  'Engenharia de Software': [
    'requisito',
    'caso de uso',
    'uml',
    'sprint',
    'projeto',
    'diagrama',
    'documentação',
    'teste'
  ],
  'Linguagem de Programação': [
    'variável',
    'função',
    'classe',
    'objeto',
    'método',
    'erro',
    'compilação',
    'código',
    'javascript',
    'typescript',
    'java',
    'python'
  ],
  Usabilidade: ['interface', 'ux', 'ui', 'heurística', 'protótipo', 'acessibilidade', 'mobile', 'navegação'],
  Acadêmico: ['segunda chamada', 'prova', 'matrícula', 'coordenação', 'frequência', 'nota', 'prazo', 'professor', 'secretaria'],
  Eventos: ['palestra', 'workshop', 'feira', 'evento', 'inscrição', 'auditório', 'encontro'],
  Materiais: ['slide', 'resumo', 'apostila', 'pdf', 'arquivo', 'material', 'prova antiga'],
  Geral: []
};

const disciplineTerms: Record<string, string[]> = {
  bd: ['banco', 'dados', 'normalização', 'normalizacao', 'sql', 'join', 'chave estrangeira', 'tabela', 'consulta', 'modelagem'],
  ed: ['estrutura', 'dados', 'pilha', 'fila', 'lista', 'árvore', 'arvore', 'grafo', 'algoritmo', 'busca', 'ordenação'],
  es: ['engenharia', 'software', 'requisito', 'caso de uso', 'uml', 'sprint', 'projeto', 'diagrama', 'teste'],
  lp: ['linguagem', 'programação', 'programacao', 'javascript', 'typescript', 'java', 'python', 'código', 'codigo', 'função'],
  ux: ['usabilidade', 'mobile', 'interface', 'ux', 'ui', 'heurística', 'heuristica', 'protótipo', 'prototipo', 'acessibilidade'],
  apd: ['arquiteturas', 'paralelas', 'distribuídas', 'distribuidas', 'concorrência', 'concorrencia', 'rede', 'escalabilidade']
};

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function containsTerm(text: string, term: string): boolean {
  return normalizeText(text).includes(normalizeText(term));
}

function countMatches(text: string, terms: string[]): string[] {
  const normalizedText = normalizeText(text);

  return terms.filter((term) => normalizedText.includes(normalizeText(term)));
}

function getDisciplineTerms(discipline: Discipline): string[] {
  return [...(disciplineTerms[discipline.id] ?? []), discipline.name, ...discipline.nextTopics];
}

function findDisciplineByText(context: IntelligenceContext, text: string): Discipline | undefined {
  return context.disciplines
    .map((discipline) => ({
      discipline,
      score: countMatches(text, getDisciplineTerms(discipline)).length
    }))
    .sort((first, second) => second.score - first.score)[0]?.score
    ? context.disciplines
        .map((discipline) => ({
          discipline,
          score: countMatches(text, getDisciplineTerms(discipline)).length
        }))
        .sort((first, second) => second.score - first.score)[0].discipline
    : undefined;
}

function getQuestionText(question: ForumQuestion): string {
  return `${question.title} ${question.body} ${question.tag}`;
}

function sourceFingerprint(values: unknown[]): string {
  return JSON.stringify(values).length.toString(36);
}

function createPriority(
  badge: WeeklyPriority['badge'],
  title: string,
  description: string,
  sourceId: string,
  disciplineId?: string
): WeeklyPriority {
  return {
    id: `${badge.toLowerCase()}-${sourceId}`,
    badge,
    title,
    description,
    sourceId,
    disciplineId
  };
}

function compactPriorities(priorities: WeeklyPriority[]): WeeklyPriority[] {
  const usedIds = new Set<string>();
  const usedBadges = new Map<WeeklyPriority['badge'], number>();

  return priorities.filter((priority) => {
    if (usedIds.has(priority.id)) {
      return false;
    }

    const badgeCount = usedBadges.get(priority.badge) ?? 0;

    if (badgeCount >= 2) {
      return false;
    }

    usedIds.add(priority.id);
    usedBadges.set(priority.badge, badgeCount + 1);
    return true;
  });
}

function getUpcomingItems<T extends { startsAt?: string; scheduledAt?: string }>(items: T[], limit: number): T[] {
  const now = Date.now();

  return [...items]
    .filter((item) => new Date(item.startsAt ?? item.scheduledAt ?? '').getTime() >= now)
    .sort(
      (first, second) =>
        new Date(first.startsAt ?? first.scheduledAt ?? '').getTime() -
        new Date(second.startsAt ?? second.scheduledAt ?? '').getTime()
    )
    .slice(0, limit);
}

function getRelevantMaterials(context: IntelligenceContext, discipline: Discipline): MaterialItem[] {
  const terms = getDisciplineTerms(discipline);

  return context.materials
    .map((material) => ({
      material,
      score:
        (material.disciplineId === discipline.id ? 6 : 0) +
        countMatches(`${material.title} ${material.category}`, terms).length * 2 +
        (material.addedByUser ? 2 : 0)
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || new Date(second.material.addedAt).getTime() - new Date(first.material.addedAt).getTime())
    .map((item) => item.material);
}

function getRelevantGroups(context: IntelligenceContext, discipline: Discipline): Group[] {
  const terms = getDisciplineTerms(discipline);

  return context.groups
    .map((group) => ({
      group,
      score:
        countMatches(`${group.name} ${group.description}`, terms).length * 3 +
        (context.joinedGroupIds.includes(group.id) ? 2 : 0) +
        (group.createdByUser ? 2 : 0)
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .map((item) => item.group);
}

function scoreDisciplineActivity(context: IntelligenceContext, discipline: Discipline): number {
  const terms = getDisciplineTerms(discipline);
  const examScore = context.exams.some((exam) => exam.disciplineId === discipline.id) ? 4 : 0;
  const questionScore = context.forumQuestions.reduce(
    (total, question) => total + countMatches(getQuestionText(question), terms).length,
    0
  );
  const materialScore = context.materials.reduce(
    (total, material) =>
      total +
      (material.disciplineId === discipline.id ? 2 : 0) +
      countMatches(`${material.title} ${material.category}`, terms).length +
      (material.addedByUser && countMatches(material.title, terms).length > 0 ? 2 : 0),
    0
  );
  const chatScore = context.chatMessages.reduce(
    (total, message) => total + countMatches(message.message, terms).length,
    0
  );
  const groupScore = getRelevantGroups(context, discipline).some((group) => group.createdByUser) ? 3 : 0;

  return examScore + questionScore + materialScore + chatScore + groupScore;
}

export function buildIntelligenceContext(appState: IntelligenceStateInput): IntelligenceContext {
  return {
    ...appState,
    groups: [...appState.groups],
    forumQuestions: [...appState.forumQuestions],
    forumAnswers: [...appState.forumAnswers],
    chatMessages: [...appState.chatMessages],
    materials: [...appState.materials],
    events: [...appState.events],
    notices: [...appState.notices],
    exams: [...appState.exams],
    ratings: [...appState.ratings],
    joinedGroupIds: [...appState.joinedGroupIds],
    interestedEventIds: [...appState.interestedEventIds],
    likedQuestionIds: [...appState.likedQuestionIds],
    generatedAt: new Date().toISOString()
  };
}

export function createExternalIntelligenceContext(context: IntelligenceContext): IntelligenceContext {
  return {
    ...context,
    user: {
      ...context.user,
      ra: '',
      email: ''
    }
  };
}

export function suggestQuestionCategory(title: string, body: string): CategorySuggestion {
  const text = `${title} ${body}`;
  const scoredCategories = (Object.entries(questionCategoryKeywords) as Array<[QuestionCategory, string[]]>)
    .filter(([category]) => category !== 'Geral')
    .map(([category, keywords]) => ({
      category,
      matchedTerms: countMatches(text, keywords)
    }))
    .sort((first, second) => second.matchedTerms.length - first.matchedTerms.length);

  const best = scoredCategories[0];

  if (!best || best.matchedTerms.length === 0) {
    return {
      category: 'Geral',
      confidence: 'baixa',
      reason: 'nenhum termo específico apareceu com clareza na pergunta.',
      matchedTerms: []
    };
  }

  const confidence = best.matchedTerms.length >= 2 ? 'alta' : best.matchedTerms[0].length > 8 ? 'média' : 'baixa';
  const terms = best.matchedTerms.slice(0, 3);

  return {
    category: best.category,
    confidence,
    reason: `a pergunta menciona ${terms.join(' e ')}.`,
    matchedTerms: terms
  };
}

export function generateWeeklyPlan(context: IntelligenceContext): WeeklyPlan {
  const priorities: WeeklyPriority[] = [];
  const upcomingExams = getUpcomingItems(context.exams, 3);
  const interestedEvents = getUpcomingItems(
    context.events.filter((event) => context.interestedEventIds.includes(event.id)),
    2
  );
  const relevantEvents = getUpcomingItems(context.events, 2);
  const latestNotice = [...context.notices].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  )[0];
  const recentQuestions = [...context.forumQuestions]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 5);
  const recentAnswers = [...context.forumAnswers]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 5);

  upcomingExams.forEach((exam) => {
    const discipline = context.disciplines.find((item) => item.id === exam.disciplineId);

    if (!discipline) {
      return;
    }

    const materialsForExam = getRelevantMaterials(context, discipline);
    priorities.push(
      createPriority(
        'Prova',
        `Revisar ${discipline.name}`,
        `A próxima avaliação está em ${formatDateTimeLabel(exam.scheduledAt)}. Priorize ${materialsForExam[0]?.title ?? discipline.nextTopics[0]}.`,
        exam.id,
        discipline.id
      )
    );
  });

  interestedEvents.forEach((event) => {
    priorities.push(
      createPriority(
        'Evento',
        `Reservar horário para ${event.title}`,
        `Você marcou interesse neste compromisso em ${formatDateLabel(event.startsAt)} no local ${event.location}.`,
        event.id
      )
    );
  });

  if (interestedEvents.length === 0 && relevantEvents[0]) {
    priorities.push(
      createPriority(
        'Evento',
        `Avaliar participação em ${relevantEvents[0].title}`,
        `O evento pode complementar sua rotina acadêmica em ${formatDateLabel(relevantEvents[0].startsAt)}.`,
        relevantEvents[0].id
      )
    );
  }

  recentQuestions.forEach((question) => {
    const discipline = findDisciplineByText(context, getQuestionText(question));

    if (!discipline) {
      return;
    }

    const answerCount = context.forumAnswers.filter((answer) => answer.questionId === question.id).length;
    priorities.push(
      createPriority(
        'Fórum',
        `Acompanhar dúvidas de ${discipline.name}`,
        `${question.title} já tem ${answerCount} resposta${answerCount === 1 ? '' : 's'} e pode indicar tema recorrente para revisar.`,
        question.id,
        discipline.id
      )
    );
  });

  context.disciplines.forEach((discipline) => {
    const material = getRelevantMaterials(context, discipline).find((item) => item.addedByUser) ?? getRelevantMaterials(context, discipline)[0];

    if (!material) {
      return;
    }

    priorities.push(
      createPriority(
        'Material',
        `Separar ${material.title}`,
        `O material tem relação com ${discipline.name} e pode apoiar os próximos conteúdos da disciplina.`,
        material.id,
        discipline.id
      )
    );
  });

  const highPriorityDiscipline =
    upcomingExams
      .map((exam) => context.disciplines.find((discipline) => discipline.id === exam.disciplineId))
      .find(Boolean) ?? findDisciplineByText(context, recentQuestions.map(getQuestionText).join(' '));

  if (highPriorityDiscipline) {
    const group = getRelevantGroups(context, highPriorityDiscipline)[0];

    if (group) {
      priorities.push(
        createPriority(
          'Grupo',
          `Participar do grupo ${group.name}`,
          `O grupo está relacionado a ${highPriorityDiscipline.name} e pode ajudar na revisão coletiva desta semana.`,
          group.id,
          highPriorityDiscipline.id
        )
      );
    }
  }

  context.disciplines
    .map((discipline) => ({
      discipline,
      score: scoreDisciplineActivity(context, discipline)
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .forEach(({ discipline }) => {
      const group = getRelevantGroups(context, discipline)[0];

      if (!group) {
        return;
      }

      priorities.push(
        createPriority(
          'Grupo',
          `Usar o grupo ${group.name}`,
          `Há sinais recentes ligados a ${discipline.name}; aproveite o grupo para revisar dúvidas e materiais com colegas.`,
          group.id,
          discipline.id
        )
      );
    });

  context.ratings.forEach((rating) => {
    const discipline = context.disciplines.find((item) => item.id === rating.disciplineId);

    if (!discipline) {
      return;
    }

    const average = (rating.difficulty + rating.teaching + rating.workload + rating.organization) / 4;

    if (average <= 3 || !rating.recommend) {
      priorities.push(
        createPriority(
          'Avaliação',
          `Ajustar rotina em ${discipline.name}`,
          `Sua avaliação indica que esta disciplina merece acompanhamento mais próximo nos próximos dias.`,
          discipline.id,
          discipline.id
        )
      );
    }
  });

  if (latestNotice) {
    priorities.push(
      createPriority(
        'Aviso',
        latestNotice.title,
        latestNotice.message,
        latestNotice.id
      )
    );
  }

  if (recentAnswers[0]) {
    const question = context.forumQuestions.find((item) => item.id === recentAnswers[0].questionId);

    if (question) {
      priorities.push(
        createPriority(
          'Fórum',
          `Rever resposta em ${question.tag}`,
          `Há movimentação recente na discussão "${question.title}", então vale conferir o próximo passo sugerido pela turma.`,
          recentAnswers[0].id
        )
      );
    }
  }

  return {
    id: `weekly-${Date.now()}`,
    title: 'Plano inteligente da semana',
    intro: 'Prioridades acadêmicas calculadas com base nos seus compromissos e nas atividades recentes.',
    priorities: compactPriorities(priorities).slice(0, 6),
    closingMessage: 'Mantenha foco nas entregas próximas e use os grupos para tirar dúvidas antes das avaliações.',
    generatedAt: new Date().toISOString(),
    sourceFingerprint: sourceFingerprint([
      context.exams,
      context.events,
      context.interestedEventIds,
      context.materials,
      context.forumQuestions,
      context.forumAnswers,
      context.groups,
      context.joinedGroupIds,
      context.ratings,
      context.notices
    ])
  };
}

export function recommendMaterials(context: IntelligenceContext, disciplineId: string): MaterialRecommendationResult {
  const discipline = context.disciplines.find((item) => item.id === disciplineId);

  if (!discipline) {
    return {
      disciplineId,
      headline: 'Não foi possível localizar a disciplina selecionada.',
      reason: 'Tente abrir a disciplina novamente para recalcular as recomendações.',
      items: [],
      generatedAt: new Date().toISOString(),
      sourceFingerprint: sourceFingerprint([disciplineId, context.materials])
    };
  }

  const relatedQuestions = context.forumQuestions.filter((question) => {
    const text = getQuestionText(question);
    return question.tag === discipline.name || countMatches(text, getDisciplineTerms(discipline)).length > 0;
  });
  const relatedExam = getUpcomingItems(
    context.exams.filter((exam) => exam.disciplineId === discipline.id),
    1
  )[0];
  const themes = [
    ...discipline.nextTopics,
    ...relatedQuestions.flatMap((question) => suggestQuestionCategory(question.title, question.body).matchedTerms)
  ];
  const terms = [...getDisciplineTerms(discipline), ...themes];
  const items = context.materials
    .map((material) => {
      const matchedTerms = countMatches(`${material.title} ${material.category}`, terms);
      const score =
        (material.disciplineId === discipline.id ? 8 : 0) +
        matchedTerms.length * 3 +
        (material.addedByUser ? 3 : 0) +
        (containsTerm(material.title, discipline.name) ? 2 : 0);

      return {
        materialId: material.id,
        title: material.title,
        category: material.category,
        typeLabel: material.typeLabel,
        reason:
          matchedTerms.length > 0
            ? `Relacionado a ${matchedTerms.slice(0, 2).join(' e ')}.`
            : `Relacionado diretamente à disciplina ${discipline.name}.`,
        score
      };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 5);

  const highlightedThemes = relatedQuestions.length > 0
    ? 'nas dúvidas recentes do fórum'
    : relatedExam
      ? `na próxima avaliação de ${discipline.name}`
      : 'nos próximos conteúdos da disciplina';

  return {
    disciplineId,
    headline: `Com base ${highlightedThemes}, estes materiais podem ajudar:`,
    reason: 'Os materiais foram priorizados por relação com a disciplina, temas citados e itens adicionados recentemente.',
    items,
    generatedAt: new Date().toISOString(),
    sourceFingerprint: sourceFingerprint([discipline, relatedQuestions, relatedExam, context.materials])
  };
}

function buildGuidanceFromAnswers(answers: ForumAnswer[]): string {
  if (answers.length === 0) {
    return 'Ainda não há respostas suficientes para consolidar uma orientação da turma.';
  }

  return answers
    .slice(0, 3)
    .map((answer) => answer.message.replace(/\s+/g, ' ').trim())
    .join(' ');
}

function getNextStep(category: QuestionCategory): string {
  const steps: Record<QuestionCategory, string> = {
    'Banco de Dados': 'Revisar o conceito em um exemplo pequeno e testar uma consulta relacionada ao tema.',
    'Estrutura de Dados': 'Resolver um exercício curto e comparar a solução com os materiais da disciplina.',
    'Engenharia de Software': 'Conferir o requisito ou diagrama com o professor antes da próxima entrega.',
    'Linguagem de Programação': 'Reproduzir o erro em um exemplo mínimo e revisar a sintaxe usada.',
    Usabilidade: 'Validar a interface com uma checklist simples de navegação, contraste e acessibilidade.',
    Acadêmico: 'Conferir as orientações oficiais da instituição e falar com a coordenação dentro do prazo.',
    Eventos: 'Verificar data, local e inscrição para evitar conflito com aulas e provas.',
    Materiais: 'Consultar a pasta de materiais e pedir o arquivo no grupo da disciplina se ainda não estiver disponível.',
    Geral: 'Acompanhar novas respostas e complementar a pergunta com mais contexto, se necessário.'
  };

  return steps[category];
}

export function summarizeForumDiscussion(context: IntelligenceContext, questionId: string): ForumDiscussionSummary {
  const question = context.forumQuestions.find((item) => item.id === questionId);
  const answers = context.forumAnswers
    .filter((answer) => answer.questionId === questionId)
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());

  if (!question) {
    return {
      questionId,
      problem: 'Pergunta não encontrada.',
      guidance: 'Abra a pergunta novamente para recalcular a síntese.',
      nextStep: 'Voltar para a lista do fórum.',
      category: 'Geral',
      answerCount: 0,
      usefulCount: 0,
      generatedAt: new Date().toISOString(),
      sourceFingerprint: sourceFingerprint([questionId])
    };
  }

  const suggestedCategory = suggestQuestionCategory(question.title, question.body).category;
  const category = question.tag && question.tag !== 'Geral' ? (question.tag as QuestionCategory) : suggestedCategory;
  const usefulCount = question.helpfulCount + (context.likedQuestionIds.includes(question.id) ? 1 : 0);

  return {
    questionId,
    problem: `A dúvida principal é sobre ${question.title.toLowerCase()}.`,
    guidance: buildGuidanceFromAnswers(answers),
    nextStep: getNextStep(category in questionCategoryKeywords ? category : 'Geral'),
    category: category in questionCategoryKeywords ? category : 'Geral',
    fewAnswersNotice: answers.length < 2 ? 'Ainda há poucas respostas, então a síntese deve ser usada como orientação inicial.' : undefined,
    answerCount: answers.length,
    usefulCount,
    generatedAt: new Date().toISOString(),
    sourceFingerprint: sourceFingerprint([question, answers, usefulCount])
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isWeeklyPlan(value: unknown): value is WeeklyPlan {
  if (!isRecord(value) || !Array.isArray(value.priorities)) {
    return false;
  }

  return typeof value.title === 'string' && typeof value.generatedAt === 'string';
}

export function isMaterialRecommendationResult(value: unknown): value is MaterialRecommendationResult {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return false;
  }

  return typeof value.disciplineId === 'string' && typeof value.generatedAt === 'string';
}

export function isForumDiscussionSummary(value: unknown): value is ForumDiscussionSummary {
  return isRecord(value) && typeof value.questionId === 'string' && typeof value.generatedAt === 'string';
}

export async function maybeUseExternalIntelligence<T>(
  payload: ExternalIntelligencePayload,
  fallbackFn: () => T,
  isValidResult: (value: unknown) => value is T
): Promise<T> {
  const endpoint = import.meta.env.VITE_UNIFACIL_AI_ENDPOINT;

  if (!endpoint) {
    return fallbackFn();
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 700);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      return fallbackFn();
    }

    const data: unknown = await response.json();
    const result = isRecord(data) && 'result' in data ? data.result : data;

    return isValidResult(result) ? result : fallbackFn();
  } catch {
    return fallbackFn();
  } finally {
    window.clearTimeout(timeoutId);
  }
}
