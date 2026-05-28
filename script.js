// Monitora a construção e prontidão da estrutura DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialização assíncrona dos módulos funcionais
    inicializarSanfonaBeneficios();
    inicializarEngineAcessibilidade();
    inicializarGerenciamentoFormularios();
});

/* ==========================================================================
   MÓDULO 1: ACORDEÃO INTERATIVO (Sanfona Expandível de Recursos)
   ========================================================================== */
function inicializarSanfonaBeneficios() {
    const cabecalhosAcordeao = document.querySelectorAll('.acordeao-header');
    
    cabecalhosAcordeao.forEach(cabecalho => {
        cabecalho.addEventListener('click', () => {
            const itemSelecionado = cabecalho.parentElement;
            const itemJaEstavaAtivo = itemSelecionado.classList.contains('ativo');
            
            // Colapsa de forma sistêmica todos os outros cards abertos
            document.querySelectorAll('.acordeao-item').forEach(item => {
                item.classList.remove('ativo');
                item.querySelector('.acordeao-header').setAttribute('aria-expanded', 'false');
            });
            
            // Abre seletivamente o item clicado se ele estava fechado
            if (!itemJaEstavaAtivo) {
                itemSelecionado.classList.add('ativo');
                cabecalho.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ==========================================================================
   MÓDULO 2: SISTEMA DE ACESSIBILIDADE FLUTUANTE (Fontes, Temas e Voz)
   ========================================================================== */
function inicializarEngineAcessibilidade() {
    let escalaEscopoFonte = 100; // Porcentagem inicial
    const noRaizHtml = document.documentElement;
    
    // Captura dos elementos do painel flutuante superior direito
    const gatilhoAumentar = document.getElementById('btn-aumentar');
    const gatilhoDiminuir = document.getElementById('btn-diminuir');
    const gatilhoTema = document.getElementById('btn-tema');
    const gatilhoFalar = document.getElementById('btn-falar');
    const gatilhoParar = document.getElementById('btn-parar');

    // Funções de Escalonamento de Fontes
    gatilhoAumentar.addEventListener('click', () => {
        if (escalaEscopoFonte < 140) {
            escalaEscopoFonte += 10;
            noRaizHtml.style.fontSize = `${escalaEscopoFonte}%`;
        }
    });

    gatilhoDiminuir.addEventListener('click', () => {
        if (escalaEscopoFonte > 80) {
            escalaEscopoFonte -= 10;
            noRaizHtml.style.fontSize = `${escalaEscopoFonte}%`;
        }
    });

    // Gatilho de Chaveamento de Contraste (Modo Claro / Escuro)
    gatilhoTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    /* REQUISITO: TEXT-TO-SPEECH VIA SPEECHSYNTHESIS API */
    let locucaoInstanciada = null;

    gatilhoFalar.addEventListener('click', () => {
        const principalConteudoAlvo = document.querySelector('.conteudo-foco');
        if (!principalConteudoAlvo) return;

        // Captura estritamente os nós textuais sem ler componentes de interface ou botões
        const nósDeTextoSemanticos = principalConteudoAlvo.querySelectorAll('p, h2, blockquote');
        let compiladoTextoFinal = '';
        
        nósDeTextoSemanticos.forEach(no => {
            // Regra de Isolamento: Ignora o texto se pertencer a um acordeão colapsado
            if (!no.closest('.beneficios-acordeao') || no.closest('.acordeao-item.ativo')) {
                compiladoTextoFinal += no.innerText + '. ';
            }
        });

        if ('speechSynthesis' in window) {
            // Zera qualquer instância residual de fala em execução no navegador
            window.speechSynthesis.cancel();

            locucaoInstanciada = new SpeechSynthesisUtterance(compiladoTextoFinal);
            locucaoInstanciada.lang = 'pt-BR';
            locucaoInstanciada.rate = 1.05; // Cadência ideal de fala legível

            // Eventos do Ciclo de Vida da Síntese de Voz
            locucaoInstanciada.onstart = () => {
                gatilhoFalar.disabled = true;
                gatilhoParar.disabled = false;
            };

            locucaoInstanciada.onend = () => {
                gatilhoFalar.disabled = false;
                gatilhoParar.disabled = true;
            };

            locucaoInstanciada.onerror = () => {
                gatilhoFalar.disabled = false;
                gatilhoParar.disabled = true;
            };

            window.speechSynthesis.speak(locucaoInstanciada);
        } else {
            alert('A API de leitura por voz nativa não é suportada neste navegador.');
        }
    });

    gatilhoParar.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            gatilhoFalar.disabled = false;
            gatilhoParar.disabled = true;
        }
    });
}

/* ==========================================================================
   MÓDULO 3: GESTÃO E CAPTURA DE FORMULÁRIOS & COMENTÁRIOS NATIVOS
   ========================================================================== */
function inicializarGerenciamentoFormularios() {
    const elementoFormSeminario = document.getElementById('form-seminario');
    const elementoFormComentario = document.getElementById('form-comentario');
    const containerListaComentarios = document.getElementById('lista-comentarios');

    // Escuta de Inscrições do Seminário On-line (Sidebar Direita)
    elementoFormSeminario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const pacoteInscricao = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            pais: document.getElementById('pais').value
        };

        // Feedback visual e console de depuração técnica para monitoria
        console.log('Inscrição Registrada no Banco de Dados:', pacoteInscricao);
        alert(`Sucesso, ${pacoteInscricao.nome}! Inscrição confirmada para o seminário on-line.`);
        elementoFormSeminario.reset();
    });

    // Escuta e Tratamento da Área de Comentários Acessível
    elementoFormComentario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const inputTextoComentario = document.getElementById('texto-comentario');
        const conteudoFormatado = inputTextoComentario.value.trim();

        if (conteudoFormatado) {
            const novoItemComentario = document.createElement('div');
            novoItemComentario.classList.add('comentario-item');
            
            const timestampAtual = new Date().toLocaleDateString('pt-BR');
            
            // Injeta marcação estruturada limpa e segura
            novoItemComentario.innerHTML = `
                <p><strong>Produtor Conectado</strong> <small style="color: var(--cor-amarelo);">• Enviado em ${timestampAtual}</small></p>
                <p style="margin-top: 6px; font-size: 0.95rem;">${conteudoFormatado}</p>
            `;

            // Adiciona no topo da lista por relevância cronológica
            containerListaComentarios.insertBefore(novoItemComentario, containerListaComentarios.firstChild);
            
            inputTextoComentario.value = '';
            console.log('Interação com o leitor adicionada com sucesso na árvore DOM.');
        }
    });
}