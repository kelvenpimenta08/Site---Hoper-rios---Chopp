"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const phone = "5524998820572";
const wa = (text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const baseWa = wa("Olá, vim pelo site e quero um orçamento de chopp para meu evento.");

const chopes = [
  { name: "Lager", type: "Clássica & leve", desc: "Refrescante, democrática e feita para manter a festa rodando do primeiro ao último brinde.", abv: "4,5%", temp: "0–2°C", p30: "R$ 500", p50: "R$ 750", color: "#e9a51f" },
  { name: "Pilsen Hoperários", type: "Receita da casa", desc: "Nossa interpretação da Pilsen: fresca, equilibrada e produzida aqui, não revendida.", abv: "4,7%", temp: "0–2°C", p30: "R$ 550", p50: "R$ 800", color: "#f1bd3b" },
  { name: "Estilos especiais", type: "Para explorar", desc: "American Wheat, Vienna, IPA e Sour para transformar a torneira em uma atração do evento.", abv: "Varia", temp: "2–6°C", p30: "R$ 620", p50: "até R$ 1.250", color: "#b85b27" },
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

const consumptionProfiles = [
  { label: "Tranquilo", rate: 350, note: "Consumo leve" },
  { label: "Clássico", rate: 500, note: "Média recomendada" },
  { label: "Animado", rate: 650, note: "Turma que bebe mais" },
];

const recommendBarrels = (targetLiters: number) => {
  let best = { count30: 0, count50: Math.ceil(targetLiters / 50), capacity: Math.ceil(targetLiters / 50) * 50 };
  const limit = Math.ceil(targetLiters / 30) + 1;

  for (let count30 = 0; count30 <= limit; count30++) {
    for (let count50 = 0; count50 <= limit; count50++) {
      const capacity = count30 * 30 + count50 * 50;
      if (capacity < targetLiters || capacity === 0) continue;
      const barrelCount = count30 + count50;
      const bestCount = best.count30 + best.count50;
      if (barrelCount < bestCount || (barrelCount === bestCount && capacity < best.capacity)) {
        best = { count30, count50, capacity };
      }
    }
  }

  const parts = [
    best.count50 ? `${best.count50} ${best.count50 === 1 ? "barril" : "barris"} de 50 L` : "",
    best.count30 ? `${best.count30} ${best.count30 === 1 ? "barril" : "barris"} de 30 L` : "",
  ].filter(Boolean);

  return { ...best, label: parts.join(" + ") };
};

function DraftPourRender({ name, active }: { name: string; active: boolean }) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const fillRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled || !baseRef.current || !fillRef.current || !streamRef.current) return;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const sourceContext = source.getContext("2d", { willReadFrequently: true });
      if (!sourceContext) return;
      sourceContext.drawImage(image, 0, 0);
      const pixels = sourceContext.getImageData(0, 0, width, height).data;
      const basePixels = new Uint8ClampedArray(pixels.length);
      const fillPixels = new Uint8ClampedArray(pixels.length);
      const streamPixels = new Uint8ClampedArray(pixels.length);

      for (let y = 0; y < height; y++) {
        const glassProgress = Math.max(0, Math.min(1, (y / height - .425) / .54));
        const glassLeft = (.382 + glassProgress * .055) * width;
        const glassRight = (.622 - glassProgress * .055) * width;

        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const brightness = Math.max(red, green, blue);
          const alpha = brightness < 12 ? 0 : Math.min(255, (brightness - 10) * 3.3);
          if (!alpha) continue;

          const inGlass = y > height * .425 && y < height * .975 && x > glassLeft && x < glassRight;
          const inStreamArea = y > height * .27 && y < height * .445 && x > width * .41 && x < width * .53;
          const isGoldenStream = inStreamArea && red > 70 && red > blue * 1.45 && green > blue * 1.25;
          const target = isGoldenStream ? streamPixels : inGlass ? fillPixels : basePixels;
          const visibleScale = alpha < 255 ? 255 / alpha : 1;
          target[offset] = Math.min(255, red * visibleScale);
          target[offset + 1] = Math.min(255, green * visibleScale);
          target[offset + 2] = Math.min(255, blue * visibleScale);
          target[offset + 3] = alpha;
        }
      }

      [[baseRef.current, basePixels], [fillRef.current, fillPixels], [streamRef.current, streamPixels]].forEach(([canvas, data]) => {
        const targetCanvas = canvas as HTMLCanvasElement;
        targetCanvas.width = width;
        targetCanvas.height = height;
        targetCanvas.getContext("2d")?.putImageData(new ImageData(data as Uint8ClampedArray, width, height), 0, 0);
      });
    };

    image.src = "/chopp-tap-3d-v1.png";
    return () => { cancelled = true; };
  }, []);

  return <div className={`render-stage${active ? " is-pouring" : ""}`} role="img" aria-label={`Render 3D de uma torneira enchendo um copo de ${name}`}><canvas className="render-layer render-base" ref={baseRef}/><canvas className="render-layer render-fill" ref={fillRef}/><canvas className="render-layer render-stream" ref={streamRef}/><span className="impact-ripple" aria-hidden="true"></span><span className="live-foam" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div>;
}

export default function Home() {
  const [ageOk, setAgeOk] = useState(false);
  const [beer, setBeer] = useState(0);
  const [moment, setMoment] = useState(0);
  const [people, setPeople] = useState(50);
  const [hours, setHours] = useState(4);
  const [drinkingShare, setDrinkingShare] = useState(70);
  const [consumptionRate, setConsumptionRate] = useState(500);
  const [extendedPeople, setExtendedPeople] = useState(false);
  const [extendedHours, setExtendedHours] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [beerInView, setBeerInView] = useState(false);
  const beerSectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const section = beerSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setBeerInView(entry.isIntersecting), { threshold: .28 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const drinkingPeople = useMemo(() => Math.ceil(people * drinkingShare / 100), [people, drinkingShare]);
  const liters = useMemo(() => Math.ceil(drinkingPeople * hours * consumptionRate / 1000 / 10) * 10, [drinkingPeople, hours, consumptionRate]);
  const safeTarget = useMemo(() => Math.ceil(liters * 1.1 / 10) * 10, [liters]);
  const recommendation = useMemo(() => recommendBarrels(safeTarget), [safeTarget]);
  const safetyMargin = recommendation.capacity - liters;
  const calcWa = wa(`Olá! Fiz o cálculo no site para ${people} convidados por ${hours} horas. Considerei ${drinkingShare}% bebendo chopp (${drinkingPeople} pessoas), no perfil de ${consumptionRate} ml por pessoa/hora. O consumo estimado foi ${liters} L e a recomendação segura foi ${recommendation.label} (${recommendation.capacity} L disponíveis, com ${safetyMargin} L de margem). Quero confirmar meu orçamento.`);
  const selectBeer = (next: number) => setBeer((next + chopes.length) % chopes.length);
  const toggleExtendedPeople = () => {
    if (extendedPeople) {
      setPeople(Math.min(people, 250));
      setExtendedPeople(false);
      return;
    }
    setPeople(Math.max(people, 300));
    setExtendedPeople(true);
  };
  const toggleExtendedHours = () => {
    if (extendedHours) {
      setHours(Math.min(hours, 10));
      setExtendedHours(false);
      return;
    }
    setHours(Math.max(hours, 12));
    setExtendedHours(true);
  };

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

    <section className="beer-showcase reveal" id="chopes" ref={beerSectionRef} style={{ "--beer-accent": chopes[beer].color, "--beer-liquid": chopes[beer].color } as React.CSSProperties}>
      <div className="showcase-heading"><p className="kicker">Arraste. Escolha. Brinde.</p><h2>Um chopp de cada vez.<br/><i>Todos memoráveis.</i></h2></div>
      <div className="beer-stage" onTouchStart={e => setTouchStart(e.touches[0].clientX)} onTouchEnd={e => { if (touchStart === null) return; const d = e.changedTouches[0].clientX - touchStart; if (Math.abs(d) > 45) selectBeer(beer + (d < 0 ? 1 : -1)); setTouchStart(null); }}>
        <button className="slide-arrow prev" onClick={() => selectBeer(beer - 1)} aria-label="Chopp anterior">←</button>
        <div className={`beer-visual beer-visual--${beer + 1}`} key={beer}><span className="liquid-type">{chopes[beer].type}</span><DraftPourRender key={`${beer}-${beerInView}`} name={chopes[beer].name} active={beerInView}/><div className="kit-stamp"><span className="kit-mark">✓</span><span><small>Kit completo instalado</small><b>Barril · Chopeira · Gás</b></span></div><div className="beer-index">0{beer + 1}</div></div>
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

    <section className="calculator reveal" id="calculadora"><div className="calc-intro"><p className="kicker">Calculadora de chopp</p><h2>Quanto vai<br/><i>precisar?</i></h2><p>Nem todo convidado bebe igual. Ajuste o público, a duração e o perfil da sua turma para chegar mais perto do consumo real.</p><div className="calc-method"><span><b>{drinkingPeople}</b> pessoas bebendo</span><span><b>+10%</b> de margem segura</span></div></div><div className="calc-card"><div className="calc-primary"><div className="calc-control"><label><span>Quantas pessoas?</span><strong>{people}</strong><input aria-label="Número de pessoas" type="range" min="10" max={extendedPeople ? "1000" : "250"} step={extendedPeople ? "50" : "10"} value={people} onChange={e => setPeople(+e.target.value)}/><small><i>10</i><i>{extendedPeople ? "1.000" : "250"}</i></small></label><div className="range-more"><button type="button" aria-pressed={extendedPeople} onClick={toggleExtendedPeople}>{extendedPeople ? "Voltar para até 250" : "Mais de 250? Calcular até 1.000"} <b>{extendedPeople ? "−" : "+"}</b></button>{extendedPeople && <small>Acima de 1.000 pessoas, confirme a estrutura pelo WhatsApp.</small>}</div></div><div className="calc-control"><label><span>Quantas horas?</span><strong>{hours}h</strong><input aria-label="Duração do evento em horas" type="range" min="2" max={extendedHours ? "24" : "10"} value={hours} onChange={e => setHours(+e.target.value)}/><small><i>2h</i><i>{extendedHours ? "24h" : "10h"}</i></small></label><div className="range-more"><button type="button" aria-pressed={extendedHours} onClick={toggleExtendedHours}>{extendedHours ? "Voltar para até 10h" : "Mais de 10h? Calcular até 24h"} <b>{extendedHours ? "−" : "+"}</b></button>{extendedHours && <small>Acima de 24h, confirme a operação pelo WhatsApp.</small>}</div></div></div><label className="drinking-control"><span>Quantos convidados bebem chopp?</span><strong>{drinkingShare}% <small>≈ {drinkingPeople} pessoas</small></strong><input aria-label="Percentual de convidados que bebem chopp" type="range" min="20" max="100" step="5" value={drinkingShare} onChange={e => setDrinkingShare(+e.target.value)}/><small><i>20%</i><i>100%</i></small></label><fieldset className="consumption-profile"><legend>Como é o consumo da turma?</legend><div>{consumptionProfiles.map(profile => <button type="button" key={profile.rate} className={consumptionRate === profile.rate ? "active" : ""} aria-pressed={consumptionRate === profile.rate} onClick={() => setConsumptionRate(profile.rate)}><b>{profile.label}</b><span>{profile.rate} ml/h</span><small>{profile.note}</small></button>)}</div></fieldset><div className="result"><small>Consumo estimado</small><b>{liters} litros</b><div className="recommendation"><small>Recomendação segura</small><strong>{recommendation.label}</strong><span>{recommendation.capacity} L disponíveis · {safetyMargin} L de margem</span></div></div><div className="calc-benefits" aria-label="Benefícios inclusos"><span>✓ Chopeira inclusa</span><span>✓ Gás reserva</span><span>✓ Instalação no local</span></div><a className="button gold" href={calcWa} target="_blank">Levar cálculo ao WhatsApp ↗</a></div></section>

    <section className="faq reveal"><div><p className="kicker">Dúvidas frequentes</p><h2>Antes de abrir<br/><i>a torneira.</i></h2></div><div className="faq-list">{faqs.map((f, i) => <article key={f[0]}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{f[0]}</span><b>{openFaq === i ? "−" : "+"}</b></button>{openFaq === i && <p>{f[1]}</p>}</article>)}</div></section>

    <section className="final-cta reveal"><p className="kicker">Seu evento merece chopp de verdade</p><h2>A próxima rodada<br/><i>começa aqui.</i></h2><p>Fale direto com a equipe local, confirme a disponibilidade e receba seu orçamento.</p><a className="button gold" href={baseWa} target="_blank">Chamar no WhatsApp <b>↗</b></a></section>
    <a className="floating-wa" href={baseWa} target="_blank" aria-label="Falar no WhatsApp">WhatsApp <b>↗</b></a>
    <footer><a className="footer-logo" href="#top"><img src="/hoperarios-wordmark-clean.png" alt="Hoperários Cervejaria"/></a><p>Cervejaria artesanal de Volta Redonda/RJ.<br/>Barril, chopeira, gás, entrega e instalação.</p><div><a href="https://www.instagram.com/cervejariahoperarios/" target="_blank">Instagram ↗</a><a href={baseWa} target="_blank">WhatsApp ↗</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></footer>
  </main>;
}
