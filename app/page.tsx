"use client";

import { useEffect, useMemo, useState } from "react";

const phone = "5524998820572";
const wa = (text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const baseWa = wa("Olá, vim pelo site e quero um orçamento de chopp para meu evento.");

const chopes = [
  { name: "Lager", type: "Clássica & leve", desc: "Refrescante, democrática e feita para manter a festa rodando do primeiro ao último brinde.", abv: "4,5%", temp: "0–2°C", p30: "R$ 500", p50: "R$ 750", image: "/chopp-lager.png", color: "#bb7a20" },
  { name: "Pilsen Hoperários", type: "Receita da casa", desc: "Nossa interpretação da Pilsen: fresca, equilibrada e produzida aqui, não revendida.", abv: "4,7%", temp: "0–2°C", p30: "R$ 550", p50: "R$ 800", image: "/chopp-vienna.png", color: "#a64f21" },
  { name: "Estilos especiais", type: "Para explorar", desc: "American Wheat, Vienna, IPA e Sour para transformar a torneira em uma atração do evento.", abv: "Varia", temp: "2–6°C", p30: "R$ 620", p50: "até R$ 1.250", image: "/chopp-ipa.png", color: "#c68a2b" },
];

const moments = [
  { label: "Casamentos", title: "Um brinde à altura do sim.", copy: "Uma estação de chopp elegante, instalada e pronta para servir do primeiro brinde à pista cheia." },
  { label: "Aniversários", title: "A rodada que vira memória.", copy: "Chopp fresco para receber todo mundo sem perder tempo com gelo, garrafa ou improviso." },
  { label: "Churrascos", title: "Fogo aceso. Torneira aberta.", copy: "O clássico encontro de fim de semana com chopp no ponto e reposição combinada quando necessário." },
  { label: "Empresas", title: "Confraternizar sem complicar.", copy: "Estrutura completa para encontros corporativos, celebrações de equipe e ativações locais." },
];

const faqs = [
  ["O que vem no kit?", "Barril escolhido, chopeira regulada, cilindro de gás, entrega e instalação. Você recebe tudo pronto para servir."],
  ["Vocês instalam no mesmo dia?", "Sim, conforme disponibilidade e rota. O atendimento pode acontecer até 23h; confirme o horário pelo WhatsApp."],
  ["O chopp sai com muita espuma?", "A chopeira é entregue regulada para servir o chopp cremoso e no ponto. Também orientamos quem ficará responsável pelos primeiros copos."],
  ["Existe alguma taxa extra?", "Somente para entregas em domingos/feriados ou reposição de barril durante a festa. O valor é informado antes da confirmação."],
  ["Quais cidades vocês atendem?", "Volta Redonda e região. Envie o endereço do evento para confirmarmos a disponibilidade e a rota."],
  ["Quanto chopp devo pedir?", "A calculadora dá uma estimativa inicial. O consumo muda conforme duração, perfil dos convidados e outras bebidas; confirmamos tudo no atendimento."],
];

export default function Home() {
  const [ageOk, setAgeOk] = useState(false);
  const [beer, setBeer] = useState(0);
  const [moment, setMoment] = useState(0);
  const [people, setPeople] = useState(50);
  const [hours, setHours] = useState(4);
  const [openFaq, setOpenFaq] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reveal = () => document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * .86) el.classList.add("in-view");
    });
    const scroll = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      setProgress(total > 0 ? scrollY / total : 0);
      reveal();
    };
    scroll();
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);

  const liters = useMemo(() => Math.ceil(people * hours * .35 / 10) * 10, [people, hours]);
  const barrels = liters <= 30 ? "1 barril de 30 L" : liters <= 50 ? "1 barril de 50 L" : `${Math.ceil(liters / 50)} barris de 50 L`;
  const calcWa = wa(`Olá! Fiz o cálculo no site para ${people} pessoas por ${hours} horas. A estimativa foi ${liters} L (${barrels}). Quero confirmar meu orçamento.`);
  const selectBeer = (next: number) => setBeer((next + chopes.length) % chopes.length);

  return <main>
    {!ageOk && <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title"><div className="age-card"><img src="/hoperarios-wordmark-clean.png" alt="Hoperários Cervejaria"/><p className="kicker">Conteúdo para maiores</p><h2 id="age-title">Você tem mais de 18 anos?</h2><p>Este site contém informações sobre bebidas alcoólicas.</p><div className="age-actions"><button autoFocus onClick={() => setAgeOk(true)}>Sim, tenho 18 anos ou mais</button><a href="https://www.google.com">Não, quero sair</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></div></div>}

    <div className="page-progress" aria-hidden="true"><i style={{ height: `${progress * 100}%` }}></i></div>
    <section className="hero" id="top">
      <nav className="capsule-nav"><a className="logo-image" href="#top"><img src="/hoperarios-wordmark-clean.png" alt="Hoperários Cervejaria"/></a><div className="nav-links"><a href="#chopes">Chopes</a><a href="#momentos">Momentos</a><a href="#calculadora">Calculadora</a><a className="nav-cta" href={baseWa} target="_blank">Reservar barril ↗</a></div></nav>
      <div className="grain"></div><div className="orbit orbit-a"></div><div className="orbit orbit-b"></div>
      <div className="hero-layout">
        <div className="hero-word" aria-hidden="true">HOPERÁRIOS</div>
        <div className="hero-copy">
          <p className="kicker">Cervejaria própria • Volta Redonda/RJ</p>
          <h1>O chopp da fonte.<br/><em>Na sua festa.</em></h1>
          <p>Kit completo instalado no local: barril, chopeira regulada, gás e atendimento de quem produz o próprio chopp.</p>
          <div className="hero-actions"><a className="button gold" href={baseWa} target="_blank">Quero meu barril <b>↗</b></a><a className="round-link" href="#chopes" aria-label="Conhecer os chopes">↓</a></div>
          <div className="hero-meta"><span><b>30L</b> ou <b>50L</b></span><span>Instalação<br/>inclusa</span><span>Atendimento<br/>até 23h*</span></div>
        </div>
      </div>
      <a className="scroll-cue" href="#chopes"><span>Role para servir</span><i></i></a>
    </section>

    <section className="proof"><div><strong>+21 mil</strong><span>seguidores acompanhando a marca</span></div><div><strong>Até 23h</strong><span>para instalar no mesmo dia*</span></div><div><strong>100% local</strong><span>produzido por quem entende de chopp</span></div><small>*Conforme disponibilidade e rota.</small></section>

    <section className="beer-showcase reveal" id="chopes" style={{ "--beer-accent": chopes[beer].color } as React.CSSProperties}>
      <div className="showcase-heading"><p className="kicker">Arraste. Escolha. Brinde.</p><h2>Um chopp de cada vez.<br/><i>Todos memoráveis.</i></h2></div>
      <div className="beer-stage" onTouchStart={e => setTouchStart(e.touches[0].clientX)} onTouchEnd={e => { if (touchStart === null) return; const d = e.changedTouches[0].clientX - touchStart; if (Math.abs(d) > 45) selectBeer(beer + (d < 0 ? 1 : -1)); setTouchStart(null); }}>
        <button className="slide-arrow prev" onClick={() => selectBeer(beer - 1)} aria-label="Chopp anterior">←</button>
        <div className="beer-visual" key={chopes[beer].image}><span className="liquid-type">{chopes[beer].type}</span><img src={chopes[beer].image} alt={`Copo de ${chopes[beer].name}`}/><div className="beer-index">0{beer + 1}</div></div>
        <article className="beer-details" key={chopes[beer].name}><p className="kicker">{chopes[beer].type}</p><h3>{chopes[beer].name}</h3><p>{chopes[beer].desc}</p><div className="beer-specs"><span><small>Teor</small><b>{chopes[beer].abv}</b></span><span><small>Serviço</small><b>{chopes[beer].temp}</b></span></div><div className="beer-prices"><span><small>30 litros</small><b>{chopes[beer].p30}</b></span><span><small>50 litros</small><b>{chopes[beer].p50}</b></span></div><a className="button gold" href={wa(`Olá! Quero um orçamento do chopp ${chopes[beer].name} para meu evento.`)} target="_blank">Pedir este chopp ↗</a></article>
        <button className="slide-arrow next" onClick={() => selectBeer(beer + 1)} aria-label="Próximo chopp">→</button>
      </div>
      <div className="beer-nav">{chopes.map((c, i) => <button className={beer === i ? "active" : ""} onClick={() => setBeer(i)} key={c.name}><b>0{i + 1}</b><span>{c.name}</span></button>)}</div>
      <p className="price-note">Estilos especiais variam de R$ 620 a R$ 1.250. Taxa extra apenas em domingos/feriados ou reposição durante a festa.</p>
    </section>

    <section className="moments reveal" id="momentos"><div className="moment-photo"><img src="/evento-casamento.png" alt="Evento com estação de chopp artesanal"/><div className="moment-counter">0{moment + 1} / 04</div></div><div className="moment-copy"><p className="kicker">Cabe no seu momento</p><h2>Uma torneira.<br/>Muitos motivos<br/><i>pra brindar.</i></h2><div className="moment-tabs">{moments.map((m, i) => <button key={m.label} className={moment === i ? "active" : ""} onClick={() => setMoment(i)}><b>0{i + 1}</b><span>{m.label}</span><i>↗</i></button>)}</div><article key={moments[moment].title}><h3>{moments[moment].title}</h3><p>{moments[moment].copy}</p></article></div></section>

    <section className="care reveal"><header><p className="kicker">Sem perrengue na festa</p><h2>Você brinda.<br/><i>A gente cuida.</i></h2><p>Não é só o barril. É a tranquilidade de receber o sistema completo, regulado e pronto para o primeiro copo.</p></header><div className="care-grid">{[
      { number: "01", icon: "barrel", title: "Cerveja da fonte", copy: "Marca própria da cervejaria. Não somos revenda." },
      { number: "02", icon: "temperature", title: "No ponto certo", copy: "Chopeira regulada para chopp gelado, cremoso e sem excesso de espuma." },
      { number: "03", icon: "cylinder", title: "Gás garantido", copy: "Cilindro reserva incluso para o chopp não parar no melhor da festa." },
      { number: "04", icon: "delivery", title: "Instalação completa", copy: "Entregamos e montamos o kit no local. Você só abre a torneira e brinda." },
    ].map(item => <article key={item.number}><b>{item.number}</b><div className={`care-icon care-icon--${item.icon}`} aria-hidden="true"><i><span></span></i></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>

    <section className="how reveal"><p className="kicker">É simples assim</p><h2>Do pedido ao primeiro copo.</h2><div className="steps">{[["01","Faça o pedido","Conte data, local e número de convidados pelo WhatsApp."],["02","Preparamos","Separamos o estilo, volume e equipamento para seu evento."],["03","Entregamos e instalamos","Levamos o kit e deixamos a chopeira regulada."],["04","Curta o momento","Abra a torneira, sirva no ponto e aproveite a festa."]].map(x => <article key={x[0]}><b>{x[0]}</b><div></div><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

    <section className="calculator reveal" id="calculadora"><div className="calc-intro"><p className="kicker">Calculadora de chopp</p><h2>Quanto vai<br/><i>precisar?</i></h2><p>Estimativa rápida considerando 350 ml por pessoa/hora. Depois, a equipe ajusta pelo perfil do seu evento.</p></div><div className="calc-card"><label><span>Quantas pessoas?</span><strong>{people}</strong><input type="range" min="10" max="250" step="10" value={people} onChange={e => setPeople(+e.target.value)}/><small><i>10</i><i>250</i></small></label><label><span>Quantas horas?</span><strong>{hours}h</strong><input type="range" min="2" max="10" value={hours} onChange={e => setHours(+e.target.value)}/><small><i>2h</i><i>10h</i></small></label><div className="result"><small>Estimativa inicial</small><b>{liters} litros</b><span>{barrels}</span></div><a className="button gold" href={calcWa} target="_blank">Levar cálculo ao WhatsApp ↗</a></div></section>

    <section className="faq reveal"><div><p className="kicker">Dúvidas frequentes</p><h2>Antes de abrir<br/><i>a torneira.</i></h2></div><div className="faq-list">{faqs.map((f, i) => <article key={f[0]}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{f[0]}</span><b>{openFaq === i ? "−" : "+"}</b></button>{openFaq === i && <p>{f[1]}</p>}</article>)}</div></section>

    <section className="final-cta reveal"><p className="kicker">Seu evento merece chopp de verdade</p><h2>A próxima rodada<br/><i>começa aqui.</i></h2><p>Fale direto com a equipe local, confirme a disponibilidade e receba seu orçamento.</p><a className="button gold" href={baseWa} target="_blank">Chamar no WhatsApp <b>↗</b></a><small>(24) 99882-0572</small></section>
    <a className="floating-wa" href={baseWa} target="_blank" aria-label="Falar no WhatsApp">WhatsApp <b>↗</b></a>
    <footer><a className="footer-logo" href="#top"><img src="/hoperarios-wordmark-clean.png" alt="Hoperários Cervejaria"/></a><p>Cervejaria artesanal de Volta Redonda/RJ.<br/>Barril, chopeira, gás, entrega e instalação.</p><div><a href="https://www.instagram.com/cervejariahoperarios/" target="_blank">Instagram ↗</a><a href={baseWa} target="_blank">WhatsApp ↗</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></footer>
  </main>;
}
