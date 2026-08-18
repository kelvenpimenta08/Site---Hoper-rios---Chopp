"use client";
import { useMemo, useState } from "react";

const phone = "5524998820572";
const wa = (text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const baseWa = wa("Olá, vim pelo site e quero um orçamento de chopp para meu evento.");
const chopes = [
  {name:"Lager",desc:"Leve, refrescante e democrática",abv:"4,5%",temp:"0–2°C",p30:"R$ 500",p50:"R$ 750",tag:"Mais pedida"},
  {name:"Pilsen Hoperários",desc:"Receita da casa, fresca e equilibrada",abv:"4,7%",temp:"0–2°C",p30:"R$ 550",p50:"R$ 800",tag:"Da casa"},
  {name:"Estilos especiais",desc:"American Wheat, Vienna, IPA e Sour",abv:"varia",temp:"2–6°C",p30:"R$ 620",p50:"até R$ 1.250",tag:"Para explorar"},
];

export default function Home(){
  const [ageOk,setAgeOk]=useState(false); const [people,setPeople]=useState(50); const [hours,setHours]=useState(4); const [openFaq,setOpenFaq]=useState(0);
  const liters=useMemo(()=>Math.ceil(people*hours*.35/10)*10,[people,hours]);
  const barrels=liters<=30?"1 barril de 30 L":liters<=50?"1 barril de 50 L":`${Math.ceil(liters/50)} barris de 50 L`;
  const calcWa=wa(`Olá! Fiz o cálculo no site para ${people} pessoas por ${hours} horas. A estimativa foi ${liters} L (${barrels}). Quero confirmar meu orçamento.`);
  const faqs=[
    ["O que vem no kit?","Barril escolhido, chopeira regulada, cilindro de gás, entrega e instalação. Você recebe tudo pronto para servir."],
    ["Vocês instalam no mesmo dia?","Sim, conforme disponibilidade e rota. O atendimento pode acontecer até 23h; confirme o horário pelo WhatsApp."],
    ["O chopp sai com muita espuma?","A chopeira é entregue regulada para servir o chopp cremoso e no ponto. Também orientamos quem ficará responsável por tirar os primeiros copos."],
    ["Existe alguma taxa extra?","Somente para entregas em domingos/feriados ou quando há reposição de barril durante a festa. O valor é informado antes da confirmação."],
    ["Quais cidades vocês atendem?","Volta Redonda e região. Envie o endereço do evento para confirmarmos a disponibilidade e a rota."],
    ["Quanto chopp devo pedir?","A calculadora desta página dá uma estimativa inicial. O consumo muda conforme duração, perfil dos convidados e outras bebidas; confirmamos tudo no atendimento."],
  ];
  return <main>
    {!ageOk&&<div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title"><div className="age-card"><div className="brand-mark">H</div><p className="kicker">Hoperários Cervejaria</p><h2 id="age-title">Você tem mais de 18 anos?</h2><p>Este site contém informações sobre bebidas alcoólicas.</p><div className="age-actions"><button autoFocus onClick={()=>setAgeOk(true)}>Sim, tenho 18 anos ou mais</button><a href="https://www.google.com">Não, quero sair</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></div></div>}
    <section className="hero" id="top"><nav><a className="logo" href="#top"><span>H</span><b>HOPERÁRIOS</b></a><div className="nav-links"><a href="#chopes">Chopes</a><a href="#calculadora">Calculadora</a><a className="nav-cta" href={baseWa} target="_blank">Pedir no WhatsApp</a></div></nav><div className="hero-content"><p className="kicker">Barril de chopp para eventos • Volta Redonda e região</p><h1>Chopp da nossa cervejaria.<br/><em>Direto na sua festa.</em></h1><p className="hero-copy">Kit completo, gelado e instalado: barril, chopeira regulada, cilindro de gás e atendimento local até 23h.</p><div className="hero-actions"><a className="button gold" href={baseWa} target="_blank">Quero meu barril <b>→</b></a><a className="button ghost" href="#chopes">Ver chopes e preços</a></div><div className="trust-row"><span>30 L ou 50 L</span><span>Instalação inclusa</span><span>Marca própria</span></div></div><div className="hero-stamp"><strong>CHOPP</strong><span>NO PONTO</span><small>DO BARRIL AO COPO</small></div></section>

    <section className="proof band"><div><strong>+21 mil</strong><span>seguidores acompanhando a marca</span></div><div><strong>Até 23h</strong><span>para instalar no mesmo dia*</span></div><div><strong>100% local</strong><span>produzido por quem entende de chopp</span></div><small>*Conforme disponibilidade e rota.</small></section>

    <section className="section products" id="chopes"><header className="section-head"><div><p className="kicker">Escolha seu chopp</p><h2>Do clássico ao<br/><i>inesquecível.</i></h2></div><p>Receitas pensadas para agradar a festa toda — e estilos especiais para quem quer transformar o chopp em atração.</p></header><div className="beer-grid">{chopes.map((c,i)=><article className={`beer-card b${i}`} key={c.name}><span className="tag">{c.tag}</span><div className="beer-no">0{i+1}</div><h3>{c.name}</h3><p>{c.desc}</p><div className="specs"><span><small>Teor</small>{c.abv}</span><span><small>Serviço</small>{c.temp}</span></div><div className="prices"><span><small>30 litros</small><b>{c.p30}</b></span><span><small>50 litros</small><b>{c.p50}</b></span></div><a href={wa(`Olá! Quero um orçamento do chopp ${c.name} para meu evento.`)} target="_blank">Pedir este chopp →</a></article>)}</div><p className="price-note">Estilos especiais variam de R$ 620 a R$ 1.250 conforme receita e volume. Taxa extra somente em domingo/feriado ou reposição durante a festa.</p></section>

    <section className="occasions"><div className="occasion-photo" role="img" aria-label="Amigos brindando com cerveja artesanal"></div><div className="occasion-copy"><p className="kicker">Cabe no seu momento</p><h2>Uma torneira.<br/>Muitos motivos<br/><i>pra brindar.</i></h2><div className="occasion-list">{["Casamentos","Aniversários","Churrascos","Confraternizações","Empresas","Bares e eventos"].map((x,i)=><span key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</span>)}</div></div></section>

    <section className="section difference"><header className="section-head light"><div><p className="kicker">Sem perrengue na festa</p><h2>Você brinda.<br/><i>A gente cuida.</i></h2></div><p>Não é só o barril. É a tranquilidade de receber o sistema completo, regulado e pronto para o primeiro copo.</p></header><div className="diff-grid">{[["01","Cerveja da fonte","Marca própria da cervejaria. Não somos revenda."],["02","No ponto certo","Chopeira regulada para chopp gelado, cremoso e sem excesso de espuma."],["03","Gás garantido","Cilindro reserva incluso para o chopp não parar no melhor da festa."],["04","Gente daqui","Atendimento próximo em Volta Redonda e região, até 23h."]].map(x=><article key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

    <section className="section testimonials"><header className="section-head"><div><p className="kicker">Quem prova, conta</p><h2>Histórias servidas<br/><i>no copo.</i></h2></div><p className="honesty">Os depoimentos reais entram aqui assim que forem enviados pelo cliente — sem avaliações inventadas.</p></header><div className="testimonial-placeholder"><span>“</span><p>Espaço reservado para avaliações reais de clientes da Hoperários.</p><small>Adicionar nome, ocasião e foto autorizada</small></div></section>

    <section className="how"><p className="kicker">É simples assim</p><h2>Do pedido ao primeiro copo.</h2><div className="steps">{[["01","Faça o pedido","Conte data, local e número de convidados pelo WhatsApp."],["02","Preparamos","Separamos o estilo, volume e equipamento para seu evento."],["03","Entregamos e instalamos","Levamos o kit e deixamos a chopeira regulada."],["04","Curta o momento","Abra a torneira, sirva no ponto e aproveite a festa."]].map(x=><article key={x[0]}><b>{x[0]}</b><div></div><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

    <section className="calculator" id="calculadora"><div className="calc-intro"><p className="kicker">Calculadora de chopp</p><h2>Quanto vai<br/><i>precisar?</i></h2><p>Faça uma estimativa rápida. Consideramos consumo médio de 350 ml por pessoa/hora. Depois, ajustamos juntos pelo perfil do evento.</p></div><div className="calc-card"><label><span>Quantas pessoas?</span><strong>{people}</strong><input type="range" min="10" max="250" step="10" value={people} onChange={e=>setPeople(+e.target.value)}/><small><i>10</i><i>250</i></small></label><label><span>Quantas horas?</span><strong>{hours}h</strong><input type="range" min="2" max="10" value={hours} onChange={e=>setHours(+e.target.value)}/><small><i>2h</i><i>10h</i></small></label><div className="result"><small>Estimativa inicial</small><b>{liters} litros</b><span>{barrels}</span></div><a className="button gold" href={calcWa} target="_blank">Levar cálculo ao WhatsApp →</a></div></section>

    <section className="section faq"><header className="section-head"><div><p className="kicker">Dúvidas frequentes</p><h2>Antes de abrir<br/><i>a torneira.</i></h2></div></header><div className="faq-list">{faqs.map((f,i)=><article key={f[0]} className={openFaq===i?"open":""}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span>{f[0]}</span><b>{openFaq===i?"−":"+"}</b></button>{openFaq===i&&<p>{f[1]}</p>}</article>)}</div></section>

    <section className="final-cta"><div className="cta-stamp">H</div><p className="kicker">Seu evento merece chopp de verdade</p><h2>A próxima rodada<br/><i>começa aqui.</i></h2><p>Fale direto com a equipe local, confirme a disponibilidade e receba seu orçamento.</p><a className="button gold" href={baseWa} target="_blank">Chamar no WhatsApp <b>→</b></a><small>(24) 99882-0572</small></section>
    <a className="floating-wa" href={baseWa} target="_blank" aria-label="Falar no WhatsApp">WhatsApp <b>↗</b></a>
    <footer><a className="logo" href="#top"><span>H</span><b>HOPERÁRIOS</b></a><p>Cervejaria artesanal de Volta Redonda/RJ.<br/>Barril, chopeira, gás, entrega e instalação.</p><div><a href="https://www.instagram.com/cervejariahoperarios/" target="_blank">Instagram ↗</a><a href={baseWa} target="_blank">WhatsApp ↗</a></div><small>Beba com moderação. Venda proibida para menores de 18 anos.</small></footer>
  </main>
}
