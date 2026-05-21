# Syntrix — Landing Page

Site institucional da **Syntrix** — *Advanced AI & Enterprise Autonomy*.

Site estático single-page, zero build step, pronto para deploy no Vercel (ou qualquer host de estáticos).

## Stack

- HTML5 semântico
- CSS puro (custom properties, sem framework)
- JavaScript vanilla (sem dependências em runtime)
- Google Fonts: Space Grotesk + Inter Tight + JetBrains Mono
- Canvas API para a rede neural animada do hero
- IntersectionObserver para reveal on scroll
- Animações 100% nativas (CSS + requestAnimationFrame)

## Estrutura

```
syntrix/
├─ index.html       # markup e SEO
├─ styles.css       # design system completo
├─ app.js           # canvas, observers, counters, ícones
├─ vercel.json      # headers e cache
├─ robots.txt
├─ sitemap.xml
└─ assets/
   ├─ syntrix-logo.jpeg   # logo original (referência)
   ├─ syntrix-mark.png    # apenas o hexágono
   ├─ syntrix-full.png    # marca completa
   ├─ favicon.png         # 256x256
   └─ og-image.jpg        # 1200x630 para Open Graph
```

## Deploy no Vercel

### Opção 1 — Drag & drop (mais rápido)

1. Acesse https://vercel.com/new
2. Arraste a pasta `syntrix/` (ou faça upload do `.zip`)
3. Deploy. Pronto.

### Opção 2 — CLI

```bash
npm i -g vercel
cd syntrix
vercel --prod
```

### Opção 3 — GitHub

1. Subir a pasta para um repo do GitHub
2. Importar no Vercel → "New Project"
3. Framework Preset: **Other** (é estático puro)
4. Build command: deixar vazio · Output directory: `.`

## Rodar localmente

Qualquer servidor de estáticos serve. Sugestão:

```bash
cd syntrix
python3 -m http.server 5173
# abrir http://localhost:5173
```

ou:

```bash
npx serve .
```

## Personalização rápida

- **Cores**: editar as CSS custom properties no topo do `styles.css` (bloco `:root`)
- **Conteúdo**: tudo em `index.html`, sem templating
- **Email de contato**: alterar `contato@syntrix.ai` no HTML
- **Domínio**: configurar no painel do Vercel (DNS A/CNAME)

## Performance

- Sem framework e sem build → first paint extremamente rápido
- Fontes carregadas com `preconnect`
- Canvas pausa quando a aba não está visível
- `prefers-reduced-motion` respeitado
- Headers de cache configurados no `vercel.json`

## Observações

- Métricas e cases na página são representativos/projetivos. Atualizar com dados reais conforme a empresa ganhar clientes.
- Substituir os links sociais no footer (atualmente apontam para `#`).
- A logo original (`assets/syntrix-logo.jpeg`) está incluída como referência — o site usa uma versão SVG redesenhada inline no header/footer para nitidez perfeita.

---

© 2026 Syntrix Technologies
