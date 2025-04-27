// Matrix background animation
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const fontSize = 18;
const columns = Math.floor(width / fontSize);
const drops = Array.from({length: columns}, () => Math.random() * -1000);

const letters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + "px monospace";
  for(let i = 0; i < columns; i++) {
    const char = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillStyle = '#0F0';
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// Menu logic
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const ajuda = document.getElementById('ajuda');
const btnJogar = document.getElementById('btn-jogar');
const btnSair = document.getElementById('btn-sair');
const btnAjuda = document.getElementById('btn-ajuda');
const btnVoltarAjuda = document.getElementById('btn-voltar-ajuda');
const btnConotacao = document.getElementById('btn-conotacao');
const btnDenotacao = document.getElementById('btn-denotacao');
const btnSairJogo = document.getElementById('btn-sair-jogo');
const perguntaDiv = document.getElementById('pergunta');
const pontuacaoDiv = document.getElementById('pontuacao');
const timerBar = document.getElementById('timer-bar');

let estado = 'menu';
let pontuacao = 0;
let tempoRestante = 30;
let tempoTotal = 30;
let intervaloTimer = null;
let bloqueado = false;

// NOVAS FRASES: adicione quantas quiser, sem repetições
const todasPerguntas = [
  { texto: 'A palavra "coração" em "Ele tem um coração de pedra".', resposta: 'Conotação' },
  { texto: 'A palavra "coração" em "O coração é um órgão vital".', resposta: 'Denotação' },
  { texto: 'O termo "estrela" em "Ela é uma estrela do futebol".', resposta: 'Conotação' },
  { texto: 'O termo "estrela" em "Uma estrela é um corpo celeste".', resposta: 'Denotação' },
  { texto: 'A palavra "cobra" em "Ele é uma cobra no trabalho".', resposta: 'Conotação' },
  { texto: 'A palavra "cobra" em "A cobra é um animal peçonhento".', resposta: 'Denotação' },
  { texto: 'O termo "raposa" em "Ele é uma raposa nos negócios".', resposta: 'Conotação' },
  { texto: 'O termo "raposa" em "A raposa é um animal mamífero".', resposta: 'Denotação' },
  { texto: 'A palavra "pé" em "O pé da mesa quebrou".', resposta: 'Conotação' },
  { texto: 'A palavra "pé" em "Meu pé está doendo".', resposta: 'Denotação' },
  { texto: 'A palavra "leão" em "Ele é um leão nos estudos".', resposta: 'Conotação' },
  { texto: 'A palavra "leão" em "O leão vive na savana africana".', resposta: 'Denotação' },
  { texto: 'O termo "bicho" em "Ele é um bicho raro".', resposta: 'Conotação' },
  { texto: 'O termo "bicho" em "O bicho estava no quintal".', resposta: 'Denotação' },
  { texto: 'A palavra "cabeça" em "Ele é cabeça dura".', resposta: 'Conotação' },
  { texto: 'A palavra "cabeça" em "A cabeça é uma parte do corpo".', resposta: 'Denotação' },
  { texto: 'O termo "pé frio" em "Ele é pé frio no jogo".', resposta: 'Conotação' },
  { texto: 'O termo "pé frio" em "Meus pés estão frios".', resposta: 'Denotação' },
  { texto: 'A palavra "raiz" em "Ele é raiz do rock".', resposta: 'Conotação' },
  { texto: 'A palavra "raiz" em "A raiz da planta é profunda".', resposta: 'Denotação' },
  { texto: 'A palavra "mão" em "Ele tem mão boa para negócios".', resposta: 'Conotação' },
  { texto: 'A palavra "mão" em "Minha mão está machucada".', resposta: 'Denotação' },
  { texto: 'A expressão "cabeça nas nuvens" em "Ele está sempre com a cabeça nas nuvens".', resposta: 'Conotação' },
  { texto: 'A expressão "cabeça nas nuvens" em "As nuvens cobriram a cabeça da montanha".', resposta: 'Denotação' },
  { texto: 'A palavra "fogo" em "Ele tem fogo nos olhos".', resposta: 'Conotação' },
  { texto: 'A palavra "fogo" em "O fogo destruiu a floresta".', resposta: 'Denotação' },
  { texto: 'A palavra "olho" em "Ele tem olho clínico para negócios".', resposta: 'Conotação' },
  { texto: 'A palavra "olho" em "O olho humano capta luz".', resposta: 'Denotação' },
  { texto: 'A expressão "pé na estrada" em "Vamos botar o pé na estrada".', resposta: 'Conotação' },
  { texto: 'A expressão "pé na estrada" em "O caminhão está com o pé na estrada".', resposta: 'Denotação' }
];

let perguntas = [];
let perguntaAtual = 0;

// Algoritmo Fisher-Yates para embaralhar
function shuffle(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

btnJogar.onclick = () => {
  pontuacao = 0;
  atualizarPontuacao();
  // Sempre embaralhe as perguntas para garantir ordem diferente
  perguntas = shuffle([...todasPerguntas]);
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  ajuda.classList.add('hidden');
  estado = 'jogo';
  perguntaAtual = 0;
  mostrarPergunta();
};

btnSair.onclick = () => {
  alert('Obrigado por jogar!');
};

btnAjuda.onclick = () => {
  menu.classList.add('hidden');
  ajuda.classList.remove('hidden');
  game.classList.add('hidden');
  estado = 'ajuda';
  pararTimer();
};

btnVoltarAjuda.onclick = () => {
  menu.classList.remove('hidden');
  ajuda.classList.add('hidden');
  game.classList.add('hidden');
  estado = 'menu';
  pararTimer();
};

btnSairJogo.onclick = () => {
  menu.classList.remove('hidden');
  game.classList.add('hidden');
  ajuda.classList.add('hidden');
  estado = 'menu';
  pararTimer();
};

function mostrarPergunta() {
  if (perguntaAtual >= perguntas.length) {
    perguntaDiv.textContent = `Fim do jogo! Sua pontuação final foi ${pontuacao}. Clique em "Jogar" para recomeçar.`;
    btnConotacao.disabled = true;
    btnDenotacao.disabled = true;
    pararTimer();
    timerBar.style.width = "0%";
    return;
  }
  perguntaDiv.textContent = perguntas[perguntaAtual].texto;
  tempoRestante = tempoTotal;
  atualizarBarra();
  bloqueado = false;
  btnConotacao.disabled = false;
  btnDenotacao.disabled = false;
  iniciarBarra();
}

function atualizarPontuacao() {
  pontuacaoDiv.textContent = `Pontuação: ${pontuacao}`;
}

function atualizarBarra() {
  const percent = (tempoRestante / tempoTotal) * 100;
  timerBar.style.width = percent + "%";
  if(percent > 60) {
    timerBar.style.background = 'linear-gradient(90deg, #0f0 60%, #ff0 100%)';
  } else if(percent > 30) {
    timerBar.style.background = 'linear-gradient(90deg, #ff0 60%, #f90 100%)';
  } else {
    timerBar.style.background = 'linear-gradient(90deg, #f90 60%, #f00 100%)';
  }
}

function iniciarBarra() {
  pararTimer();
  const step = 100; // ms
  intervaloTimer = setInterval(() => {
    tempoRestante -= step/1000;
    if (tempoRestante <= 0) {
      tempoRestante = 0;
      atualizarBarra();
      pontuacao--; // Perde 1 ponto se acabar o tempo!
      atualizarPontuacao();
      bloquearPergunta('Tempo esgotado! -1 ponto');
      setTimeout(proximaPergunta, 1500);
    } else {
      atualizarBarra();
    }
  }, step);
}

function pararTimer() {
  if (intervaloTimer) {
    clearInterval(intervaloTimer);
    intervaloTimer = null;
  }
}

function bloquearPergunta(msg) {
  bloqueado = true;
  btnConotacao.disabled = true;
  btnDenotacao.disabled = true;
  perguntaDiv.textContent = msg + ` Era: ${perguntas[perguntaAtual].resposta}`;
  pararTimer();
}

function proximaPergunta() {
  perguntaAtual++;
  mostrarPergunta();
}

btnConotacao.onclick = () => {
  if (bloqueado) return;
  if (perguntas[perguntaAtual].resposta === 'Conotação') {
    pontuacao++;
    atualizarPontuacao();
    bloquearPergunta("Correto! +1 ponto");
  } else {
    pontuacao--;
    atualizarPontuacao();
    bloquearPergunta("Errado! -1 ponto");
  }
  setTimeout(proximaPergunta, 1500);
};
btnDenotacao.onclick = () => {
  if (bloqueado) return;
  if (perguntas[perguntaAtual].resposta === 'Denotação') {
    pontuacao++;
    atualizarPontuacao();
    bloquearPergunta("Correto! +1 ponto");
  } else {
    pontuacao--;
    atualizarPontuacao();
    bloquearPergunta("Errado! -1 ponto");
  }
  setTimeout(proximaPergunta, 1500);
};