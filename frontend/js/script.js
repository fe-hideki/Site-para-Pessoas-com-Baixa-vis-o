document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    const mainApp = document.getElementById('main-app');
    const profileCard = document.getElementById('current-profile');
    const sidebarContent = document.querySelector('.sidebar-content');
    const tabs = document.querySelectorAll('.nav-tab');
    document.getElementById('btn-pass').addEventListener('click', handlePass);
    document.getElementById('btn-like').addEventListener('click', handleLike);
    document.getElementById('btn-super').addEventListener('click', handleSuperLike);
    document.getElementById('btn-undo').addEventListener('click', handleUndo);
    document.getElementById('btn-boost').addEventListener('click', handleBoost);
    document.getElementById('btn-info').addEventListener('click', (e) => {
        e.stopPropagation();
        handleInfo();
    });
    profileCard.addEventListener('click', handleOpenProfile);

    const synth = window.speechSynthesis;
    let isAppActive = false;
    let currentPhotoIndex = 1;

    // Dados fictícios para as abas
    const mockData = {
        matches: [
            { name: "Ana", age: 22, lastAction: "Curtiu você" },
            { name: "Lucas", age: 25, lastAction: "Novo Match" },
            { name: "Carla", age: 20, lastAction: "Curtiu você" }
        ],
        messages: [
            { name: "Marcos", preview: "Oi! Tudo bem com você?" },
            { name: "Beatriz", preview: "Amei o seu áudio de bio!" }
        ]
    };

    // --- FUNÇÕES DE ÁUDIO ---

    function speak(text) {
        if (!isAppActive) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 2.0;
        synth.speak(utterance);
    }

    function playTutorial() {
        const tutorial = `
            Bem-vindo ao Audio Match. Vou te ensinar os comandos principais.
            Use as setas para os lados: Esquerda para passar e Direita para curtir.
            Seta para cima abre o perfil completo e Seta para baixo fecha.
            Pressione Enter para dar um Super Like.
            Barra de espaço para passar para a próxima foto.
            Pressione a tecla I para ouvir informações detalhadas sobre a pessoa.
            Pressione a V para voltar ou desfazer a última ação.
            E a tecla B para dar boost no perfil.
            O perfil atual é Gi, 19 anos, a 11 quilômetros.
        `;
        speak(tutorial);
    }

    // --- LÓGICA DE INTERFACE ---

    function switchTab(tabType) {
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = Array.from(tabs).find(t => t.innerText.toLowerCase().includes(tabType === 'matches' ? 'match' : 'mensagens'));
        if (activeTab) activeTab.classList.add('active');

        renderSidebarList(tabType);
        speak(`Aba de ${tabType === 'matches' ? 'Matches' : 'Mensagens'} selecionada. Você tem ${mockData[tabType].length} itens nesta lista.`);
    }

    function renderSidebarList(type) {
        sidebarContent.innerHTML = ''; // Limpa o estado vazio
        const list = document.createElement('ul');
        list.className = 'audio-list';
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.width = '100%';

        mockData[type].forEach(item => {
            const li = document.createElement('li');
            li.style.padding = '15px';
            li.style.borderBottom = '1px solid #222';
            li.style.textAlign = 'left';
            li.tabIndex = 0;
            li.innerHTML = `
                <strong style="display:block">${item.name}</strong>
                <span style="color:#8e94ce; font-size: 0.85rem">${type === 'matches' ? item.lastAction : item.preview}</span>
            `;
            li.addEventListener('focus', () => speak(`${item.name}. ${type === 'matches' ? item.lastAction : 'Mensagem: ' + item.preview}`));
            list.appendChild(li);
        });
        sidebarContent.appendChild(list);
    }

    // --- HANDLERS DE AÇÃO (TECLADO) ---

    function handleLike() {
        speak("Você curtiu Gi. Match encontrado! Pressione M para conversar.");
    }

    function handlePass() {
        speak("Perfil recusado. Próximo perfil: Carlos, 22 anos.");
    }

    function handleOpenProfile() {
        speak("Abrindo perfil completo de Gi. Bio: Adoro trilhas e música indie. Procuro alguém para dividir um café.");
    }

    function handleCloseProfile() {
        speak("Perfil de Gi fechado. Voltando para a visualização principal.");
    }

    function handleSuperLike() {
        speak("Super Like enviado para Gi! Ela será notificada agora.");
    }

    function handleNextPhoto() {
        currentPhotoIndex = currentPhotoIndex >= 3 ? 1 : currentPhotoIndex + 1;
        speak(`Exibindo foto ${currentPhotoIndex} de 3.`);
    }

    function handleInfo() {
        speak("Informações de Gi: Signo de Gêmeos, Estuda Psicologia, Gosta de Cães. Distância: 11 quilômetros.");
    }

    function handleUndo() {
        speak("Ação desfeita. Voltando para o perfil anterior.");
    }

    function handleBoost() {
        speak("Você deu Boost no perfil");
    }

    // --- EVENTOS ---

    document.getElementById('btn-start').addEventListener('click', () => {
        startOverlay.style.display = 'none';
        mainApp.setAttribute('aria-hidden', 'false');
        isAppActive = true;
        playTutorial();
        profileCard.focus();
    });

    // Clique nas abas
    tabs[0].addEventListener('click', () => switchTab('matches'));
    tabs[1].addEventListener('click', () => switchTab('messages'));

    // Mapeamento de Teclas
    document.addEventListener('keydown', (e) => {
        if (!isAppActive) return;

        switch (e.key) {
            case 'ArrowLeft':
                document.getElementById('btn-pass').focus();
                handlePass();
                break;
            case 'ArrowRight':
                document.getElementById('btn-like').focus();
                handleLike();
                break;
            case 'Enter':
                document.getElementById('btn-super').focus();
                handleSuperLike();
                break;
            case 'ArrowUp':
                profileCard.focus();
                handleOpenProfile();
                break;
            case 'ArrowDown':
                handleCloseProfile();
                break;
            case ' ': e.preventDefault();
                handleNextPhoto();
                break;
            case 'i': case 'I':
                document.getElementById('btn-info').focus();
                handleInfo();
                break;
            case 'v': case 'V':
                document.getElementById('btn-undo').focus();
                handleUndo();
                break;
            case 'b': case 'B':
                document.getElementById('btn-boost').focus();
                handleBoost();
                break;
        }


    });
});