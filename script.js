// Configuração fixa do aluno
const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 12,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Sessão do usuário
let pinSessao = "";
let modoEdicao = false;

// Dados fictícios locais do 9º Ano
let disciplinas = [
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

// Normaliza dados antigos ou recebidos
function normalizarNota(valor) {
  if (valor === "" || valor === null || valor === undefined) {
    return null;
  }

  const numero = Number(String(valor).replace(",", "."));

  if (Number.isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// Validação estrita para o que o aluno digita no formulário
function validarNotaDigitada(str) {
  if (str === null || str === undefined) return { valida: true, valor: null };
  const texto = String(str).trim();
  if (texto === "") return { valida: true, valor: null };

  if (!/^\d+([.,]\d+)?$/.test(texto)) {
    return { valida: false, valor: null };
  }

  const num = Number(texto.replace(",", "."));
  if (Number.isNaN(num) || num < 0 || num > 10) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
}

function validarFaltaDigitada(str) {
  if (str === null || str === undefined) return { valida: false, valor: null };
  const texto = String(str).trim();
  if (texto === "") return { valida: false, valor: null };

  if (!/^\d+$/.test(texto)) {
    return { valida: false, valor: null };
  }

  const num = Number(texto);
  if (Number.isNaN(num) || num < 0) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
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
  if (Array.isArray(disciplina.faltas)) {
    return disciplina.faltas.reduce((total, f) => total + (Number(f) || 0), 0);
  }
  return 0;
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

// Preenche a tabela usando os dados
function preencherTabela() {
  const tabela = document.getElementById("tabela-boletim");
  tabela.innerHTML = "";

  disciplinas.forEach((disciplina, index) => {
    const nota1 = normalizarNota(disciplina.tri1);
    const nota2 = normalizarNota(disciplina.tri2);
    const nota3 = normalizarNota(disciplina.tri3);

    const media = calcularMedia(disciplina);
    const faltasTotal = calcularFaltas(disciplina);
    const situacao = definirSituacao(media);

    const linha = document.createElement("tr");

    if (modoEdicao) {
      const f1 = Array.isArray(disciplina.faltas) ? (disciplina.faltas[0] ?? "") : "";
      const f2 = Array.isArray(disciplina.faltas) ? (disciplina.faltas[1] ?? "") : "";
      const f3 = Array.isArray(disciplina.faltas) ? (disciplina.faltas[2] ?? "") : "";

      const tdNome = document.createElement("td");
      tdNome.textContent = disciplina.disciplina;
      linha.appendChild(tdNome);

      linha.innerHTML += `
        <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri1" value="${nota1 !== null ? String(nota1).replace('.', ',') : ''}"></td>
        <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri2" value="${nota2 !== null ? String(nota2).replace('.', ',') : ''}"></td>
        <td><input type="text" class="input-edicao" data-index="${index}" data-campo="tri3" value="${nota3 !== null ? String(nota3).replace('.', ',') : ''}"></td>
        <td>${formatarNota(media)}</td>
        <td>
          <div style="display: flex; gap: 4px; justify-content: center;">
            <input type="text" class="input-edicao" data-index="${index}" data-campo="f1" value="${f1}" title="Faltas 1º Tri">
            <input type="text" class="input-edicao" data-index="${index}" data-campo="f2" value="${f2}" title="Faltas 2º Tri">
            <input type="text" class="input-edicao" data-index="${index}" data-campo="f3" value="${f3}" title="Faltas 3º Tri">
          </div>
        </td>
        <td>${situacao}</td>
      `;
    } else {
      const tdNome = document.createElement("td");
      tdNome.textContent = disciplina.disciplina;

      const tdN1 = document.createElement("td");
      tdN1.textContent = formatarNota(nota1);

      const tdN2 = document.createElement("td");
      tdN2.textContent = formatarNota(nota2);

      const tdN3 = document.createElement("td");
      tdN3.textContent = formatarNota(nota3);

      const tdMedia = document.createElement("td");
      tdMedia.textContent = formatarNota(media);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = String(faltasTotal);

      const tdSituacao = document.createElement("td");
      tdSituacao.textContent = situacao;

      linha.appendChild(tdNome);
      linha.appendChild(tdN1);
      linha.appendChild(tdN2);
      linha.appendChild(tdN3);
      linha.appendChild(tdMedia);
      linha.appendChild(tdFaltas);
      linha.appendChild(tdSituacao);
    }

    tabela.appendChild(linha);
  });
}

// Preenche os cards de resumo
function preencherResumo() {
  const medias = disciplinas
    .map(disciplina => calcularMedia(disciplina))
    .filter(media => media !== null);

  const mediaGeral = medias.length > 0
    ? medias.reduce((total, media) => total + media, 0) / medias.length
    : null;

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

  document.getElementById("media-geral").textContent = formatarNota(mediaGeral);
  document.getElementById("total-faltas").textContent = String(totalFaltas);
  document.getElementById("bom-desempenho").textContent = String(bomDesempenho);
  document.getElementById("atencao").textContent = String(atencao);

  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent = `${frequenciaDemonstrativa}%`;
  document.getElementById("frequencia-status").textContent = "Frequência adequada";
}

// Manipulação do Login
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) return;

  msgLogin.style.color = "#111";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.style.color = "#d9534f";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.style.color = "#d9534f";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.style.color = "#d9534f";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const json = await resposta.json();

    if (json.dados && Array.isArray(json.dados.disciplinas) && json.dados.disciplinas.length > 0) {
      disciplinas = json.dados.disciplinas;
    }

    pinSessao = pinDigitado;
    campoPin.value = "";

    document.getElementById("secao-login").style.display = "none";
    document.getElementById("area-boletim").style.display = "block";

    preencherTabela();
    preencherResumo();

  } catch (erro) {
    msgLogin.style.color = "#d9534f";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
});

// Alternar Modo de Edição
document.getElementById("btn-alternar-edicao").addEventListener("click", () => {
  modoEdicao = !modoEdicao;
  const btnEdicao = document.getElementById("btn-alternar-edicao");
  const btnSalvar = document.getElementById("btn-salvar");
  const msgSalvar = document.getElementById("mensagem-salvar");

  msgSalvar.textContent = "";

  if (modoEdicao) {
    btnEdicao.textContent = "Cancelar edição";
    btnSalvar.style.display = "inline-block";
  } else {
    btnEdicao.textContent = "Alterar dados";
    btnSalvar.style.display = "none";
  }

  preencherTabela();
});

// Salvar Alterações
document.getElementById("btn-salvar").addEventListener("click", async () => {
  const msgSalvar = document.getElementById("mensagem-salvar");
  msgSalvar.textContent = "";

  const inputs = document.querySelectorAll(".input-edicao");
  inputs.forEach(i => i.classList.remove("invalido"));

  let possuiErro = false;
  const copiaDisciplinas = JSON.parse(JSON.stringify(disciplinas));

  inputs.forEach(input => {
    const idx = Number(input.getAttribute("data-index"));
    const campo = input.getAttribute("data-campo");
    const valor = input.value;

    if (campo === "tri1" || campo === "tri2" || campo === "tri3") {
      const res = validarNotaDigitada(valor);
      if (!res.valida) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        copiaDisciplinas[idx][campo] = res.valor;
      }
    } else if (campo === "f1" || campo === "f2" || campo === "f3") {
      const res = validarFaltaDigitada(valor);
      if (!res.valida) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        const pos = campo === "f1" ? 0 : campo === "f2" ? 1 : 2;
        if (!Array.isArray(copiaDisciplinas[idx].faltas)) {
          copiaDisciplinas[idx].faltas = [0, 0, 0];
        }
        copiaDisciplinas[idx].faltas[pos] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgSalvar.style.color = "#d9534f";
    msgSalvar.textContent = "Corrija os campos marcados em vermelho antes de salvar.";
    return;
  }

  msgSalvar.style.color = "#111";
  msgSalvar.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: copiaDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgSalvar.style.color = "#d9534f";
      msgSalvar.textContent = "Erro ao salvar os dados no servidor. Tente novamente.";
      return;
    }

    disciplinas = copiaDisciplinas;
    modoEdicao = false;

    document.getElementById("btn-alternar-edicao").textContent = "Alterar dados";
    document.getElementById("btn-salvar").style.display = "none";

    preencherTabela();
    preencherResumo();

    msgSalvar.style.color = "#5cb85c";
    msgSalvar.textContent = "Dados salvos com sucesso.";

  } catch (erro) {
    msgSalvar.style.color = "#d9534f";
    msgSalvar.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
});