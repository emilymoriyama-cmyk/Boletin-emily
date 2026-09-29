
// Dados fictícios do 9º Ano
const disciplinas = [
  {
    disciplina: "Língua Portuguesa",
    tri1: 78,
    tri2: "8,2",
    tri3: 8.6,
    faltas: [2, 2, 1]
  },
  {
    disciplina: "Matemática",
    tri1: 55,
    tri2: "5,4",
    tri3: null,
    faltas: [3, 2, 2]
  },
  {
    disciplina: "Ciências",
    tri1: 84,
    tri2: 7.9,
    tri3: "8,3",
    faltas: [1, 1, 1]
  },
  {
    disciplina: "História",
    tri1: "7,1",
    tri2: 82,
    tri3: null,
    faltas: [1, 2, 1]
  },
  {
    disciplina: "Geografia",
    tri1: 69,
    tri2: "7,5",
    tri3: 7.8,
    faltas: [0, 1, 1]
  },
  {
    disciplina: "Língua Inglesa",
    tri1: 88,
    tri2: 8.4,
    tri3: null,
    faltas: [1, 0, 1]
  },
  {
    disciplina: "Arte",
    tri1: "9,2",
    tri2: 87,
    tri3: 9.0,
    faltas: [1, 1, 0]
  },
  {
    disciplina: "Educação Física",
    tri1: 96,
    tri2: "9,3",
    tri3: null,
    faltas: [0, 1, 0]
  },
  {
    disciplina: "Educação Digital",
    tri1: 91,
    tri2: 8.9,
    tri3: "9,4",
    faltas: [1, 1, 0]
  },
  {
    disciplina: "Educação Financeira",
    tri1: 76,
    tri2: "7,2",
    tri3: null,
    faltas: [1, 1, 1]
  },
  {
    disciplina: "Rec. Aprend. Matemática",
    tri1: 58,
    tri2: "5,9",
    tri3: 6.2,
    faltas: [2, 2, 1]
  },
  {
    disciplina: "Leitura Rec. Aprend. Lingua Portuguesa",
    tri1: 72,
    tri2: "7,6",
    tri3: null,
    faltas: [2, 1, 1]
  },
  {
    disciplina: "Pensamento Lógico",
    tri1: 49,
    tri2: 5.5,
    tri3: "5,8",
    faltas: [2, 2, 2]
  },
  {
    disciplina: "Literatura Arte e Movimento",
    tri1: "8,0",
    tri2: 84,
    tri3: null,
    faltas: [1, 1, 0]
  },
  {
    disciplina: "Práticas Experimentais",
    tri1: 64,
    tri2: "6,6",
    tri3: 7.0,
    faltas: [1, 1, 1]
  }
];


// Converte diferentes formatos de nota para a escala de 0 a 10
function normalizarNota(valor) {
  // Valores vazios não são considerados notas
  if (valor === "" || valor === null || valor === undefined) {
    return null;
  }

  // Aceita números e textos com vírgula decimal
  const numero = Number(String(valor).replace(",", "."));

  // Valores que não podem ser convertidos são inválidos
  if (Number.isNaN(numero)) {
    return null;
  }

  // Valores entre 0 e 10 permanecem iguais
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Valores acima de 10 até 100 são convertidos para a escala de 0 a 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Qualquer outro valor é inválido
  return null;
}


// Calcula a média usando somente as notas disponíveis
function calcularMedia(disciplina) {
  const notas = [
    normalizarNota(disciplina.tri1),
    normalizarNota(disciplina.tri2),
    normalizarNota(disciplina.tri3)
  ].filter(nota => nota !== null);

  if (notas.length === 0) {
    return null;
  }

  const soma = notas.reduce((total, nota) => total + nota, 0);

  return soma / notas.length;
}


// Soma as faltas dos três trimestres
function calcularFaltas(disciplina) {
  return disciplina.faltas.reduce(
    (total, faltas) => total + faltas,
    0
  );
}


// Define a situação da disciplina
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }

  if (media >= 6.0) {
    return "Bom desempenho";
  }

  return "Atenção";
}


// Formata uma nota para aparecer com uma casa decimal
function formatarNota(nota) {
  if (nota === null) {
    return "Ainda não lançada";
  }

  return nota.toFixed(1).replace(".", ",");
}


// Preenche a tabela usando os dados do array
function preencherTabela() {
  const tabela = document.getElementById("tabela-boletim");

  disciplinas.forEach(disciplina => {
    const nota1 = normalizarNota(disciplina.tri1);
    const nota2 = normalizarNota(disciplina.tri2);
    const nota3 = normalizarNota(disciplina.tri3);

    const media = calcularMedia(disciplina);
    const faltas = calcularFaltas(disciplina);
    const situacao = definirSituacao(media);

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${disciplina.disciplina}</td>
      <td>${formatarNota(nota1)}</td>
      <td>${formatarNota(nota2)}</td>
      <td>${formatarNota(nota3)}</td>
      <td>${formatarNota(media)}</td>
      <td>${faltas}</td>
      <td>${situacao}</td>
    `;

    tabela.appendChild(linha);
  });
}


// Calcula os dados dos cards de resumo
function preencherResumo() {
  const medias = disciplinas
    .map(disciplina => calcularMedia(disciplina))
    .filter(media => media !== null);

  const mediaGeral =
    medias.reduce((total, media) => total + media, 0) / medias.length;

  const totalFaltas = disciplinas.reduce(
    (total, disciplina) => total + calcularFaltas(disciplina),
    0
  );

  const bomDesempenho = disciplinas.filter(
    disciplina => definirSituacao(calcularMedia(disciplina)) === "Bom desempenho"
  ).length;

  const atencao = disciplinas.filter(
    disciplina => definirSituacao(calcularMedia(disciplina)) === "Atenção"
  ).length;

  document.getElementById("media-geral").textContent =
    formatarNota(mediaGeral);

  document.getElementById("total-faltas").textContent =
    totalFaltas;

  document.getElementById("bom-desempenho").textContent =
    bomDesempenho;

  document.getElementById("atencao").textContent =
    atencao;

  // A frequência é apenas demonstrativa nesta primeira versão.
  // No futuro, ela será tratada de outra forma.
  const frequenciaDemonstrativa = 92;

  document.getElementById("frequencia").textContent =
    `${frequenciaDemonstrativa}%`;

  document.getElementById("frequencia-status").textContent =
    "Frequência adequada";
}


// Inicia o preenchimento da página
preencherTabela();
preencherResumo();
