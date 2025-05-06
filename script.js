// Fundo Matrix animado
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const fontSize = 18;
const columns = Math.floor(width / fontSize);
const drops = Array.from({ length: columns }, () => Math.random() * -1000);

const letters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < columns; i++) {
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

// Botões principais
const btnCreditos = document.getElementById('btn-creditos');
const btnVoltarCreditos = document.getElementById('btn-voltar-creditos');
const creditos = document.getElementById('creditos');
const menu = document.getElementById('menu');
const btnJogar = document.getElementById('btn-jogar');
const personagem = document.getElementById('personagem');
const btnVoltarMenu = document.getElementById('btn-voltar-menu');
const game = document.getElementById('game');
const btnSairJogo = document.getElementById('btn-sair-jogo');
const personagemEscolhidoDiv = document.getElementById('personagem-escolhido');

let personagemEscolhido = null;

btnCreditos.onclick = () => {
  menu.classList.add('hidden');
  personagem.classList.add('hidden');
  game.classList.add('hidden');
  creditos.classList.remove('hidden');
};
btnVoltarCreditos.onclick = () => {
  creditos.classList.add('hidden');
  menu.classList.remove('hidden');
  personagem.classList.add('hidden');
  game.classList.add('hidden');
};

btnJogar.onclick = () => {
  menu.classList.add('hidden');
  personagem.classList.remove('hidden');
  game.classList.add('hidden');
  creditos.classList.add('hidden');
};
btnVoltarMenu.onclick = () => {
  personagem.classList.add('hidden');
  menu.classList.remove('hidden');
  game.classList.add('hidden');
  creditos.classList.add('hidden');
  // reset seleção personagem visual (remove balão e botão continuar abertos)
  document.querySelectorAll('.personagem-card').forEach(card => {
    card.classList.remove('selecionado');
    card.querySelector('.habilidade-dialogo').textContent = '';
    card.querySelector('.habilidade-dialogo').style.opacity = 0;
    card.querySelector('.btn-continuar').classList.add('hidden');
  });
};
btnSairJogo.onclick = () => {
  personagemEscolhido = null;
  personagemEscolhidoDiv.innerHTML = '';
  game.classList.add('hidden');
  menu.classList.remove('hidden');
  personagem.classList.add('hidden');
  creditos.classList.add('hidden');
};

// Seleção de personagem: balão sobreposto e continuar
document.querySelectorAll('.personagem-card').forEach(card => {
  const dialogo = card.querySelector('.habilidade-dialogo');
  const btnContinuar = card.querySelector('.btn-continuar');

  function abrirDialogo() {
    // Fecha balões e botões de todos os outros personagens antes
    document.querySelectorAll('.personagem-card').forEach(outro => {
      if (outro !== card) {
        outro.classList.remove('selecionado');
        outro.querySelector('.habilidade-dialogo').textContent = '';
        outro.querySelector('.habilidade-dialogo').style.opacity = 0;
        outro.querySelector('.btn-continuar').classList.add('hidden');
      }
    });
    dialogo.textContent = `${card.dataset.nome}: ${card.dataset.habilidade}`;
    dialogo.style.opacity = 1;
    card.classList.add('selecionado');
    btnContinuar.classList.remove('hidden');
    // Garante que está acima de todas as opções
    dialogo.style.zIndex = 30;
  }

  function fecharDialogo() {
    if (!card.classList.contains('selecionado')) {
      dialogo.textContent = '';
      dialogo.style.opacity = 0;
      btnContinuar.classList.add('hidden');
    }
  }

  card.addEventListener('mouseenter', abrirDialogo);
  card.addEventListener('mouseleave', fecharDialogo);
  card.addEventListener('focus', abrirDialogo);
  card.addEventListener('blur', fecharDialogo);
  card.addEventListener('click', abrirDialogo);
  card.addEventListener('keypress', (e) => {
    if (e.key === "Enter" || e.key === " ") {
      abrirDialogo();
    }
  });

  btnContinuar.addEventListener('click', () => {
    personagemEscolhido = {
      nome: card.dataset.nome,
      habilidade: card.dataset.habilidade,
      img: card.querySelector('img').src
    };
    personagem.classList.add('hidden');
    game.classList.remove('hidden');
    mostrarPersonagemEscolhido();
    // Limpa seleção visual para próxima vez
    document.querySelectorAll('.personagem-card').forEach(card => {
      card.classList.remove('selecionado');
      card.querySelector('.habilidade-dialogo').textContent = '';
      card.querySelector('.habilidade-dialogo').style.opacity = 0;
      card.querySelector('.btn-continuar').classList.add('hidden');
    });
  });
});

function mostrarPersonagemEscolhido() {
  if (personagemEscolhido) {
    personagemEscolhidoDiv.innerHTML = `
      <div class="mini-personagem">
        <img src="${personagemEscolhido.img}" alt="${personagemEscolhido.nome}">
        <span>${personagemEscolhido.nome}</span>
        <div class="mini-habilidade">${personagemEscolhido.habilidade}</div>
      </div>
    `;
  }
}

let jumpscareDesativado = false;

document.getElementById('btn-jumpscare-secret').onclick = function() {
  const senha = prompt('Digite a senha:');
  if (senha === '4002') {
    jumpscareDesativado = true;
    alert('Jumpscare desativado!');
  } else if (senha !== null) {
    alert('Senha incorreta!');
  }
};

if (!jumpscareJaApareceu && !jumpscareDesativado) {
  const chanceJumpscare = CHANCE_BASE_JUMPSCARE + (errosConsecutivos * AUMENTO_CHANCE_POR_ERRO);
  if (Math.random() < chanceJumpscare) {
    mostrarJumpscare();
    jumpscareJaApareceu = true;
  }
}