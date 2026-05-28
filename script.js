// Aguarda o carregamento completo da árvore DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialização dos módulos do sistema
    inicializarAcordeao();
    inicializarAcessibilidade();
    inicializarFormularios();
});

/* ==========================================================================
   MÓDULO: ACORDEÃO INTERATIVO (Benefícios com IA)
   ========================================================================== */
function inicializarAcordeao() {
    const botoesAcordeao = document.querySelectorAll('.acordeao-header');
    
    botoesAcordeao.forEach(botao => {
        botao.addEventListener('click', () => {
            const itemAtual = botao.parentElement;
            const estaAtivo = itemAtual.classList.contains('ativo');
            
            // Fecha todos os itens antes de abrir o alvo (comportamento de sanfona única)
            document.querySelectorAll('.acordeao-item').forEach(item => {
                item.classList.remove('ativo');
                item.querySelector('.acordeao-header').setAttribute('aria-expanded', 'false');
            });
            
            // Se não estava ativo, abre o elemento clicado
            if (!estaAtivo) {
                itemAtual.classList.add('ativo');
                botao.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ==========================================================================
   MÓDULO: ACESSIBILIDADE ENGINE (Fontes, Dark Mode & Speech API)
   ========================================================================== */
function inicializarAcessibilidade() {
    let tamanhoFonteAtual = 100; // Representa porcentagem base
    const elementoHtml = document.documentElement;
    
    // Referências do DOM do painel flutuante
    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDiminuir = document.getElementById('btn-diminuir');
    const btnTema = document.getElementById('btn-tema');
    const btnFalar = document.getElementById('btn-falar');
    const btnParar = document.getElementById('btn-parar');

    // Controle de dimensionamento de fontes
    btnAumentar.addEventListener('click', () => {
        if (tamanhoFonteAtual < 140) {
            tamanhoFonteAtual += 10;
            elementoHtml.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    btnDiminuir.addEventListener('click', () => {
        if (tamanhoFonteAtual > 80) {
            tamanhoFonteAtual -= 10;
            elementoHtml.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    // Controle do Modo Escuro / Claro
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    /* INTEGRAÇÃO COM SPEECHSYNTHESIS API (Leitura Assistida) */
    let synthUtterance = null;

    btnFalar.addEventListener('click', () => {
        // Alvo estrito: captura apenas o texto interno do container de foco da leitura
        const areaFocoTexto = document.querySelector('.conteudo-foco');
        if (!areaFocoTexto) return;

        // Limpeza de fluxo: extrai apenas textos de parágrafos e subtítulos, ignorando botões do acordeão
        const blocosTexto = areaFocoTexto.querySelectorAll('p, h2, blockquote');
        let textoCompleto = '';
        
        blocosTexto.forEach(bloco => {
            // Ignora textos contidos dentro do acordeão oculto ou de botões estruturais
            if (!bloco.closest('.beneficios-acordeao') || bloco.closest('.acordeao-item.ativo')) {
                textoCompleto += bloco.innerText + '. ';
            }
        });

        if ('speechSynthesis' in window) {
            // Cancela leituras anteriores ativas
            window.speechSynthesis.cancel();

            synthUtterance = new SpeechSynthesisUtterance(textoCompleto);
            synthUtterance.lang = 'pt-BR';
            synthUtterance.rate = 1.1; // Velocidade ideal de usabilidade

            // Eventos de estado para gerenciar os botões da interface
            synthUtterance.onstart = () => {
                btnFalar.disabled = true;
                btnParar.disabled = false;
            };

            synthUtterance.onend = () => {
                btnFalar.disabled = false;
                btnParar.disabled = true;
            };

            synthUtterance.onerror = () => {
                btnFalar.disabled = false;
                btnParar.disabled = true;
            };

            window.speechSynthesis.speak(synthUtterance);
        } else {
            alert('A API de conversão de voz não é suportada nativamente pelo seu navegador atual.');
        }
    });

    btnParar.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            btnFalar.disabled = false;
            btnParar.disabled = true;
        }
    });
}

/* ==========================================================================
   MÓDULO: FORMULÁRIOS & GESTÃO DE INTERAÇÃO (COMENTÁRIOS E SEMINÁRIO)
   ========================================================================== */
function inicializarFormularios() {
    const formSeminario = document.getElementById('form-seminario');
    const formComentario = document.getElementById('form-comentario');
    const listaComentarios = document.getElementById('lista-comentarios');

    // Tratamento do Formulário de Inscrição do Seminário (Sidebar)
    formSeminario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const dadosInscricao = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            pais: document.getElementById('pais').value
        };

        // Simulação de salvamento em console (Auxílio para Debugging assistido)
        console.log('Inscrição no Seminário realizada com sucesso:', dadosInscricao);
        
        alert(`Obrigado por se inscrever, ${dadosInscricao.nome}! O link do seminário foi enviado para ${dadosInscricao.email}.`);
        formSeminario.reset();
    });

    // Tratamento da Caixa de Comentários
    formComentario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const campoTexto = document.getElementById('texto-comentario');
        const textoInjetado = campoTexto.value.trim();

        if (textoInjetado) {
            // Criação do elemento de comentário estruturado de forma moderna
            const itemComentario = document.createElement('div');
            itemComentario.classList.add('comentario-item');
            
            // Injeta marcação limpa com data e hora simuladas
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            itemComentario.innerHTML = `
                <p><strong>Leitor Conectado</strong> <small style="color: var(--cor-texto-mutado);">• Postado em ${dataAtual}</small></p>
                <p style="margin-top: 5px; font-size: 0.95rem;">${textoInjetado}</p>
            `;

            // Insere no topo da lista de comentários
            listaComentarios.insertBefore(itemComentario, listaComentarios.firstChild);
            
            campoTexto.value = '';
            console.log('Novo comentário registrado no sistema.');
        }
    });
}