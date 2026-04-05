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

    
    const btnCloseDetails = document.getElementById('btn-close-details');
    if (btnCloseDetails) {
        btnCloseDetails.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCloseProfile();
        });
    }

    const synth = window.speechSynthesis;
    let isAppActive = false;
    let currentPhotoIndex = 1;
    let currentProfileIndex = 0; 

    
    const profilesData = [
        { name: "Giovanna", age: 19, distance: "11", bio: "Signo de Gêmeos, Estuda Psicologia. Gosta de Cães.", img: "../img/gi.png", verified: true },
        { name: "Pedro", age: 24, distance: "5", bio: "Engenheiro, amo esportes e cozinhar nos fins de semana. Bora tomar um açaí?", img: "../img/pedro.avif", verified: false },
        { name: "Marta", age: 21, distance: "2", bio: "Artista plástica, viciada em café e gatos. Coleciono discos de vinil.", img: "../img/marta.avif", verified: true }
    ];

    const mockData = {
        matches: [
            { name: "Ana", preview: "Novo Match!", img: "../img/ana.avif", unread: true },
            { name: "Lucas", preview: "Curtiu você", img: "../img/lucas.jpg", unread: false },
            { name: "Carla", preview: "Curtiu você", img: "../img/carla.jpg", unread: false }
        ],
        messages: [
            { name: "Marcos", preview: "Oi! Tudo bem com você?", img: "../img/marcos.avif", unread: true },
            { name: "Beatriz", preview: "Amei o seu áudio de bio!", img: "../img/beatriz.avif", unread: false }
        ]
    };

    
    function speak(text) {
        if (!isAppActive) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.8;
        synth.speak(utterance);
    }

    function playTutorial() {
        speak("Aplicativo iniciado. O perfil atual é Giovanna, 19 anos. Pressione seta para direita para curtir, esquerda para passar. Seta para cima para abrir o perfil completo. E seta para baixo para fechar. Tecla V para voltar. B para boost e Enter para Super Like ");
    }

    
    function switchTab(tabId) {
        
        tabs.forEach(tab => tab.classList.remove('active'));
        if (tabId === 'matches') tabs[0].classList.add('active');
        if (tabId === 'messages') tabs[1].classList.add('active');

        sidebarContent.innerHTML = ''; 
        const list = document.createElement('ul');
        list.className = 'sidebar-list';

        mockData[tabId].forEach(item => {
            const li = document.createElement('li');
            li.className = 'sidebar-list-item';
            li.tabIndex = 0;
            
            
            const dotHTML = item.unread ? `<div class="notification-dot" aria-label="Nova notificação"></div>` : '';

            li.innerHTML = `
                <div class="item-avatar" style="background-image: url('${item.img}')"></div>
                <div class="item-info">
                    <strong>${item.name}</strong>
                    <p>${item.preview}</p>
                </div>
                ${dotHTML}
            `;

            li.addEventListener('focus', () => {
                speak(`${item.name}. ${item.preview}. ${item.unread ? '' : ''}`);
            });

            list.appendChild(li);
        });
        sidebarContent.appendChild(list);
        speak(`Aba ${tabId == 'matches' ? 'Matches' : 'Mensagens'} aberta. Nova notificação pendente.`);
    }

    function loadNextProfile() {
        currentProfileIndex++;
        
        if (currentProfileIndex >= profilesData.length) {
            speak("Você chegou ao fim da fila. Não há mais perfis na sua região no momento.");
            document.querySelector('.profile-info h1').innerHTML = `Fim da Fila`;
            document.getElementById('profile-distance').textContent = ``;
            document.querySelector('.card-background').style.backgroundImage = `none`;
            document.querySelector('.card-background').style.backgroundColor = `#1a1a1a`;
            return;
        }

        const p = profilesData[currentProfileIndex];
        currentPhotoIndex = 1; 
        
        
        const verifiedHtml = p.verified ? '<span class="verified" aria-label="Perfil verificado">✓</span>' : '';
        document.querySelector('.profile-info h1').innerHTML = `${p.name} <span aria-hidden="true">${p.age}</span> ${verifiedHtml}`;
        document.getElementById('profile-distance').textContent = `📍 a ${p.distance} quilômetros daqui`;
        document.querySelector('.card-background').style.backgroundImage = `url('${p.img}')`;

        
        const detailName = document.getElementById('detail-name');
        const detailDistance = document.getElementById('detail-distance');
        const detailBio = document.getElementById('detail-bio');
        
        if (detailName) detailName.textContent = `${p.name}, ${p.age}`;
        if (detailDistance) detailDistance.textContent = `📍 a ${p.distance} quilômetros daqui`;
        if (detailBio) detailBio.textContent = p.bio;

        speak(`Novo perfil: ${p.name}, ${p.age} anos. A ${p.distance} quilômetros.`);
    }

    
    function handlePass() {
        const btn = document.getElementById('btn-pass');
        if (btn) btn.focus();
        speak("Perfil recusado.");
        setTimeout(loadNextProfile, 2000);
    }

    function handleLike() {
        const btn = document.getElementById('btn-like');
        if (btn) btn.focus();
        speak("Você curtiu o perfil.");
        setTimeout(loadNextProfile, 2000);
    }

    function handleSuperLike() {
        const btn = document.getElementById('btn-super');
        if (btn) btn.focus();
        speak("Super like enviado.");
        setTimeout(loadNextProfile, 2000);
    }

    function handleUndo() {
        const btn = document.getElementById('btn-undo');
        if (btn) btn.focus();
        
        if (currentProfileIndex > 0) {
            currentProfileIndex -= 2; 
            speak("Ação desfeita. Voltando para o perfil anterior.");
            loadNextProfile();
        } else {
            speak("Não há ações para desfazer.");
        }
    }

    function handleBoost() {
        const btn = document.getElementById('btn-boost');
        if (btn) btn.focus();
        speak("Você deu Boost no perfil");
    }

    function handleInfo() {
        const p = profilesData[currentProfileIndex];
        speak(`Informações de ${p.name}: ${p.bio}. Distância: ${p.distance} quilômetros.`);
        handleOpenProfile(); 
    }

    function handleOpenProfile() {
        profileCard.classList.add('expanded');
        const p = profilesData[currentProfileIndex];
        speak(`Abrindo detalhes de ${p.name}. Sobre mim: ${p.bio}`);
        profileCard.focus();
    }

    function handleCloseProfile() {
        profileCard.classList.remove('expanded');
        speak("Detalhes fechados.");
        profileCard.focus();
    }

    
    document.getElementById('btn-start').addEventListener('click', () => {
        startOverlay.style.display = 'none';
        mainApp.setAttribute('aria-hidden', 'false');
        isAppActive = true;
        playTutorial();
        profileCard.focus();
    });

    tabs[0].addEventListener('click', () => switchTab('matches'));
    tabs[1].addEventListener('click', () => switchTab('messages'));

    
    document.addEventListener('keydown', (e) => {
        if (!isAppActive) return;

        switch (e.key) {
            case 'ArrowLeft':
                handlePass();
                break;
            case 'ArrowRight':
                handleLike();
                break;
            case 'Enter':
                handleSuperLike();
                break;
            case 'ArrowUp':
                handleOpenProfile();
                break;
            case 'ArrowDown':
                handleCloseProfile();
                break;
            case ' ': 
                e.preventDefault();
                handleNextPhoto();
                break;
            case 'i': case 'I':
                document.getElementById('btn-info').focus();
                handleInfo();
                break;
            case 'v': case 'V':
                handleUndo();
                break;
            case 'b': case 'B':
                handleBoost();
                break;
        }
    });
});