// Turns a slide from posts.mjs into a standalone 1080×1350 HTML page.
// Four visual identities (themes) share one grid, one type system and one
// brand header/footer, so the posts look different but clearly belong together.
import * as art from "./art.mjs";
import { icon, logoMark } from "./art.mjs";

const NAVY = "#0B2545";
const TURQ = "#14B8A6";

export const themes = {
  // Post 1 · white clinical, turquoise color blocks
  clinical: {
    bg: "#FFFFFF", surface: "#F2F8FA", card: "#FFFFFF", text: NAVY, muted: "#4A6178",
    accent: TURQ, accentText: "#0E8C80", chip: "#E3F6F3", line: "#DCE8EE",
    alertBg: NAVY, alertText: "#FFFFFF", alertAccent: "#5EEAD4",
    art: { ink: NAVY, accent: TURQ, white: "#FFFFFF", soft: "#E8F7F5", decay: "#6B4430",
      enamel: "#FFFFFF", dentin: "#F5ECDD", pulp: "#F2A08A", pulpLine: "#D9694A",
      gum: "#F7CFC7", gumLine: "#E59D92" },
  },
  // Post 2 · dark navy, a muted coral reserved for inflammation
  navy: {
    bg: NAVY, surface: "#12325A", card: "#12325A", text: "#FFFFFF", muted: "#A9BCD0",
    accent: "#2DD4BF", accentText: "#5EEAD4", chip: "rgba(45,212,191,0.14)", line: "rgba(255,255,255,0.12)",
    alertBg: "#FFFFFF", alertText: NAVY, alertAccent: "#E0604A",
    art: { ink: NAVY, accent: "#2DD4BF", white: "#FFFFFF", soft: "#12325A", panel: "#0E2C50",
      bone: "#2C4C73", boneLine: "#8AA6C6", gum: "#F0B8B0", inflamed: "#E86A55", inflamedLine: "#FF8E73" },
  },
  // Post 3 · light blueprint / technical drawing
  blueprint: {
    bg: "#F3F7FA", surface: "#FFFFFF", card: "#FFFFFF", text: NAVY, muted: "#4A6178",
    accent: TURQ, accentText: "#0E8C80", chip: "#FFFFFF", line: "#C9D8E4",
    alertBg: "#FFFFFF", alertText: NAVY, alertAccent: "#E0604A",
    art: { ink: NAVY, accent: TURQ, accentSoft: "#D5F5F0", paper: "#FFFFFF", bone: "#E4EDF4" },
  },
  // Post 4 · cold turquoise gradient, ice motif
  thermal: {
    bg: "#FFFFFF", surface: "#EEF9F8", card: "#FFFFFF", text: NAVY, muted: "#4A6178",
    accent: TURQ, accentText: "#0E8C80", chip: "#E3F6F3", line: "#D5ECEA",
    alertBg: "#0E7C86", alertText: "#FFFFFF", alertAccent: "#9EEBE2",
    art: { ink: NAVY, accent: TURQ, accentSoft: "#9EEBE2", white: "#FFFFFF",
      enamel: "#FFFFFF", dentin: "#F5ECDD", pulp: "#F2A08A", pulpLine: "#D9694A",
      gum: "#F7CFC7", gumLine: "#E59D92" },
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// [[French]] → isolated LTR run, **word** → accent.
export const rich = (s = "") =>
  esc(s)
    .replace(/\[\[(.+?)\]\]/g, '<bdi class="fr">$1</bdi>')
    .replace(/\*\*(.+?)\*\*/g, "<em>$1</em>");

const header = (t, post, index, total) => `
<header class="top">
  <div class="brand" dir="ltr">${logoMark(t.accent, "none", 54)}<span>Cabinet Dentaire <b>Elbahja</b></span></div>
  <div class="count" dir="ltr"><span class="topic">${esc(post.topicFr)}</span><b>${String(index + 1).padStart(2, "0")}</b><i>/${String(total).padStart(2, "0")}</i></div>
</header>`;

const footer = (index, total, last) => `
<footer class="bottom">
  <div class="progress">${Array.from({ length: total }, (_, i) => `<span class="${i <= index ? "on" : ""}"></span>`).join("")}</div>
  <div class="swipe">${last ? "سجّل البوست وشاركو مع العائلة" : `كمّل <span class="arrow">${icon("arrow", 40, 4)}</span>`}</div>
</footer>`;

const hook = (s, t) => `
<main class="hook">
  <div class="kicker">${rich(s.kicker)}</div>
  <h1>${s.title.map((l) => `<span>${rich(l)}</span>`).join("")}</h1>
  <p class="sub">${rich(s.sub)}</p>
  ${art[s.art](t.art)}
</main>`;

const explain = (s, t) => `
<main class="explain">
  <h2>${rich(s.title)}</h2>
  <p class="body">${rich(s.body)}</p>
  ${art[s.art](t.art)}
  ${s.note ? `<div class="note">${icon("check", 40, 4)}<span>${rich(s.note)}</span></div>` : ""}
</main>`;

const list = (s) => `
<main class="list ${s.items.length > 4 && s.alert ? "dense" : ""}">
  <h2>${rich(s.title)}</h2>
  <ul>${s.items.map((it) => `<li><span class="ic">${icon(it.icon, 50, 3.2)}</span><span>${rich(it.text)}</span></li>`).join("")}</ul>
  ${s.alert ? `<div class="alert"><span class="ic">${icon("alert", 46, 3.4)}</span><div><b>${rich(s.alert.title)}</b><p>${rich(s.alert.text)}</p></div></div>` : ""}
</main>`;

const tips = (s) => `
<main class="tips ${s.consult ? "with-consult" : ""}">
  <h2>${rich(s.title)}</h2>
  ${s.intro ? `<p class="intro">${rich(s.intro)}</p>` : ""}
  <ol>${s.items.map((it, i) => `<li><span class="num">${i + 1}</span><span class="ic">${icon(it.icon, 46, 3.2)}</span><div><b>${rich(it.text)}</b>${it.sub ? `<p>${rich(it.sub)}</p>` : ""}</div></li>`).join("")}</ol>
  ${s.consult ? `<div class="consult">${icon("calendar", 44, 3.4)}<p>${rich(s.consult)}</p></div>` : ""}
</main>`;

const cta = (s, t, brand) => `
<main class="cta">
  <div class="cta-logo">${logoMark(t.accent, "none", 132)}</div>
  <h2>${s.title.map((l) => `<span>${rich(l)}</span>`).join("")}</h2>
  <p class="sub">${rich(s.sub)}</p>
  <div class="call">
    <div class="call-label">${icon("phone", 44, 3.4)}<span>عيط ولا صيفط ميساج باش تاخد موعد</span></div>
    <div class="call-number" dir="ltr">${brand.phone}</div>
  </div>
  <div class="id-card" dir="ltr">
    <div class="id-name">Cabinet Dentaire <b>Elbahja</b></div>
    <div class="id-meta"><span>${brand.role}</span><span class="sep"></span><span class="ic">${icon("insta", 30, 3.4)}</span><span>${brand.handle}</span></div>
    <div class="id-meta id-address"><span class="ic">${icon("pin", 30, 3.4)}</span><span>${esc(brand.address)}</span></div>
  </div>
  <p class="disclaimer">${rich(brand.disclaimer)}</p>
</main>`;

const builders = { hook, explain, list, tips, cta };

export const renderSlide = ({ post, slide, index, total, brand, fontCss }) => {
  const t = themes[post.theme];
  const vars = Object.entries(t)
    .filter(([, v]) => typeof v === "string")
    .map(([k, v]) => `--${k}:${v};`)
    .join("");
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>${esc(post.topicFr)} · ${index + 1}/${total}</title>
${fontCss}
<style>:root{${vars}}</style>
<style>${CSS}</style>
</head>
<body>
<div class="slide theme-${post.theme} slide-${slide.type}">
  ${header(t, post, index, total)}
  ${builders[slide.type](slide, t, brand)}
  ${footer(index, total, index === total - 1)}
</div>
</body>
</html>`;
};

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden;background:var(--bg)}
body{font-family:Tajawal,Cairo,sans-serif;color:var(--text);-webkit-font-smoothing:antialiased}
.slide{position:relative;width:1080px;height:1350px;padding:72px 84px 64px;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}
h1,h2,.stage-title,.cta h2{font-family:Cairo,sans-serif}
em{font-style:normal;color:var(--accentText)}
bdi.fr{font-family:Cairo,sans-serif;font-weight:600;letter-spacing:0}
.ico{display:block;flex:none}

/* header / footer */
.top{display:flex;justify-content:space-between;align-items:center;height:64px;flex:none}
.brand{display:flex;align-items:center;gap:16px;font-family:Cairo,sans-serif;font-size:27px;font-weight:600;color:var(--text);letter-spacing:.2px}
.brand b{font-weight:800}
.count{display:flex;align-items:baseline;gap:6px;font-family:Cairo,sans-serif;color:var(--muted);font-size:26px}
.count b{color:var(--text);font-weight:800;font-size:30px}
.count i{font-style:normal}
.count .topic{font-size:21px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--accentText);margin-right:22px;padding:8px 16px;border-radius:99px;background:var(--chip)}
main{flex:1;display:flex;flex-direction:column;min-height:0}
.bottom{flex:none;display:flex;justify-content:space-between;align-items:center;height:56px}
.progress{display:flex;gap:10px;direction:ltr}
.progress span{width:34px;height:7px;border-radius:9px;background:var(--line)}
.progress span.on{background:var(--accent)}
.bottom .progress{order:2}
.swipe{font-size:28px;font-weight:700;color:var(--muted);display:flex;gap:12px;align-items:center}
.swipe .arrow{color:var(--accent)}

/* hook */
.hook{padding-top:46px}
.kicker{align-self:flex-start;font-size:28px;font-weight:700;color:var(--accentText);background:var(--chip);padding:12px 26px;border-radius:99px}
.hook h1{margin-top:30px;font-size:94px;line-height:1.22;font-weight:800;letter-spacing:-.5px}
.hook h1 span{display:block}
.hook .sub{margin-top:22px;font-size:40px;line-height:1.5;color:var(--muted);font-weight:500;max-width:860px}
.art-hook{flex:1;position:relative;min-height:0;margin:24px 0 18px}
.art-hook svg{position:absolute;inset:0;width:100%;height:100%}

/* section titles */
h2{font-size:72px;line-height:1.25;font-weight:800;letter-spacing:-.3px}
.explain,.list,.tips{padding-top:40px}
.body{margin-top:22px;font-size:40px;line-height:1.6;color:var(--muted);font-weight:500}
.body em{font-weight:700}

/* stages (3-column diagram) */
.stages{margin-top:auto;margin-bottom:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;direction:ltr}
.stage{direction:rtl;background:var(--surface);border-radius:34px;padding:26px 22px 30px;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative}
.stage-art{height:300px;display:flex;align-items:center;justify-content:center}
.stage-art svg{max-height:300px}
.stage-n{position:absolute;top:18px;left:18px;width:50px;height:50px;border-radius:50%;background:var(--accent);color:#fff;font-family:Cairo;font-weight:800;font-size:28px;display:flex;align-items:center;justify-content:center}
.stage-fr{margin-top:18px;font-family:Cairo;font-weight:700;font-size:22px;letter-spacing:2.5px;text-transform:uppercase;color:var(--accentText);direction:ltr}
.stage-title{margin-top:4px;font-size:36px;font-weight:800;line-height:1.3}
.stage-text{margin-top:8px;font-size:29px;line-height:1.4;color:var(--muted);font-weight:500}
.note{display:flex;gap:18px;align-items:center;background:var(--chip);color:var(--text);border-radius:26px;padding:22px 28px;font-size:34px;font-weight:700;margin-bottom:26px}
.note .ico{color:var(--accent)}

/* sensitivity diagram */
.diagram{flex:1;display:flex;align-items:center;justify-content:space-between;gap:30px;direction:ltr;min-height:0}
.diagram-art{flex:none}
.diagram-art svg{max-height:640px}
.callouts{display:flex;flex-direction:column;gap:20px;flex:1}
.callout{direction:rtl;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:18px;align-items:center;background:var(--surface);border-radius:26px;padding:20px 26px}
.callout .dot{grid-row:1/3;width:40px;height:40px;border-radius:50%}
.callout b{font-size:30px;color:var(--accentText);text-align:right;letter-spacing:1px}
.callout span{font-size:30px;font-weight:700}

/* list */
.list ul{list-style:none;margin-top:44px;display:flex;flex-direction:column;gap:22px}
.list li{display:flex;align-items:center;gap:28px;font-size:42px;font-weight:700;line-height:1.35;padding:22px 26px;border-radius:30px;background:var(--surface)}
.list .ic,.tips .ic{width:92px;height:92px;border-radius:26px;background:var(--card);color:var(--accent);display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 0 2px var(--line) inset}
.list.dense ul{gap:16px;margin-top:36px}
.list.dense li{padding:16px 24px;font-size:39px}
.list.dense .ic{width:82px;height:82px}
.alert{margin-top:auto;margin-bottom:26px;display:flex;gap:24px;align-items:flex-start;background:var(--alertBg);color:var(--alertText);border-radius:32px;padding:30px 34px}
.alert .ic{color:var(--alertAccent);margin-top:4px}
.alert b{display:block;font-family:Cairo;font-size:36px;font-weight:800;line-height:1.35}
.alert p{margin-top:6px;font-size:33px;line-height:1.45;font-weight:500;opacity:.92}

/* tips */
.intro{margin-top:16px;font-size:36px;line-height:1.5;color:var(--muted);font-weight:500}
.tips ol{list-style:none;margin-top:40px;display:flex;flex-direction:column;gap:22px}
.tips li{display:flex;align-items:center;gap:24px;padding:24px 26px;border-radius:30px;background:var(--surface);position:relative}
.tips .num{position:absolute;top:-12px;right:-10px;width:46px;height:46px;border-radius:50%;background:var(--accent);color:#fff;font-family:Cairo;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center}
.tips li b{display:block;font-size:38px;line-height:1.35;font-weight:700}
.tips li p{margin-top:6px;font-size:31px;line-height:1.4;color:var(--muted);font-weight:500}
.tips.with-consult ol{gap:18px;margin-top:34px}
.tips.with-consult li{padding:20px 26px}
.consult{margin-top:auto;margin-bottom:26px;display:flex;gap:22px;align-items:center;border:3px solid var(--accent);border-radius:30px;padding:24px 30px}
.consult .ico{color:var(--accent)}
.consult p{font-size:32px;line-height:1.45;font-weight:700}

/* cta */
.cta{align-items:center;text-align:center;justify-content:center;gap:0}
.cta-logo{margin-bottom:18px}
.cta-logo svg{width:96px;height:96px}
.cta h2{font-size:84px;line-height:1.22;font-weight:800}
.cta h2 span{display:block}
.cta .sub{margin-top:18px;font-size:38px;line-height:1.5;color:var(--muted);font-weight:500;max-width:860px}
.call{margin-top:44px;width:100%;background:var(--ctaBg,${NAVY});color:#fff;border-radius:40px;padding:34px 40px 40px}
.call-label{display:flex;gap:16px;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:var(--ctaAccent,#5EEAD4)}
.call-number{margin-top:8px;font-family:Cairo;font-weight:800;font-size:104px;letter-spacing:4px;line-height:1.15}
.id-card{margin-top:30px}
.id-name{font-family:Cairo;font-size:44px;font-weight:600}
.id-name b{font-weight:800}
.id-meta{margin-top:12px;display:flex;gap:12px;align-items:center;justify-content:center;font-family:Cairo;font-size:27px;font-weight:600;color:var(--muted)}
.id-meta .ic{color:var(--accent)}
.id-address{margin-top:8px;color:var(--text)}
.id-meta .sep{width:7px;height:7px;border-radius:50%;background:var(--accent);margin:0 8px}
.disclaimer{margin-top:28px;font-size:25px;color:var(--muted);opacity:.85}

/* ── theme accents ── */
.theme-clinical.slide-cta{background:linear-gradient(180deg,#FFFFFF 0%,#EAF8F6 100%)}
.theme-clinical .tips .ic{background:var(--accent);color:#fff;box-shadow:none}

.theme-navy{--ctaBg:#FFFFFF;--ctaAccent:#0E8C80}
.theme-navy .call{color:${NAVY}}
.theme-navy.slide-hook,.theme-navy.slide-cta{background:radial-gradient(1200px 900px at 80% 10%,#163B66 0%,${NAVY} 55%,#061630 100%)}
.theme-navy .list .ic,.theme-navy .tips .ic{background:#0B2545;box-shadow:0 0 0 2px rgba(45,212,191,.35) inset}
.theme-navy .stage.warn .stage-fr,.theme-navy .stage.bad .stage-fr{color:#FF9E86}
.theme-navy .alert .ic{color:#E0604A}
.theme-navy .note{color:#fff}

.theme-blueprint{background-color:var(--bg);background-image:linear-gradient(rgba(11,37,69,.055) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(11,37,69,.055) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-1px -1px}
.theme-blueprint .stage,.theme-blueprint .list li,.theme-blueprint .tips li,.theme-blueprint .callout{border:2px solid var(--line);background:#FFFFFF}
.theme-blueprint .kicker{border:2px dashed var(--accent)}
.theme-blueprint .alert{border:3px solid #E0604A}
.theme-blueprint .alert .ic{color:#E0604A}
.theme-blueprint main:not(.cta) h2::after{content:"";display:block;width:120px;height:6px;border-radius:6px;background:var(--accent);margin-top:18px}
.theme-blueprint .stage-art{height:280px}

.theme-thermal.slide-hook{background:linear-gradient(160deg,#2DD4BF 0%,#14B8A6 35%,#0E7C86 100%);--text:#FFFFFF;--muted:rgba(255,255,255,.88);--accentText:#0B2545;--chip:rgba(255,255,255,.9);--line:rgba(255,255,255,.35);--accent:#FFFFFF}
.theme-thermal.slide-hook h1 em{color:${NAVY}}
.theme-thermal.slide-hook .brand svg rect,.theme-thermal.slide-hook .brand svg path{stroke:#fff}
.theme-thermal:not(.slide-hook)::before{content:"";position:absolute;left:0;right:0;top:0;height:460px;background:linear-gradient(180deg,#E3F7F5 0%,rgba(255,255,255,0) 100%);z-index:0}
.theme-thermal.slide-cta{background:linear-gradient(180deg,#E3F7F5 0%,#FFFFFF 60%)}
.slide>*{position:relative;z-index:1}
`;
