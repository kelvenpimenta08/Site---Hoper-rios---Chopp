"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const phone = "5524998820572";
const wa = (text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const baseWa = wa("Olá! Quero levar o chopp Hoperários para o meu evento. Pode me passar um orçamento?");

const chopes = [
  { name: "Lager", type: "Clássica & leve", desc: "Leve, refrescante e sem complicação. O chopp que mantém a roda girando do primeiro ao último copo.", abv: "4,5%", temp: "0–2°C", p30: "R$ 500", p50: "R$ 750", color: "#d99624", liquid: "#d89a25" },
  { name: "Pilsen Hoperários", type: "Receita da casa", desc: "A assinatura da casa, feita em Volta Redonda: fresca, equilibrada e com personalidade Hoperários.", abv: "4,7%", temp: "0–2°C", p30: "R$ 550", p50: "R$ 800", color: "#e7bd49", liquid: "#edc65b" },
  { name: "Estilos especiais", type: "Para explorar", desc: "American Wheat, Vienna, IPA e Sour para quem quer colocar ainda mais personalidade na torneira.", abv: "Varia", temp: "2–6°C", p30: "R$ 620", p50: "até R$ 1.250", color: "#b85b27", liquid: "#ad572b" },
];

const moments = [
  { label: "Casamentos", title: "O sim merece Hoperários.", copy: "Chopp da casa, serviço no ponto e uma estação à altura do brinde mais importante da noite.", image: "/momento-casamento-v2.webp", alt: "Convidados brindando com chopp em um casamento" },
  { label: "Aniversários", title: "Mais um ano. Mais uma rodada.", copy: "Você reúne a turma. A Hoperários leva o chopp, instala tudo e deixa a festa pronta para servir.", image: "/momento-aniversario-v2.webp", alt: "Aniversariante servindo um chopp ao lado do bolo" },
  { label: "Churrascos", title: "Brasa acesa. Hoperários na torneira.", copy: "Chopp gelado, cremoso e sem improviso para acompanhar a resenha do começo ao fim.", image: "/momento-churrasco-v2.webp", alt: "Amigos reunidos junto à churrasqueira e à torneira de chopp" },
  { label: "Empresas", title: "O time reúne. A Hoperários serve.", copy: "Estrutura completa para confraternizações, encontros de equipe e ativações com sabor local.", image: "/momento-empresas-v2.webp", alt: "Profissional servindo chopp em uma confraternização empresarial" },
];

const faqs = [
  ["O que vem no kit?", "Seu Hoperários chega com barril, chopeira regulada, cilindro de gás, entrega e instalação. Tudo pronto para abrir a torneira."],
  ["Vocês instalam no mesmo dia?", "Sim, conforme disponibilidade e rota. O atendimento pode acontecer até 23h; confirme o horário pelo WhatsApp."],
  ["O chopp sai com muita espuma?", "A equipe Hoperários entrega a chopeira regulada para o chopp sair cremoso e no ponto. Também orientamos quem vai servir os primeiros copos."],
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

function DraftStaticRender({ name, color }: { name: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled || !canvasRef.current) return;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const source = document.createElement("canvas");
      source.width = width;
      source.height = height;
      const sourceContext = source.getContext("2d", { willReadFrequently: true });
      if (!sourceContext) return;
      sourceContext.drawImage(image, 0, 0);
      const imageData = sourceContext.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const targetRed = Number.parseInt(color.slice(1, 3), 16);
      const targetGreen = Number.parseInt(color.slice(3, 5), 16);
      const targetBlue = Number.parseInt(color.slice(5, 7), 16);

      for (let offset = 0; offset < pixels.length; offset += 4) {
        const red = pixels[offset];
        const green = pixels[offset + 1];
        const blue = pixels[offset + 2];
        const brightness = Math.max(red, green, blue);
        const alpha = brightness < 12 ? 0 : Math.min(255, (brightness - 10) * 3.3);
        if (!alpha) {
          pixels[offset + 3] = 0;
          continue;
        }
        const visibleScale = alpha < 255 ? 255 / alpha : 1;
        pixels[offset] = Math.min(255, red * visibleScale);
        pixels[offset + 1] = Math.min(255, green * visibleScale);
        pixels[offset + 2] = Math.min(255, blue * visibleScale);
        pixels[offset + 3] = alpha;

        const pixel = offset / 4;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        const inStream = x > width * .4 && x < width * .55 && y > height * .2 && y < height * .49;
        const inGlass = x > width * .31 && x < width * .72 && y > height * .42 && y < height * .96;
        const inFoam = x > width * .35 && x < width * .65 && y > height * .422 && y < height * .535;
        const isFoam = inFoam && brightness > 40;
        const isBeer = red > 70 && red > blue * 1.28 && green > blue * 1.14 && red - blue > 32;

        if (isFoam) {
          const foamLuminance = (.2126 * red + .7152 * green + .0722 * blue) / 255;
          const foamLift = .5 + foamLuminance * .14;
          pixels[offset] += (252 - pixels[offset]) * foamLift;
          pixels[offset + 1] += (249 - pixels[offset + 1]) * foamLift;
          pixels[offset + 2] += (239 - pixels[offset + 2]) * foamLift;
        } else if (isBeer && (inStream || inGlass)) {
          const luminance = (.2126 * red + .7152 * green + .0722 * blue) / 255;
          const shade = .48 + luminance * .78;
          const highlight = Math.max(0, luminance - .68) * .72;
          pixels[offset] = Math.min(255, targetRed * shade + 255 * highlight);
          pixels[offset + 1] = Math.min(255, targetGreen * shade + 245 * highlight);
          pixels[offset + 2] = Math.min(255, targetBlue * shade + 220 * highlight);
        }
      }

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const canvasContext = canvasRef.current.getContext("2d");
      if (!canvasContext) return;
      canvasContext.putImageData(imageData, 0, 0);

      const wordmark = new Image();
      wordmark.onload = () => {
        if (cancelled || !canvasRef.current) return;
        const logoWidth = width * .19;
        const logoHeight = logoWidth * wordmark.naturalHeight / wordmark.naturalWidth;
        canvasContext.save();
        canvasContext.translate(width * .5, height * .625);
        canvasContext.rotate(-.035);
        canvasContext.transform(1, 0, -.035, .88, 0, 0);
        canvasContext.globalAlpha = .86;
        canvasContext.globalCompositeOperation = "multiply";
        canvasContext.drawImage(wordmark, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
        canvasContext.restore();
      };
      wordmark.src = "/hoperarios-wordmark-clean.png";
    };

    image.src = "/chopp-tap-3d-v1.png";
    return () => { cancelled = true; };
  }, [color]);

  return <div className="render-stage render-stage--static" role="img" aria-label={`Render 3D de uma torneira servindo um copo cheio de ${name}`}><canvas className="render-static" ref={canvasRef}/></div>;
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

  useEffect(() => {
    moments.forEach(({ image }) => {
      const preload = new Image();
      preload.src = image;
      void preload.decode().catch(() => undefined);
    });
  }, []);

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

  const drinkingPeople = useMemo(() => Math.ceil(people * drinkingShare / 100), [people, drinkingShare]);
  const liters = useMemo(() => Math.ceil(drinkingPeople * hours * consumptionRate / 1000 / 10) * 10, [drinkingPeople, hours, consumptionRate]);
  const safeTarget = useMemo(() => Math.ceil(liters * 1.1 / 10) * 10, [liters]);
  const recommendation = useMemo(() => recommendBarrels(safeTarget), [safeTarget]);
  const safetyMargin = recommendation.capacity - liters;
  const calcWa = wa(`Olá! Fiz o cálculo no site da Hoperários para ${people} convidados por ${hours} horas. Considerei ${drinkingShare}% bebendo chopp (${drinkingPeople} pessoas), no perfil de ${consumptionRate} ml por pessoa/hora. O consumo estimado foi ${liters} L e a recomendação segura foi ${recommendation.label} (${recommendation.capacity} L disponíveis, com ${safetyMargin} L de margem). Quero confirmar meu orçamento.`);
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
          <p className="kicker">Feito em Volta Redonda • Servido na sua festa</p>
          <h1>O chopp da fonte.<br/><em>Na sua festa.</em></h1>
          <p>Da nossa cervejaria direto para o seu evento: chopp Hoperários, barril, chopeira regulada, gás e instalação no local.</p>
          <div className="hero-actions"><a className="button gold" href={baseWa} target="_blank">Levar Hoperários pra festa <b>↗</b></a><a className="round-link" href="#chopes" aria-label="Conhecer os chopes">↓</a></div>
          <div className="hero-meta"><span><b>30L</b> ou <b>50L</b></span><span>Instalação<br/>inclusa</span><span>Atendimento<br/>até 23h*</span></div>
        </div>
      </div>
      <a className="scroll-cue" href="#chopes"><span>Role para servir</span><i></i></a>
    </section>

    <section className="proof"><div><strong>+21 mil</strong><span>pessoas na roda Hoperários</span></div><div><strong>Até 23h</strong><span>para instalar no mesmo dia*</span></div><div><strong>100% local</strong><span>chopp da casa, sem revenda</span></div><small>*Conforme disponibilidade e rota.</small></section>

    <section className="beer-showcase reveal" id="chopes" style={{ "--beer-accent": chopes[beer].color, "--beer-liquid": chopes[beer].color } as React.CSSProperties}>
      <div className="showcase-heading"><p className="kicker">Escolha o seu Hoperários</p><h2>Da nossa casa.<br/><i>Para a sua roda.</i></h2></div>
      <div className="beer-stage" onTouchStart={e => setTouchStart(e.touches[0].clientX)} onTouchEnd={e => { if (touchStart === null) return; const d = e.changedTouches[0].clientX - touchStart; if (Math.abs(d) > 45) selectBeer(beer + (d < 0 ? 1 : -1)); setTouchStart(null); }}>
        <button className="slide-arrow prev" onClick={() => selectBeer(beer - 1)} aria-label="Chopp anterior">←</button>
        <div className={`beer-visual beer-visual--${beer + 1}`} key={beer}><span className="liquid-type">{chopes[beer].type}</span><DraftStaticRender name={chopes[beer].name} color={chopes[beer].liquid}/><div className="kit-stamp"><span className="kit-mark">✓</span><span><small>Kit completo instalado</small><b>Barril · Chopeira · Gás</b></span></div><div className="beer-index">0{beer + 1}</div></div>
        <article className="beer-details" key={chopes[beer].name}><p className="kicker">{chopes[beer].type}</p><h3>{chopes[beer].name}</h3><p>{chopes[beer].desc}</p><div className="beer-specs"><span><small>Teor</small><b>{chopes[beer].abv}</b></span><span><small>Serviço</small><b>{chopes[beer].temp}</b></span></div><div className="beer-prices"><span><small>30 litros</small><b>{chopes[beer].p30}</b></span><span><small>50 litros</small><b>{chopes[beer].p50}</b></span></div><a className="button gold" href={wa(`Olá! Quero um orçamento do chopp ${chopes[beer].name} para meu evento.`)} target="_blank">Pedir este chopp ↗</a></article>
        <button className="slide-arrow next" onClick={() => selectBeer(beer + 1)} aria-label="Próximo chopp">→</button>
      </div>
      <div className="beer-nav">{chopes.map((c, i) => <button className={beer === i ? "active" : ""} onClick={() => setBeer(i)} key={c.name}><b>0{i + 1}</b><span>{c.name}</span></button>)}</div>
      <p className="price-note">Os estilos especiais Hoperários variam de R$ 620 a R$ 1.250. Taxa extra apenas em domingos/feriados ou reposição durante a festa.</p>
    </section>

    <section className="moments reveal" id="momentos"><div className="moment-photo moment-collage">{moments.map((m, i) => <button type="button" key={m.image} className={`moment-tile ${moment === i ? "active" : ""}`} onClick={() => setMoment(i)} aria-label={`Ver detalhes de ${m.label}`}><img src={m.image} alt={m.alt} loading="eager" decoding="async" fetchPriority={i === 0 ? "high" : "auto"}/><span><b>0{i + 1}</b>{m.label}</span></button>)}</div><div className="moment-copy"><p className="kicker">Hoperários em todo encontro</p><h2>Quatro momentos.<br/>Uma certeza:<br/><i>chopp da casa.</i></h2><div className="moment-tabs">{moments.map((m, i) => <button key={m.label} className={moment === i ? "active" : ""} onClick={() => setMoment(i)}><b>0{i + 1}</b><span>{m.label}</span><i>↗</i></button>)}</div><article key={moments[moment].title}><h3>{moments[moment].title}</h3><p>{moments[moment].copy}</p></article></div></section>

    <section className="care reveal"><header><p className="kicker">Quem faz o chopp cuida de tudo</p><h2>Você chama.<br/><i>A Hoperários resolve.</i></h2><p>Quem produz conhece cada detalhe. Por isso, seu Hoperários chega com o sistema completo, regulado e pronto para o primeiro copo.</p></header><div className="care-grid">{[
      { number: "01", icon: "barrel", title: "Feito por Hoperários", copy: "Chopp de marca própria, produzido aqui. Da nossa casa para a sua festa." },
      { number: "02", icon: "temperature", title: "Tiragem no ponto", copy: "Chopeira regulada para servir gelado, cremoso e sem excesso de espuma." },
      { number: "03", icon: "cylinder", title: "Festa sem pausa", copy: "Cilindro de gás reserva incluso para a rodada não parar no melhor momento." },
      { number: "04", icon: "delivery", title: "Chegou, montou, brindou", copy: "A equipe entrega e instala o kit. Você só abre a torneira e aproveita." },
    ].map(item => <article key={item.number}><b>{item.number}</b><div className={`care-icon care-icon--${item.icon}`} aria-hidden="true"><i><span></span></i></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>

    <section className="how reveal"><p className="kicker">Da nossa cervejaria para o seu evento</p><h2>Você chama. A gente faz acontecer.</h2><div className="steps">{[["01","Chame a Hoperários","Conte data, local e número de convidados pelo WhatsApp."],["02","A gente prepara","Separamos o chopp, o volume e todo o equipamento da festa."],["03","Chegamos e instalamos","Levamos o kit e deixamos a chopeira regulada no local."],["04","Abra a torneira","Sirva seu Hoperários no ponto e aproveite a rodada."]].map(x => <article key={x[0]}><b>{x[0]}</b><div></div><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

    <section className="calculator reveal" id="calculadora"><div className="calc-intro"><p className="kicker">Barril na medida Hoperários</p><h2>Quanto chopp<br/><i>vai pra sua roda?</i></h2><p>Conte como vai ser a festa. A gente cruza público, duração e perfil da turma para chegar mais perto do consumo real.</p><div className="calc-method"><span><b>{drinkingPeople}</b> pessoas bebendo</span><span><b>+10%</b> de margem segura</span></div></div><div className="calc-card"><div className="calc-primary"><div className="calc-control"><label><span>Quantas pessoas?</span><strong>{people}</strong><input aria-label="Número de pessoas" type="range" min="10" max={extendedPeople ? "1000" : "250"} step={extendedPeople ? "50" : "10"} value={people} onChange={e => setPeople(+e.target.value)}/><small><i>10</i><i>{extendedPeople ? "1.000" : "250"}</i></small></label><div className="range-more"><button type="button" aria-pressed={extendedPeople} onClick={toggleExtendedPeople}>{extendedPeople ? "Voltar para até 250" : "Mais de 250? Calcular até 1.000"} <b>{extendedPeople ? "−" : "+"}</b></button>{extendedPeople && <small>Acima de 1.000 pessoas, confirme a estrutura pelo WhatsApp.</small>}</div></div><div className="calc-control"><label><span>Quantas horas?</span><strong>{hours}h</strong><input aria-label="Duração do evento em horas" type="range" min="2" max={extendedHours ? "24" : "10"} value={hours} onChange={e => setHours(+e.target.value)}/><small><i>2h</i><i>{extendedHours ? "24h" : "10h"}</i></small></label><div className="range-more"><button type="button" aria-pressed={extendedHours} onClick={toggleExtendedHours}>{extendedHours ? "Voltar para até 10h" : "Mais de 10h? Calcular até 24h"} <b>{extendedHours ? "−" : "+"}</b></button>{extendedHours && <small>Acima de 24h, confirme a operação pelo WhatsApp.</small>}</div></div></div><label className="drinking-control"><span>Quantos convidados bebem chopp?</span><strong>{drinkingShare}% <small>≈ {drinkingPeople} pessoas</small></strong><input aria-label="Percentual de convidados que bebem chopp" type="range" min="20" max="100" step="5" value={drinkingShare} onChange={e => setDrinkingShare(+e.target.value)}/><small><i>20%</i><i>100%</i></small></label><fieldset className="consumption-profile"><legend>Como é o consumo da turma?</legend><div>{consumptionProfiles.map(profile => <button type="button" key={profile.rate} className={consumptionRate === profile.rate ? "active" : ""} aria-pressed={consumptionRate === profile.rate} onClick={() => setConsumptionRate(profile.rate)}><b>{profile.label}</b><span>{profile.rate} ml/h</span><small>{profile.note}</small></button>)}</div></fieldset><div className="result"><small>Consumo estimado</small><b>{liters} litros</b><div className="recommendation"><small>Recomendação segura</small><strong>{recommendation.label}</strong><span>{recommendation.capacity} L disponíveis · {safetyMargin} L de margem</span></div></div><div className="calc-benefits" aria-label="Benefícios inclusos"><span>✓ Chopeira inclusa</span><span>✓ Gás reserva</span><span>✓ Instalação no local</span></div><a className="button gold" href={calcWa} target="_blank">Levar cálculo à Hoperários ↗</a></div></section>

    <section className="faq reveal"><div><p className="kicker">Antes do primeiro copo</p><h2>Tudo certo.<br/><i>Antes da festa.</i></h2></div><div className="faq-list">{faqs.map((f, i) => <article key={f[0]}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{f[0]}</span><b>{openFaq === i ? "−" : "+"}</b></button>{openFaq === i && <p>{f[1]}</p>}</article>)}</div></section>

    <section className="final-cta reveal"><p className="kicker">Viva a revolução cervejeira</p><h2>Sua festa pede<br/><i>Hoperários.</i></h2><p>Fale direto com quem produz o chopp, confirme a disponibilidade e receba seu orçamento.</p><a className="button gold" href={baseWa} target="_blank">Levar Hoperários pra festa <b>↗</b></a></section>
    <a className="floating-wa" href={baseWa} target="_blank" aria-label="Falar no WhatsApp">WhatsApp <b>↗</b></a>
    <footer><a className="footer-logo" href="#top"><img src="/hoperarios-wordmark-clean.png" alt="Hoperários Cervejaria"/></a><p>Chopp de Volta Redonda, feito por Hoperários.<br/>Barril, chopeira, gás, entrega e instalação.</p><div><a href="https://www.instagram.com/cervejariahoperarios/" target="_blank">Instagram ↗</a><a href={baseWa} target="_blank">WhatsApp ↗</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></footer>
  </main>;
}
