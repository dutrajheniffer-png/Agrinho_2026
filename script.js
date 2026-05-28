document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONTROLE DE INTERAÇÃO DO ACCORDION EXPANSÍVEL
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Fechar outros accordions ativos para limpeza visual futurista (opcional)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-content').setAttribute('aria-hidden', 'true');
                }
            });

            // Alternar estado do item clicado
            item.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);
        });
    });

    /* ==========================================================================
       2. REQUISITO DE ACESSIBILIDADE: CONTROLE FLUTUANTE
       ========================================================================== */
    const btnMenuAcessibilidade = document.getElementById('btn-acessibilidade-menu');
    const containerAcessibilidade = document.querySelector('.acessibilidade-container');
    const btnAumentarFonte = document.getElementById('btn-aumentar-fonte');
    const btnDiminuirFonte = document.getElementById('btn-diminuir-fonte');
    const btnAlternarTema = document.getElementById('btn-alternar-tema');
    const btnLerVoz = document.getElementById('btn-ler-voz');
    const btnPararVoz = document.getElementById('btn-parar-voz');

    let currentScale = 1.0;
    const maxScale = 1.4;
    const minScale = 0.85;

    // Toggle menu flutuante
    btnMenuAcessibilidade.addEventListener('click', () => {
        const isActive = containerAcessibilidade.classList.toggle('active');
        btnMenuAcessibilidade.setAttribute('aria-expanded', isActive);
        document.getElementById('acessibilidade-opcoes').setAttribute('aria-hidden', !isActive);
    });

    // Fechar menu de acessibilidade clicando fora
    document.addEventListener('click', (e) => {
        if (!containerAcessibilidade.contains(e.target)) {
            containerAcessibilidade.classList.remove('active');
            btnMenuAcessibilidade.setAttribute('aria-expanded', 'false');
            document.getElementById('acessibilidade-opcoes').setAttribute('aria-hidden', 'true');
        }
    });

    // Alterar escala da fonte nativa e acessível
    btnAumentarFonte.addEventListener('click', () => {
        if (currentScale < maxScale) {
            currentScale += 0.08;
            document.documentElement.style.setProperty('--font-scale', currentScale);
        }
    });

    btnDiminuirFonte.addEventListener('click', () => {
        if (currentScale > minScale) {
            currentScale -= 0.08;
            document.documentElement.style.setProperty('--font-scale', currentScale);
        }
    });

    // Alternador de Tema Escuro / Claro
    btnAlternarTema.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        btnAlternarTema.textContent = isLight ? 'Modo Escuro' : 'Modo Claro';
    });

    /* ==========================================================================
       3. SPEECH SYNTHESIS API (LEITURA POR VOZ ACESSÍVEL)
       ========================================================================== */
    let synth = window.speechSynthesis;
    let utterance = null;

    btnLerVoz.addEventListener('click', () => {
        // Se já estiver falando, para antes de reiniciar
        if (synth.speaking) {
            synth.cancel();
        }

        // Seleciona exclusivamente o conteúdo textual principal, omitindo menus e botões
        const conteudoPrincipal = document.getElementById('conteudo-principal');
        
        // Clona o nó para extrair texto de forma limpa sem destruir a interface
        const clone = conteudoPrincipal.cloneNode(true);
        
        // Remove elementos indesejados na leitura (Botões, formulários, comentários)
        const elementosIgnorados = clone.querySelectorAll('button, form, aside, .comments-section, script, style');
        elementosIgnorados.forEach(el => el.remove());

        const textoParaLer = clone.innerText.trim();

        if (textoParaLer) {
            utterance = new SpeechSynthesisUtterance(textoParaLer);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0;
            
            // Alteração visual indicativa durante áudio ativo
            btnLerVoz.style.backgroundColor = 'var(--cor-amarelo-tech)';
            
            utterance.onend = () => {
                btnLerVoz.style.backgroundColor = '';
            };
            
            utterance.onerror = () => {
                btnLerVoz.style.backgroundColor = '';
            };

            synth.speak(utterance);
        }
    });

    btnPararVoz.addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
            btnLerVoz.style.backgroundColor = '';
        }
    });

    /* ==========================================================================
       4. INTERATIVIDADE E VALIDAÇÃO DE FORMULÁRIO DE INSCRIÇÃO
       ========================================================================== */
    const cadastroForm = document.getElementById('cadastro-seminario');
    const formFeedback = document.getElementById('form-feedback');

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação de requisição AJAX API corporativa
        btnForm = cadastroForm.querySelector('.btn-form-submit');
        const originalText = btnForm.textContent;
        btnForm.textContent = 'Processando Registro...';
        btnForm.disabled = true;

        setTimeout(() => {
            btnForm.textContent = originalText;
            btnForm.disabled = false;
            formFeedback.style.display = 'block';
            cadastroForm.reset();
            
            // Oculta feedback após 6 segundos automaticamente
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 6000);
        }, 1200);
    });

    /* ==========================================================================
       5. SESSÃO DE INTERAÇÃO DO LEITOR (SISTEMA DINÂMICO DE COMENTÁRIOS)
       ========================================================================== */
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const txtComentario = document.getElementById('txt-comentario');
        const texto = txtComentario.value.trim();

        if (texto) {
            const novoComentario = document.createElement('div');
            novoComentario.className = 'comment-item';
            
            // Estruturação semântica do novo comentário inserido em tempo de execução
            novoComentario.innerHTML = `
                <div class="comment-meta"><strong>Leitor Conectado</strong> &bull; Agora mesmo</div>
                <div class="comment-body">${escapeHTML(texto)}</div>
            `;
            
            // Insere no topo da lista de comentários
            commentsList.insertBefore(novoComentario, commentsList.firstChild);
            txtComentario.value = '';
        }
    });

    // Função utilitária de sanitização básica contra ataques XSS injetados via formulário
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});