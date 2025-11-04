document.addEventListener('DOMContentLoaded', () => {
    const chatTrigger = document.getElementById('chatbot-trigger');
    const chatContainer = document.getElementById('chat-widget-container');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatOptions = document.getElementById('chat-pre-options');

    const knowledgeBase = [
        {
            name: 'price',
            keywords: ['preco', 'valor', 'quanto custa', 'orcamento', 'investimento'],
            response: "Nossas soluções são <strong>100% sob medida</strong> para o seu desafio. Por isso, não trabalhamos com pacotes de preço fixos. O valor depende da complexidade do seu processo e do que precisaremos construir.<br><br>Vamos conversar? Um especialista pode fazer uma análise sem compromisso.",
            nextOptions: 'contactOptions'
        },
        {
            name: 'implementation',
            keywords: ['implementacao', 'como comeca', 'implantar', 'processo', 'onboarding'],
            response: "Nossa abordagem é ágil e focada em parceria:<br>1. <strong>Diagnóstico:</strong> Entendemos seu processo e identificamos os gargalos.<br>2. <strong>Construção:</strong> Desenvolvemos a automação em ciclos rápidos.<br>3. <strong>Validação:</strong> Você testa e aprova a solução.<br>4. <strong>Implantação:</strong> Treinamos sua equipe e ativamos o sistema.",
            nextOptions: 'solutionsOptions'
        },
        {
            name: 'zengataxSpecific',
            keywords: ['zengatax funciona', 'zengatax e para mim', 'zengatx'],
            response: "O <strong>ZengaTax</strong> é ideal para escritórios de contabilidade e departamentos fiscais que estão cansados de depender do eCAC e de processos manuais. Ele centraliza tarefas como geração de MIT, DARFs, DCTFWeb e muito mais, tudo em nuvem e de forma automática.",
            nextOptions: 'zengataxOptions'
        },
        {
            name: 'zengatax',
            keywords: ['zengatax', 'zenga', 'produto', 'zengatx', 'zengas'],
            response: "O <strong>ZengaTax</strong> é nossa principal solução all-in-one! Ele foi criado para automatizar a rotina fiscal e contábil, aumentando a eficiência. É o futuro da contabilidade, permitindo que sua equipe pare de depender do eCAC para tudo.",
            nextOptions: 'zengataxOptions'
        },
        {
            name: 'solutions',
            keywords: ['o que a scryta faz', 'solucoes', 'servicos', 'automacao', 'fiscal', 'contabil', 'solucao', 'solusoes'],
            response: "Somos especialistas em criar sistemas <strong>all-in-one em nuvem</strong> para operações fiscais e contábeis. Nossas principais frentes são: <br><br>1. <strong>Automação Fiscal de Ponta a Ponta</strong> (captura de notas, geração de guias como MIT e DCTFWeb). <br>2. <strong>APIs e Sistemas Integrados</strong> (conectamos seu ERP aos portais do governo). <br>3. <strong>Dashboards</strong> para decisões rápidas e em tempo real.",
            nextOptions: 'solutionsOptions'
        },
        {
            name: 'aboutScryta',
            keywords: ['sobre a scryta', 'empresa scryta', 'quem e a scryta', 'scryta', 'scrita', 'scripta', 'dna fiscal'],
            response: "A <strong>SCRYTA TECNOLOGIA</strong> é uma empresa que nasceu de uma necessidade real, dentro da <strong>SCRYTA ASSESSORIA CONTÁBIL</strong>. Cansados de processos manuais, criamos nossas próprias ferramentas e agora transformamos essa experiência em soluções de automação robustas e inteligentes. Nós temos <strong>DNA Fiscal</strong>!",
            nextOptions: 'generalFollowUp'
        },
        {
            name: 'cases',
            keywords: ['cases', 'projetos', 'exemplos', 'clientes', 'sucesso'],
            response: "Temos vários cases de sucesso! Já entregamos projetos de: <br>• <strong>Automação do Simples Nacional</strong> (com auditoria e PGDAS). <br>• <strong>Auditoria de Folha</strong> (cruzando dados com o contábil). <br>• <strong>Caixa Postal eCAC</strong> centralizada. <br>• <strong>Sistema de Apontamento de Horas</strong>. <br>• <strong>Levantamento de Débitos</strong> unificado.",
            nextOptions: 'generalFollowUp'
        },
        {
            name: 'technology',
            keywords: ['tecnologia', 'linguagem', 'programacao', 'stack'],
            response: "Usamos as tecnologias mais modernas e robustas para garantir performance e segurança, como <strong>Python</strong>, <strong>FastAPI</strong>, <strong>React</strong> e infraestrutura em nuvem <strong>(Cloud)</strong>. Nossas APIs são rápidas e nossas plataformas são 100% web.",
            nextOptions: 'solutionsOptions'
        },
        {
            name: 'blog',
            keywords: ['blog', 'artigos', 'novidades', 'conteudo'],
            response: "Que ótimo que perguntou! Você pode acessar nosso blog e o do ZengaTax para ficar por dentro de todas as novidades sobre automação fiscal. <a href='https://zengatax.com.br/#blog' target='_blank'>Clique aqui para acessar o blog</a>.",
            nextOptions: 'main'
        },
        {
            name: 'contact',
            keywords: ['contato', 'falar', 'especialista', 'telefone', 'email', 'ajuda', 'whatsapp'],
            response: "Claro! Nossos especialistas estão prontos para ajudar. Você pode preencher o formulário em nosso site ou nos contatar diretamente: <br><br>📧 <strong>tecnologia@scryta.com.br</strong> <br>📞 <strong>(41) 98713-2156</strong> <br><br>Qual prefere?",
            nextOptions: 'contactOptions'
        },
        {
            name: 'greetings',
            keywords: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'saudacoes', 'ei', 'opa'],
            response: "Olá! 👋 Sou o assistente virtual da SCRYTA. Como posso ajudar com sua automação fiscal ou contábil?",
            nextOptions: 'main'
        },
        {
            name: 'farewell',
            keywords: ['tchau', 'obrigado', 'obg', 'valeu', 'ate mais', 'xau'],
            response: "Eu que agradeço o contato! Estamos à disposição para transformar seu negócio. Até mais! 👋",
            nextOptions: 'main'
        }
    ];

    const defaultResponse = "Desculpe, não entendi bem. Você poderia reformular? Nossos especialistas podem ajudar com <strong>automação fiscal</strong>, <strong>ZengaTax</strong> ou <strong>projetos sob medida</strong>.";

    const optionSets = {
        main: [
            { text: 'O que é o ZengaTax?', msg: 'O que é o ZengaTax?' },
            { text: 'O que a Scryta faz?', msg: 'O que a Scryta Tecnologia faz?' },
            { text: 'Quais os cases de sucesso?', msg: 'Me fale sobre os cases de sucesso' },
            { text: 'Falar com um especialista', msg: 'Quero falar com um especialista' }
        ],
        zengataxOptions: [
            { text: 'ZengaTax é para mim?', msg: 'O ZengaTax é para mim?' },
            { text: 'Quero saber o preço', msg: 'Quanto custa o ZengaTax?' },
            { text: 'Ver outras soluções', msg: 'Quais outras soluções vocês têm?' },
            { text: 'Falar com especialista', msg: 'Quero falar sobre o ZengaTax' }
        ],
        solutionsOptions: [
            { text: 'Automação Fiscal', msg: 'Fale mais sobre Automação Fiscal' },
            { text: 'APIs e Dashboards', msg: 'Como funcionam as APIs e Dashboards?' },
            { text: 'Quero um projeto sob medida', msg: 'Como funciona um projeto sob medida?' },
            { text: 'Ver o ZengaTax', msg: 'Me fale de novo sobre o ZengaTax' }
        ],
        contactOptions: [
            { text: 'Enviar E-mail', msg: 'Vou enviar um e-mail' },
            { text: 'Ver Telefone', msg: 'Qual o telefone mesmo?' },
            { text: 'Voltar ao início', msg: 'Voltar ao início' }
        ],
        generalFollowUp: [
            { text: 'Ver mais soluções', msg: 'Quais são as soluções?' },
            { text: 'Conhecer o ZengaTax', msg: 'O que é o ZengaTax?' },
            { text: 'Falar com especialista', msg: 'Quero falar com um especialista' }
        ]
    };

    chatTrigger.addEventListener('click', () => {
        chatContainer.classList.toggle('is-open');
        chatTrigger.classList.toggle('is-open');
        if (chatContainer.classList.contains('is-open')) {
            if (chatMessages.children.length === 0) {
                setTimeout(() => {
                    addMessage('bot', "Olá! 👋 Sou o assistente virtual da SCRYTA. Como posso ajudar?");
                    showChatOptions('main');
                }, 500);
            }
        }
    });

    chatCloseBtn.addEventListener('click', () => {
        chatContainer.classList.remove('is-open');
        chatTrigger.classList.remove('is-open');
    });

    chatSendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    function showChatOptions(setName) {
        chatOptions.innerHTML = '';
        chatOptions.style.display = 'flex';
        
        const options = optionSets[setName] || optionSets['main'];

        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('chat-option');
            button.textContent = option.text;
            button.setAttribute('data-msg', option.msg);
            chatOptions.appendChild(button);
        });
    }

    chatOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-option')) {
            const message = e.target.getAttribute('data-msg');
            addMessage('user', message);
            getBotResponse(message);
        }
    });

    function handleUserMessage() {
        const userText = chatInput.value.trim();
        if (userText === "") return;

        addMessage('user', userText);
        chatInput.value = "";
        getBotResponse(userText);
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-msg`);

        let messageHTML = '';
        if (sender === 'bot') {
            messageHTML = `
                <div class="bot-avatar"></div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageHTML = `<div class="message-content">${text}</div>`;
        }
        
        messageElement.innerHTML = messageHTML;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function getBotResponse(userText) {
        chatOptions.style.display = 'none';
        showTypingIndicator();
        
        const normalizedText = userText.toLowerCase()
                                     .normalize("NFD")
                                     .replace(/[\u0300-\u036f]/g, "")
                                     .replace(/[?,.!]/g, "");
        
        let response = defaultResponse;
        let nextOptions = 'main';
        let found = false;

        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                if (normalizedText.includes(keyword)) {
                    response = entry.response;
                    nextOptions = entry.nextOptions || 'main';
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        setTimeout(() => {
            hideTypingIndicator();
            addMessage('bot', response);
            showChatOptions(nextOptions);
        }, 1500 + Math.random() * 500); 
    }

    function showTypingIndicator() {
        if (document.querySelector('.typing-indicator')) return;

        const typingElement = document.createElement('div');
        typingElement.classList.add('chat-message', 'bot-msg', 'typing-indicator');
        typingElement.innerHTML = `
            <div class="bot-avatar"></div>
            <div class="message-content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typingElement = document.querySelector('.typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});