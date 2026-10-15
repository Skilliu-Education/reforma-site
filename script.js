/* =========================================================
   SKILLIU — PROTÓTIPO: COMPORTAMENTO DAS TELAS
   1. Barra superior e submenus
   2. Modais de formulário (um para cada botão)
   Protótipo: os formulários NÃO enviam dados para lugar nenhum.
   ========================================================= */

/* =========================================================
   1. BARRA SUPERIOR
   ========================================================= */
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const hamburguer = document.getElementById('hamburguer');
const botoesSubmenu = document.querySelectorAll('.menu-link[aria-controls]');

// A barra ganha sombra quando a página rola
window.addEventListener('scroll', () => {
  nav.classList.toggle('rolou', window.scrollY > 20);
}, { passive: true });

// Fecha todos os submenus (menos o que for passado)
function fecharSubmenus(excecao = null) {
  botoesSubmenu.forEach(botao => {
    if (botao === excecao) return;
    botao.setAttribute('aria-expanded', 'false');
    document.getElementById(botao.getAttribute('aria-controls')).classList.remove('aberto');
  });
}

// Clique abre ou fecha o submenu. Só um fica aberto por vez.
botoesSubmenu.forEach(botao => {
  const submenu = document.getElementById(botao.getAttribute('aria-controls'));
  botao.addEventListener('click', () => {
    const vaiAbrir = botao.getAttribute('aria-expanded') !== 'true';
    fecharSubmenus(botao);
    botao.setAttribute('aria-expanded', vaiAbrir ? 'true' : 'false');
    submenu.classList.toggle('aberto', vaiAbrir);
  });
});

// Menu do celular
function fecharMenuCelular() {
  menu.classList.remove('aberto');
  hamburguer.setAttribute('aria-expanded', 'false');
}
hamburguer.addEventListener('click', () => {
  const abriu = menu.classList.toggle('aberto');
  hamburguer.setAttribute('aria-expanded', abriu ? 'true' : 'false');
  if (!abriu) fecharSubmenus();
});

// Clicar fora da barra fecha tudo
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) { fecharSubmenus(); fecharMenuCelular(); }
});

// Esc fecha o submenu aberto
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const aberto = document.querySelector('.menu-link[aria-expanded="true"]');
  fecharSubmenus();
  if (aberto) aberto.focus();
});

// Escolheu um link do menu: fecha tudo
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { fecharSubmenus(); fecharMenuCelular(); }));

// Ano automático no rodapé
document.querySelectorAll('.ano').forEach(el => { el.textContent = new Date().getFullYear(); });


/* =========================================================
   2. MODAIS DE FORMULÁRIO
   Cada botão com data-formulario="chave" abre o modal com o
   texto daquela chave. Os campos são sempre os mesmos:
   nome, e-mail, cidade, estado e aceite dos termos.
   (O "contato" tem também uma caixa para a mensagem.)
   Textos com <span class="base"> são TEXTO BASE: precisam
   ser confirmados pela equipe.
   ========================================================= */
const FORMULARIOS = {
  turma: {
    titulo: 'Próxima turma de Cursos e Formações',
    explica: `<p>Ainda não temos a próxima turma aberta. Os cursos fazem parte da Trilha 2 do Programa SKY: formações em STEAM para professores de todas as disciplinas, não só os de exatas.</p>
              <p>Deixe seu contato. Vamos enviar um e-mail para confirmar que o endereço é seu, e é por ele que você recebe as informações quando as inscrições abrirem.</p>`,
    botao: 'Quero ser avisado(a)',
    sucesso: 'Quando a próxima turma abrir, você recebe as informações nesse e-mail.'
  },
  comunidade: {
    titulo: 'Comunidade Skillers',
    explica: `<p>Skillers são os educadores que fazem parte da comunidade Skilliu. A comunidade ainda está sendo construída.</p>
              <p>Se você tem interesse em participar, deixe seu contato. Vamos enviar um e-mail para confirmar o endereço e, quando a comunidade estiver pronta, mandamos todas as informações por lá.</p>`,
    botao: 'Quero participar',
    sucesso: 'Quando a comunidade estiver pronta, você recebe as informações nesse e-mail.'
  },
  skilliblocks: {
    titulo: 'SkilliBlocks',
    explica: `<p>O SkilliBlocks está em fase de testes. Deixe seu contato e avisamos por e-mail quando ele estiver disponível.</p>
              <p><span class="base">Como adquirir, quem compra (escola ou professor) e o que vem no kit.</span></p>`,
    botao: 'Quero ser avisado(a)',
    sucesso: 'Quando o SkilliBlocks estiver disponível, você recebe as informações nesse e-mail.'
  },
  materiais: {
    titulo: 'Materiais didáticos e edutainment',
    explica: `<p><span class="base">Esses materiais estão em produção.</span> Deixe seu contato e avisamos por e-mail quando forem lançados.</p>`,
    botao: 'Quero ser avisado(a)',
    sucesso: 'Quando os materiais forem lançados, você recebe as informações nesse e-mail.'
  },
  parcerias: {
    titulo: 'Recursos em parcerias',
    explica: `<p><span class="base">As parcerias ainda estão sendo definidas.</span> Deixe seu contato e avisamos por e-mail quando os recursos parceiros estiverem disponíveis.</p>`,
    botao: 'Quero ser avisado(a)',
    sucesso: 'Quando as parcerias estiverem disponíveis, você recebe as informações nesse e-mail.'
  },
  ebooks: {
    titulo: 'Próximos e-books',
    explica: `<p>Dicionário SKY, SkilliBlocks na Prática e 20+ Projetos com Papelão estão em produção. Deixe seu contato e avisamos por e-mail quando forem lançados.</p>`,
    botao: 'Quero ser avisado(a)',
    sucesso: 'Quando os novos e-books forem lançados, você recebe as informações nesse e-mail.'
  },
  contato: {
    titulo: 'Fale com a gente',
    explica: `<p>Conte o que você procura. Vamos enviar um e-mail para confirmar seu contato e responder por lá.</p>`,
    botao: 'Enviar',
    sucesso: 'Respondemos sua mensagem nesse e-mail.',
    mensagem: true // só este formulário tem a caixa de mensagem
  }
};

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const modal = document.getElementById('modalForm');

// Monta o conteúdo do modal para o formulário escolhido
function abrirFormulario(chave) {
  const cfg = FORMULARIOS[chave];
  if (!cfg || !modal) return;

  const opcoesEstado = ESTADOS.map(uf => `<option value="${uf}">${uf}</option>`).join('');
  const campoMensagem = cfg.mensagem ? `
      <div class="campo campo-inteiro">
        <label for="f-mensagem">O que você deseja?</label>
        <textarea id="f-mensagem" placeholder="Escreva com suas palavras"></textarea>
      </div>` : '';

  modal.innerHTML = `
    <button type="button" class="modal-fechar" aria-label="Fechar">×</button>
    <form novalidate>
      <h2 id="modalTitulo">${cfg.titulo}</h2>
      <div class="modal-explica">${cfg.explica}</div>
      <div class="campos">
        <div class="campo campo-inteiro">
          <label for="f-nome">Nome completo</label>
          <input type="text" id="f-nome" autocomplete="name" placeholder="Seu nome e sobrenome">
        </div>
        <div class="campo campo-inteiro">
          <label for="f-email">E-mail</label>
          <input type="email" id="f-email" autocomplete="email" placeholder="voce@email.com">
        </div>
        <div class="campo">
          <label for="f-cidade">Cidade</label>
          <input type="text" id="f-cidade" autocomplete="address-level2" placeholder="Sua cidade">
        </div>
        <div class="campo">
          <label for="f-estado">Estado</label>
          <select id="f-estado"><option value="">Selecione</option>${opcoesEstado}</select>
        </div>
        ${campoMensagem}
        <div class="campo campo-inteiro">
          <label class="aceite"><input type="checkbox" id="f-aceite">
            <span>Tenho 18 anos ou mais e concordo com os <a href="termos-de-uso.html" target="_blank">Termos de Uso</a> e a <a href="politica-de-privacidade.html" target="_blank">Política de Privacidade</a>.</span>
          </label>
        </div>
      </div>
      <button type="submit" class="btn btn-verde">${cfg.botao}</button>
      <p class="modal-prototipo">Protótipo: nenhum dado é enviado.</p>
    </form>`;

  modal.setAttribute('aria-labelledby', 'modalTitulo');
  modal.querySelector('.modal-fechar').addEventListener('click', () => modal.close());
  modal.querySelector('form').addEventListener('submit', (e) => enviarFormulario(e, cfg));
  modal.querySelector('form').addEventListener('input', (e) => limparErro(e.target));
  modal.showModal();
  modal.querySelector('#f-nome').focus();
}

// Fecha o modal ao clicar no fundo escuro
if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
}

// Liga cada botão ao seu formulário
document.querySelectorAll('[data-formulario]').forEach(botao => {
  botao.addEventListener('click', (e) => {
    e.preventDefault();
    fecharSubmenus();
    fecharMenuCelular();
    abrirFormulario(botao.dataset.formulario);
  });
});


/* ---------- Validação dos campos ---------- */

// Evita que o texto digitado seja lido como código HTML
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function mostrarErro(campo, mensagem) {
  campo.classList.add('invalido');
  const caixa = campo.closest('.campo');
  let erro = caixa.querySelector('.erro-campo');
  if (!erro) {
    erro = document.createElement('span');
    erro.className = 'erro-campo';
    erro.setAttribute('role', 'alert');
    caixa.appendChild(erro);
  }
  erro.textContent = mensagem;
}

function limparErro(campo) {
  const caixa = campo.closest('.campo');
  if (!caixa) return;
  campo.classList.remove('invalido');
  const erro = caixa.querySelector('.erro-campo');
  if (erro) erro.remove();
}

function enviarFormulario(e, cfg) {
  e.preventDefault();
  const nome = modal.querySelector('#f-nome');
  const email = modal.querySelector('#f-email');
  const cidade = modal.querySelector('#f-cidade');
  const estado = modal.querySelector('#f-estado');
  const aceite = modal.querySelector('#f-aceite');
  let primeiroErro = null;

  function checar(condicao, campo, mensagem) {
    if (condicao) { limparErro(campo); return; }
    mostrarErro(campo, mensagem);
    if (!primeiroErro) primeiroErro = campo;
  }

  checar(/^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/.test(nome.value.trim()), nome, 'Digite nome e sobrenome, usando apenas letras.');
  checar(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), email, 'Digite um e-mail válido, como nome@email.com.');
  checar(cidade.value.trim() !== '', cidade, 'Digite sua cidade.');
  checar(estado.value !== '', estado, 'Selecione o estado.');
  checar(aceite.checked, aceite, 'Para enviar, confirme que concorda com os termos.');

  if (primeiroErro) { primeiroErro.focus(); return; }

  // Aqui, na versão real, os dados seriam enviados (por exemplo, para a planilha do Google).
  // No protótipo, só mostramos a confirmação.
  const primeiroNome = escapar(nome.value.trim().split(' ')[0]);
  const emailDigitado = escapar(email.value.trim());
  modal.innerHTML = `
    <button type="button" class="modal-fechar" aria-label="Fechar">×</button>
    <div class="modal-sucesso">
      <i class="fa-solid fa-envelope-circle-check" aria-hidden="true"></i>
      <h2>Quase lá, ${primeiroNome}!</h2>
      <p>Enviamos um e-mail para <strong>${emailDigitado}</strong>. Abra e confirme seu contato.</p>
      <p>${cfg.sucesso}</p>
      <button type="button" class="btn btn-verde" data-fechar>Entendido</button>
    </div>`;
  modal.querySelectorAll('.modal-fechar, [data-fechar]').forEach(b => b.addEventListener('click', () => modal.close()));
}
