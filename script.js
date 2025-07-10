document.addEventListener('DOMContentLoaded', () => {
    const funnelContainer = document.getElementById('funnel-container');
    const pages = document.querySelectorAll('.funnel-page');
    const progressBar = document.getElementById('progressBar');
    const nextButtons = document.querySelectorAll('.next-page-button');
    const prevButtons = document.querySelectorAll('.prev-page-button');
    const userNameInput = document.getElementById('userName');
    const nextToProductButton = document.getElementById('nextToProduct');
    const productIntroTitle = document.getElementById('product-intro-title');
    const whatYouGetTitle = document = document.getElementById('what-you-get-title');
    const testimonialsTitle = document.getElementById('testimonials-title');
    const videoTitle = document.getElementById('video-title');
    const finalCtaTitle = document.getElementById('final-cta-title');

    // Mapeamento de IDs de página para índices para a barra de progresso
    const pageOrder = [
        'page-1', 'page-1-q2', 'page-1-q3', 'page-1-q4', 'page-1-q5', 'page-1-q6', 'page-1-q7',
        'page-name', 'page-2', 'page-3', 'page-4', 'page-5', 'page-6'
    ];

    let currentPageIndex = 0;

    // Funções para atualizar o título da página
    function updatePageTitles(userName) {
        if (productIntroTitle) {
            productIntroTitle.innerHTML = `Olá, ${userName || 'visitante'}! <br> Você está prestes a descobrir:`;
        }
        if (whatYouGetTitle) {
            whatYouGetTitle.innerHTML = `E tem mais, ${userName || 'você'} vai receber:`;
        }
        if (testimonialsTitle) {
            testimonialsTitle.innerHTML = `Histórias de Sucesso Reais de Pessoas como ${userName || 'Você'}!`;
        }
        if (videoTitle) {
            videoTitle.innerHTML = `Assista ao Vídeo Completo, ${userName || 'Amiga(o)'}!`;
        }
        if (finalCtaTitle) {
            finalCtaTitle.innerHTML = `${userName || 'Você'} Está a um Passo da Sua Transformação!`;
        }
    }

    // Função para mostrar a página
    function showPage(pageId, direction = 'next') {
        const currentPage = document.querySelector('.funnel-page.active');
        const nextPage = document.getElementById(pageId);

        if (!nextPage) {
            console.error(`Page with ID ${pageId} not found.`);
            return;
        }

        const prevIndex = pageOrder.indexOf(currentPage.id);
        const nextIndex = pageOrder.indexOf(pageId);

        // *** LÓGICA ATUALIZADA DE CONTROLE DO VÍDEO ***
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            // Se a página atual é a página do vídeo (page-5)
            if (currentPage.id === 'page-5') {
                videoPlayer.pause(); // Pausa o vídeo
                videoPlayer.currentTime = 0; // Reinicia o vídeo para o início
                console.log('Vídeo pausado e reiniciado ao sair da página 5.'); // Para depuração
            }
            // Não é necessário dar play ao entrar na página 5, o usuário fará manualmente
        }
        // *** FIM DA LÓGICA ATUALIZADA DE CONTROLE DO VÍDEO ***


        // 1. Prepara a página atual para a animação de saída
        // Remove quaisquer classes de animação de entrada anteriores para evitar conflitos
        currentPage.classList.remove('slide-in-right', 'slide-back');
        if (direction === 'next') {
            currentPage.classList.add('slide-out-left');
        } else {
            currentPage.classList.add('slide-out-right');
        }
        
        // Define a função a ser executada APÓS a animação de saída da página atual
        const handleCurrentPageExit = () => {
            // Remove as classes de animação e a classe 'active' da página atual
            currentPage.classList.remove('active', 'slide-out-left', 'slide-out-right');
            currentPage.style.display = 'none'; // Esconde a página após a animação
            currentPage.removeEventListener('animationend', handleCurrentPageExit); // Limpa o listener

            // 2. Prepara a próxima página para a animação de entrada
            nextPage.style.display = 'flex'; // Torna a próxima página visível (mas ainda não animada)
            if (direction === 'next') {
                nextPage.classList.add('slide-in-right');
            } else {
                nextPage.classList.add('slide-back');
            }
            
            // Um pequeno delay para garantir que a propriedade display:flex seja aplicada
            // antes que a classe 'active' e as classes de animação de entrada sejam adicionadas.
            setTimeout(() => {
                nextPage.classList.add('active'); // Adiciona 'active' para iniciar a animação e definir como página ativa
                nextPage.classList.remove('slide-in-right', 'slide-back'); // Remove classes de animação de entrada
            }, 50); // Pequeno delay, ajuste se a animação parecer "quebrada"
        };

        // Adiciona o listener para o final da animação de saída da página atual
        currentPage.addEventListener('animationend', handleCurrentPageExit, { once: true });

        // **IMPORTANTE:** Fallback para garantir a transição mesmo sem animação CSS
        // Se a animação-duration no CSS for 0s ou não estiver definida, o 'animationend' não dispara.
        // Neste caso, executamos a transição imediatamente.
        const computedStyle = getComputedStyle(currentPage);
        const animationDuration = parseFloat(computedStyle.animationDuration);

        if (animationDuration === 0 || isNaN(animationDuration)) {
            handleCurrentPageExit(); // Executa a lógica de transição imediatamente
        }

        // Atualiza a barra de progresso e o índice da página
        currentPageIndex = nextIndex;
        updateProgressBar();
    }

    // Função para atualizar a barra de progresso
    function updateProgressBar() {
        const totalPages = pageOrder.length;
        const progress = ((currentPageIndex + 1) / totalPages) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Navegação para a próxima página (botões de resposta do quiz)
    document.querySelectorAll('.answer-button').forEach(button => {
        button.addEventListener('click', () => {
            const nextPageId = button.dataset.nextPage;
            if (nextPageId) {
                showPage(nextPageId, 'next');
            }
        });
    });

    // Navegação para a próxima página (botão "Continuar" da página de nome)
    nextToProductButton.addEventListener('click', () => {
        const userName = userNameInput.value.trim();
        showPage('page-2', 'next'); // Chama showPage, que se encarregará de atualizar os títulos
    });

    // Navegação para a próxima página (botões "Avançar" gerais)
    nextButtons.forEach(button => {
        if (button.id === 'nextToProduct') return; // Ignora, pois já tem um listener específico

        button.addEventListener('click', () => {
            const nextPageId = button.dataset.nextPage;
            if (nextPageId) {
                showPage(nextPageId, 'next');
            }
        });
    });

    // Navegação para a página anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentPageId = document.querySelector('.funnel-page.active').id;
            const currentIndex = pageOrder.indexOf(currentPageId);

            if (currentIndex > 0) {
                const prevPageId = pageOrder[currentIndex - 1];
                showPage(prevPageId, 'prev');
            }
        });
    });

    // O listener de 'transitionend' no container foi simplificado,
    // pois a atualização dos títulos agora é feita de forma mais controlada dentro de showPage.
    funnelContainer.addEventListener('transitionend', (event) => {
        if (event.target.classList.contains('funnel-page') && event.target.classList.contains('active')) {
            const userName = userNameInput.value.trim();
            updatePageTitles(userName);
        }
    });

    // Inicialização ao carregar a página
    updateProgressBar();
    const initialUserName = userNameInput.value.trim();
    updatePageTitles(initialUserName);
});