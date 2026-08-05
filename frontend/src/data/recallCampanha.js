// Dados fixos transcritos da pesquisa "Recall de Campanha Senado Federal - Julho 2026"
// realizada pela Bridge Research/CLX (1.408 entrevistas: 1.008 online + 400 presencial, 12 capitais).

export const SOBRE_PESQUISA = {
  objetivo:
    "Avaliar a efetividade da campanha institucional por meio da mensuração do recall, da compreensão da mensagem e da percepção dos cidadãos sobre a comunicação realizada.",
  metodologia: "Pesquisa Quantitativa de autopreenchimento através de entrevistas via painel online e presenciais em pontos de fluxo.",
  publicoAlvo: ["Homens e Mulheres", "Faixa Etária: Acima de 18 anos", "Classes: Todas as classes"],
  entrevistasOnline: 1008,
  erroOnline: "3,1 p.p.",
  entrevistasPresencial: 400,
  erroPresencial: "4,9 p.p.",
  erroTotal: "2,6 p.p.",
};

export const DETALHAMENTO_AMOSTRA = [
  { cidade: "Porto Alegre", online: 75, erroOnline: "11,3 p.p.", presencial: null, erroPresencial: null, total: 75, erroTotal: "11,3 p.p." },
  { cidade: "Curitiba", online: 75, erroOnline: "11,3 p.p.", presencial: 100, erroPresencial: "9,8 p.p.", total: 175, erroTotal: "7,4 p.p." },
  { cidade: "São Paulo", online: 120, erroOnline: "8,9 p.p.", presencial: 100, erroPresencial: "9,8 p.p.", total: 220, erroTotal: "6,6 p.p." },
  { cidade: "Rio de Janeiro", online: 90, erroOnline: "10,3 p.p.", presencial: null, erroPresencial: null, total: 90, erroTotal: "10,3 p.p." },
  { cidade: "Belo Horizonte", online: 90, erroOnline: "10,3 p.p.", presencial: null, erroPresencial: null, total: 90, erroTotal: "10,3 p.p." },
  { cidade: "Brasília", online: 100, erroOnline: "9,8 p.p.", presencial: 100, erroPresencial: "9,8 p.p.", total: 200, erroTotal: "6,9 p.p." },
  { cidade: "Goiânia", online: 100, erroOnline: "9,8 p.p.", presencial: null, erroPresencial: null, total: 100, erroTotal: "9,8 p.p." },
  { cidade: "Fortaleza", online: 100, erroOnline: "9,8 p.p.", presencial: null, erroPresencial: null, total: 100, erroTotal: "9,8 p.p." },
  { cidade: "Salvador", online: 100, erroOnline: "9,8 p.p.", presencial: 100, erroPresencial: "9,8 p.p.", total: 200, erroTotal: "6,9 p.p." },
  { cidade: "Belém", online: 75, erroOnline: "11,3 p.p.", presencial: null, erroPresencial: null, total: 75, erroTotal: "11,3 p.p." },
  { cidade: "Manaus", online: 75, erroOnline: "11,3 p.p.", presencial: null, erroPresencial: null, total: 75, erroTotal: "11,3 p.p." },
  { cidade: "Macapá", online: 8, erroOnline: "34,6 p.p.", presencial: null, erroPresencial: null, total: 8, erroTotal: "34,6 p.p." },
];

export const AMOSTRA_TOTAL = {
  online: 1008,
  erroOnline: "3,1 p.p.",
  presencial: 400,
  erroPresencial: "4,9 p.p.",
  total: 1408,
  erroTotal: "2,6 p.p.",
  notaColetaPresencial: "Coleta presencial apenas nas cidades: Curitiba, São Paulo, Brasília e Salvador",
};

// Perfil da amostra (composição demográfica dos entrevistados, não recall)
export const PERFIL_GENERO = [
  { corte: "Mulheres", percentual: 53 },
  { corte: "Homens", percentual: 47 },
];

export const PERFIL_CLASSE_SOCIAL = [
  { corte: "Classe A", percentual: 6, cor: "#0f3d91" },
  { corte: "Classe B", percentual: 26, cor: "#2f6feb" },
  { corte: "Classe C", percentual: 63, cor: "#5b8def" },
  { corte: "Classe D/E", percentual: 5, cor: "#a9c6f7" },
];

export const RESUMO_EXECUTIVO = {
  sobreEstudo: [
    "Primeira pesquisa de recall de campanha institucional do Senado Federal",
    "1.408 entrevistas (1.008 online + 400 presenciais) em 12 capitais, margem de erro total de 2,6 p.p.",
  ],
  principaisResultados: [
    "Recall comprovado → 55%",
    "Nota geral da campanha: 8,30",
    "76% consideram a campanha relevante para o seu dia a dia",
    "Percepção de melhora na opinião sobre o Senado Federal → 68%",
    "Interesse em novas campanhas sobre o tema → 83%",
    "Estudo pioneiro: sem histórico de campanhas anteriores do Senado para fins de comparação direta",
  ],
  leituraEstrategica: {
    intro: "A campanha foi bem avaliada e compreendida, mas revela uma oportunidade institucional:",
    pontos: [
      "Mensagem sobre leis e melhoria da qualidade de vida foi claramente entendida",
      "17% dos entrevistados ainda não sabe qual é o papel do Senado Federal",
    ],
  },
  recomendacaoCentral:
    "Este estudo estabelece a linha de base para o acompanhamento contínuo da comunicação institucional — recomendamos repetir a pesquisa nas próximas campanhas para medir evolução ao longo do tempo. Oportunidade: Aprofundar a clareza institucional sobre o papel do Senado.",
};

// Funil de recall: componentes que somam o recall comprovado (Total 55%, Online 61%, Presencial 42%)
export const RECALL_FUNIL_LEGENDA = [
  "Não lembrou",
  "Lembrança não comprovada",
  "Lembrança Estimulada pelo filme",
  "Lembrança Estimulada pelo MUB",
  "Lembrança Estimulada pelas Novelinhas Kwai",
  "Lembrança pela Campanha Senado Federal",
  "Lembrança Estimulada pelo Senado Federal",
];

export const RECALL_FUNIL = {
  total: { recall: 55, naoLembrou: 19, naoComprovada: 26, filme: 0.2, mub: 10, kwai: 28, campanhaSenado: 8, senadoFederal: 9 },
  online: { recall: 61, naoLembrou: 12, naoComprovada: 27, filme: 0.2, mub: 10, kwai: 29, campanhaSenado: 11, senadoFederal: 11 },
  presencial: { recall: 42, naoLembrou: 35, naoComprovada: 23, filme: 0.3, mub: 9, kwai: 25, campanhaSenado: 2, senadoFederal: 6 },
};

export const RECALL_POR_CORTE = [
  { corte: "Total", recall: 55, base: 1408 },
  { corte: "Masculino", recall: 51, base: 502 },
  { corte: "Feminino", recall: 58, base: 902 },
  { corte: "Jovens (18 a 35)", recall: 60, base: 583 },
  { corte: "Maduros (Acima de 35)", recall: 53, base: 825 },
  { corte: "Sul", recall: 60, base: 250 },
  { corte: "Sudeste", recall: 51, base: 400 },
  { corte: "Centro-Oeste", recall: 49, base: 300 },
  { corte: "Nordeste", recall: 64, base: 300 },
  { corte: "Norte", recall: 71, base: 158 },
  { corte: "Classe A", recall: 66, base: 440 },
  { corte: "Classe B", recall: 62, base: 464 },
  { corte: "Classe C/D/E", recall: 50, base: 504 },
];

export const RECALL_POR_REGIAO = [
  { regiao: "Norte", recall: 71, base: 158 },
  { regiao: "Nordeste", recall: 64, base: 300 },
  { regiao: "Centro-Oeste", recall: 49, base: 300 },
  { regiao: "Sudeste", recall: 51, base: 400 },
  { regiao: "Sul", recall: 60, base: 250 },
];

export const RECALL_DESTAQUES = [
  "A região Norte teve o maior Recall (71%), acima do nível nacional (55%). Isso também acontece no público feminino (58%), nos jovens (60%) e na região Nordeste (64%), além das Classes A (66%) e B (62%).",
  "A região Nordeste está entre as mais impactadas pelas campanhas, especialmente pelos estímulos por novelinhas no Kwai (34% vs. 28% do total). Atualmente o Kwai possui mais de 60 milhões de usuários ativos no Brasil, e a região Nordeste representa cerca de 40% do total de usuários (Fonte: Valor Econômico).",
];

export const AVALIACAO_FILME = {
  notaMedia: 8.3,
  escalaMax: 10,
};

export const MEIO_LEMBRANCA = [
  { meio: "TV", total: 75, online: 78, presencial: 66 },
  { meio: "Redes Sociais", total: 68, online: 74, presencial: 53 },
  { meio: "Internet", total: 37, online: 44, presencial: 17 },
  { meio: "Rádio", total: 31, online: 34, presencial: 21 },
  { meio: "Cartazes / Anúncios", total: 29, online: 35, presencial: 11 },
  { meio: "Streaming de Música", total: 12, online: 16, presencial: 1 },
  { meio: "Streaming de Vídeo", total: 11, online: 14, presencial: 0.37 },
  { meio: "Não lembro onde vi/ouvi", total: 22, online: 22, presencial: 23 },
];

export const MEIO_LEMBRANCA_POR_CORTE = {
  bases: { masculino: 377, feminino: 759, jovens: 486, maduros: 653, sul: 194, sudeste: 333, centroOeste: 206, nordeste: 258, norte: 148, classeA: 371, classeB: 389, classeCDE: 379 },
  linhas: [
    { meio: "TV", total: 75, masculino: 76, feminino: 74, jovens: 70, maduros: 78, sul: 70, sudeste: 71, centroOeste: 74, nordeste: 83, norte: 85, classeA: 78, classeB: 81, classeCDE: 72 },
    { meio: "Redes Sociais", total: 68, masculino: 71, feminino: 66, jovens: 78, maduros: 63, sul: 72, sudeste: 61, centroOeste: 64, nordeste: 78, norte: 89, classeA: 76, classeB: 74, classeCDE: 65 },
    { meio: "Internet", total: 37, masculino: 37, feminino: 38, jovens: 40, maduros: 36, sul: 37, sudeste: 37, centroOeste: 37, nordeste: 32, norte: 46, classeA: 49, classeB: 45, classeCDE: 33 },
    { meio: "Rádio", total: 31, masculino: 32, feminino: 30, jovens: 29, maduros: 31, sul: 32, sudeste: 27, centroOeste: 23, nordeste: 40, norte: 41, classeA: 35, classeB: 32, classeCDE: 30 },
    { meio: "Cartazes / Anúncios", total: 29, masculino: 29, feminino: 29, jovens: 31, maduros: 28, sul: 30, sudeste: 26, centroOeste: 31, nordeste: 28, norte: 12, classeA: 34, classeB: 38, classeCDE: 14 },
    { meio: "Streaming de Música", total: 12, masculino: 13, feminino: 11, jovens: 17, maduros: 10, sul: 8, sudeste: 10, centroOeste: 10, nordeste: 16, norte: 18, classeA: 10, classeB: 10, classeCDE: 18 },
    { meio: "Streaming de Vídeo", total: 11, masculino: 10, feminino: 12, jovens: 13, maduros: 10, sul: 9, sudeste: 9, centroOeste: 14, nordeste: 10, norte: 17, classeA: 16, classeB: 19, classeCDE: 6 },
    { meio: "Não lembro exatamente", total: 22, masculino: 17, feminino: 26, jovens: 20, maduros: 23, sul: 20, sudeste: 24, centroOeste: 18, nordeste: 15, norte: 20, classeA: 13, classeB: 21, classeCDE: 23 },
  ],
};

export const MEIO_LEMBRANCA_BRASILIA = {
  base: 131,
  destaque: "Assim como nas demais cidades, em Brasília, a TV e as Redes Sociais são os principais meios geradores de lembranças. Destaque para 'Cartazes e Anúncios', especialmente para o público maduro, com ensino superior em diante e pertencentes às Classes A e B.",
  linhas: [
    { meio: "TV", brasilia: 68, masculino: 76, feminino: 59, jovens: 60, maduros: 72, ateEnsinoMedio: 69, superior: 66, classeA: 68, classeB: 64, classeCDE: 70 },
    { meio: "Redes Sociais", brasilia: 58, masculino: 61, feminino: 56, jovens: 70, maduros: 52, ateEnsinoMedio: 48, superior: 71, classeA: 76, classeB: 82, classeCDE: 43 },
    { meio: "Internet", brasilia: 36, masculino: 36, feminino: 37, jovens: 30, maduros: 39, ateEnsinoMedio: 33, superior: 40, classeA: 47, classeB: 52, classeCDE: 26 },
    { meio: "Rádio", brasilia: 18, masculino: 22, feminino: 14, jovens: 6, maduros: 23, ateEnsinoMedio: 17, superior: 19, classeA: 36, classeB: 23, classeCDE: 13 },
    { meio: "Cartazes / Anúncios", brasilia: 36, masculino: 37, feminino: 35, jovens: 24, maduros: 43, ateEnsinoMedio: 28, superior: 47, classeA: 45, classeB: 49, classeCDE: 29 },
    { meio: "Streaming de Música", brasilia: 11, masculino: 20, feminino: 3, jovens: 9, maduros: 12, ateEnsinoMedio: 10, superior: 13, classeA: 20, classeB: 22, classeCDE: 5 },
    { meio: "Streaming de Vídeo", brasilia: 11, masculino: 18, feminino: 5, jovens: 12, maduros: 11, ateEnsinoMedio: 12, superior: 11, classeA: 28, classeB: 13, classeCDE: 9 },
    { meio: "Não lembro exatamente", brasilia: 22, masculino: 18, feminino: 26, jovens: 28, maduros: 20, ateEnsinoMedio: 24, superior: 21, classeA: 14, classeB: 24, classeCDE: 23 },
  ],
};

export const MENSAGEM_TRANSMITIDA = [
  { mensagem: "Programas de Leis", total: 26, online: 20, presencial: 36 },
  { mensagem: "Melhoria na qualidade de vida", total: 19, online: 18, presencial: 20 },
  { mensagem: "Relação do Senado com a população", total: 16, online: 14, presencial: 21 },
  { mensagem: "Gás do Povo", total: 13, online: 16, presencial: 7 },
  { mensagem: "Confiança da população no Senado", total: 13, online: 11, presencial: 17 },
  { mensagem: "Leis de Violência Doméstica", total: 11, online: 10, presencial: 13 },
  { mensagem: "Expectativas da população em relação ao Senado", total: 10, online: 8, presencial: 15 },
  { mensagem: "Proteção às mulheres", total: 10, online: 9, presencial: 11 },
  { mensagem: "Apoio a Famílias Carentes", total: 9, online: 9, presencial: 7 },
  { mensagem: "Segurança e Proteção", total: 9, online: 9, presencial: 8 },
  { mensagem: "Isenção de Imposto de Renda", total: 9, online: 10, presencial: 4 },
  { mensagem: "Conscientização Política", total: 8, online: 8, presencial: 8 },
  { mensagem: "Redução de custos", total: 8, online: 9, presencial: 5 },
  { mensagem: "Renovação Automática da CNH", total: 6, online: 8, presencial: 3 },
  { mensagem: "Direito das crianças", total: 5, online: 5, presencial: 6 },
];

export const MENSAGEM_TRANSMITIDA_IMPACTO = [
  { mensagem: "Programas de Leis", total: 26, impactados: 26, naoImpactados: 24 },
  { mensagem: "Melhoria na qualidade de vida", total: 19, impactados: 18, naoImpactados: 20 },
  { mensagem: "Relação do Senado com a população", total: 16, impactados: 19, naoImpactados: 13 },
  { mensagem: "Gás do Povo", total: 13, impactados: 14, naoImpactados: 12 },
  { mensagem: "Confiança da população no Senado", total: 13, impactados: 13, naoImpactados: 13 },
  { mensagem: "Leis de Violência Doméstica", total: 11, impactados: 10, naoImpactados: 12 },
  { mensagem: "Expectativas da população em relação ao Senado", total: 10, impactados: 10, naoImpactados: 10 },
  { mensagem: "Proteção às mulheres", total: 10, impactados: 8, naoImpactados: 11 },
  { mensagem: "Apoio a Famílias Carentes", total: 9, impactados: 10, naoImpactados: 7 },
  { mensagem: "Segurança e Proteção", total: 9, impactados: 9, naoImpactados: 8 },
  { mensagem: "Isenção de Imposto de Renda", total: 9, impactados: 10, naoImpactados: 7 },
  { mensagem: "Conscientização Política", total: 8, impactados: 9, naoImpactados: 8 },
  { mensagem: "Redução de custos", total: 8, impactados: 8, naoImpactados: 7 },
  { mensagem: "Renovação Automática da CNH", total: 6, impactados: 6, naoImpactados: 6 },
  { mensagem: "Direito das crianças", total: 5, impactados: 4, naoImpactados: 6 },
];

// Avaliação dos estímulos: 5 temas de propaganda, cada um testado em Imagem Estática vs Vídeo
export const AVALIACAO_ESTIMULOS = [
  {
    tema: "Violência contra os filhos para atingir a mãe vira crime hediondo",
    imagem: { t2b: 85, gosteiMuito: 43, gostei: 42, indiferente: 13, naoGostei: 2, naoGosteiNada: 0.3 },
    video: { t2b: 84, gosteiMuito: 42, gostei: 42, indiferente: 13, naoGostei: 2, naoGosteiNada: 1 },
  },
  {
    tema: "Tornozeleira eletrônica para agressores",
    imagem: { t2b: 80, gosteiMuito: 39, gostei: 41, indiferente: 17, naoGostei: 2, naoGosteiNada: 1 },
    video: { t2b: 85, gosteiMuito: 46, gostei: 39, indiferente: 14, naoGostei: 1, naoGosteiNada: 0.5 },
  },
  {
    tema: "Isenção do imposto de renda para quem ganha até R$ 5.000,00",
    imagem: { t2b: 81, gosteiMuito: 38, gostei: 43, indiferente: 18, naoGostei: 1, naoGosteiNada: 0.4 },
    video: { t2b: 83, gosteiMuito: 38, gostei: 45, indiferente: 14, naoGostei: 2, naoGosteiNada: 1 },
  },
  {
    tema: "Renovação automática da CNH",
    imagem: { t2b: 79, gosteiMuito: 39, gostei: 40, indiferente: 19, naoGostei: 1, naoGosteiNada: 1 },
    video: { t2b: 81, gosteiMuito: 35, gostei: 46, indiferente: 16, naoGostei: 2, naoGosteiNada: 1 },
  },
  {
    tema: "Gás do Povo Permanente",
    imagem: { t2b: 78, gosteiMuito: 36, gostei: 42, indiferente: 19, naoGostei: 2, naoGosteiNada: 1 },
    video: { t2b: 84, gosteiMuito: 40, gostei: 44, indiferente: 13, naoGostei: 2, naoGosteiNada: 1 },
  },
];

export const RESUMO_INDICADORES = {
  destaque: "Boas avaliações para a campanha, principalmente entre os participantes da região Nordeste e da Classe A, o que resultou em 83% de interesse em novas campanhas.",
  linhas: [
    { indicador: "Agradabilidade da Campanha (Média)", total: 8.3, impactados: 8.57, naoImpactados: 7.97, masculino: 8.14, feminino: 8.44, jovens: 8.25, maduros: 8.33, sul: 8.31, sudeste: 8.32, centroOeste: 7.95, nordeste: 8.65, norte: 8.17, classeA: 8.61, classeB: 8.29, classeCDE: 8.28 },
    { indicador: "Saturação da Campanha (%Sim)", total: 68, impactados: 77, naoImpactados: 57, masculino: 67, feminino: 69, jovens: 68, maduros: 68, sul: 60, sudeste: 69, centroOeste: 58, nordeste: 77, norte: 70, classeA: 75, classeB: 70, classeCDE: 67 },
    { indicador: "Opinião sobre o Senado Federal (%Sim, melhorou)", total: 61, impactados: 72, naoImpactados: 49, masculino: 59, feminino: 63, jovens: 65, maduros: 60, sul: 62, sudeste: 60, centroOeste: 58, nordeste: 67, norte: 67, classeA: 69, classeB: 65, classeCDE: 59 },
    { indicador: "Novidade na Campanha (%Sim, mostra novidades)", total: 71, impactados: 80, naoImpactados: 59, masculino: 69, feminino: 72, jovens: 76, maduros: 68, sul: 73, sudeste: 69, centroOeste: 71, nordeste: 80, norte: 66, classeA: 77, classeB: 73, classeCDE: 69 },
    { indicador: "Interesse em novas Campanhas sobre leis (%Sim)", total: 83, impactados: 91, naoImpactados: 73, masculino: 80, feminino: 86, jovens: 83, maduros: 83, sul: 76, sudeste: 84, centroOeste: 75, nordeste: 89, norte: 85, classeA: 90, classeB: 84, classeCDE: 82 },
    { indicador: "Relevância da Campanha (%Sim)", total: 76, impactados: 84, naoImpactados: 66, masculino: 73, feminino: 79, jovens: 81, maduros: 73, sul: 75, sudeste: 75, centroOeste: 70, nordeste: 86, norte: 73, classeA: 84, classeB: 81, classeCDE: 73 },
  ],
};

export const PAPEL_SENADO = {
  sabeQueAprovaLeis: 55,
  naoSabeOPapel: 17,
};

export const APRENDIZADOS = [
  "A campanha atingiu recall geral de 55%, com desempenho mais forte no ambiente online (61%) do que no presencial (42%).",
  "TV e Redes Sociais são, disparado, os meios que mais geram lembrança da campanha (75% e 68% respectivamente), puxados pelas Novelinhas Kwai (28% de lembrança estimulada).",
  "A região Norte (71%) e o público impactado pelo Nordeste (64%) apresentam os maiores índices de recall, acima da média nacional.",
  "Classes A (66%) e B (62%) lembram mais da campanha do que as classes C/D/E (50%), indicando oportunidade de reforço de mídia em públicos de menor renda.",
  "A nota média de avaliação do filme (8,30/10) e o alto interesse em novas campanhas (83%) indicam boa recepção qualitativa do conteúdo veiculado.",
  "Ainda existe uma lacuna relevante de entendimento institucional: 17% dos entrevistados não sabem qual é o papel do Senado Federal.",
  "O público impactado pela campanha mostra maior interesse em saber mais sobre o tema e maior entendimento do papel do Senado do que o público não impactado.",
];
