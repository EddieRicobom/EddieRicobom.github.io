(() => {
  const details = {
    'Análise de dados': 'Exploro informações, identifico padrões e transformo números em apoio para decisões.',
    'Microsoft Fabric': 'Trabalho com a plataforma unificada de dados da Microsoft para integrar engenharia, ciência de dados e BI.',
    'Power BI': 'Crio visualizações e dashboards interativos para acompanhar indicadores e contar a história dos dados.',
    'Power Apps': 'Desenvolvo aplicativos voltados a processos de negócio e necessidades específicas de equipes.',
    'Power Automate': 'Automatizo tarefas e fluxos entre serviços para reduzir trabalho repetitivo.',
    'HTML5': 'Estruturo experiências web com semântica, acessibilidade e uma base sólida para a interface.',
    'CSS3': 'Transformo ideias visuais em páginas responsivas, expressivas e fáceis de usar.',
    'JavaScript': 'Uso interatividade para tornar interfaces mais dinâmicas e resolver necessidades no navegador.',
    'jQuery': 'Utilizo a biblioteca para lidar de forma prática com interações e elementos em projetos web.',
    'WordPress': 'Crio e organizo sites que permitem publicação e manutenção mais simples do conteúdo.',
    'PHP': 'Desenvolvo a lógica de aplicações web e faço a ponte entre interface, regras e dados.',
    'Laravel': 'Aproveito o framework para estruturar aplicações PHP com recursos completos de back-end.',
    'Python': 'Uso a linguagem em automações, análise de dados e soluções versáteis de desenvolvimento.',
    'ADVPL / Protheus': 'Trabalho com o ecossistema TOTVS Protheus e suas rotinas empresariais.',
    'MySQL': 'Modelo, consulto e mantenho dados em bancos relacionais para aplicações e análises.',
    'Oracle': 'Lido com dados em uma plataforma relacional amplamente utilizada em ambientes corporativos.',
    'XAMPP': 'Configuro ambientes locais para desenvolver, testar e manter aplicações PHP.',
    'Git': 'Uso versionamento para acompanhar mudanças e colaborar com mais segurança no código.',
    'Jira': 'Organizo atividades e acompanho demandas de equipes e projetos.',
    'Scrum': 'Aplico práticas ágeis para dar ritmo, clareza e transparência ao trabalho.',
    'Gestão de equipes': 'Atuo na organização de processos, orientação e desenvolvimento de pessoas.',
    'Suporte': 'Uno atendimento, administração e solução de problemas para manter a operação fluindo.',
    'Microsoft Office': 'Uso Word, Excel, PowerPoint e Outlook no apoio a rotinas e comunicação.',
    'Unity': 'Desenvolvo projetos pessoais com foco em C#, classes e recursos de realidade aumentada.',
    'C#': 'Pratico lógica orientada a objetos e organização de classes em projetos pessoais.',
    'Stash / Git': 'Administro repositórios e branches com foco em organização do histórico e do trabalho.'
  };

  document.querySelectorAll('.skill-item').forEach((card) => {
    const image = card.querySelector('img, .skill-monogram');
    const copy = card.querySelector('div');
    const title = copy.querySelector('h3').textContent.trim();
    const category = copy.querySelector('p').textContent.trim();
    const isImage = image.tagName === 'IMG';
    const iconFront = isImage ? `<img src="${image.getAttribute('src')}" alt="">` : `<span class="skill-monogram">${image.textContent}</span>`;
    const iconBack = isImage ? `<img class="skill-back-icon" src="${image.getAttribute('src')}" alt="">` : `<span class="skill-monogram skill-back-icon">${image.textContent}</span>`;
    card.innerHTML = `<div class="skill-face skill-front">${iconFront}<span class="flip-hint" aria-hidden="true">↻</span><div><h3>${title}</h3><p>${category}</p></div></div><div class="skill-face skill-back">${iconBack}<h3>${title}</h3><p>${details[title] || category}</p><small>TOQUE PARA VOLTAR</small></div>`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${title}. Pressione para ver detalhes.`);
    const flip = () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
      card.setAttribute('aria-label', isFlipped ? `${title}. Detalhes visíveis. Pressione para voltar.` : `${title}. Pressione para ver detalhes.`);
    };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flip(); }
    });
  });
})();
