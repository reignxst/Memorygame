# 🃏 Memory Question Game

## Mga Files
- `index.html`  — structure ng page (HTML)
- `style.css`   — lahat ng kulay, design, animations
- `script.js`   — game logic at cards data

---

## ▶️ Paano patakbuhin
I-open lang ang `index.html` sa browser.
Hindi kailangan ng server — double-click na lang.

---

## 🖼️ Paano maglagay ng sariling pictures

### Option A — Online URL (pinakamadali)
Hanapin ang image online, i-right-click → "Copy image address",
tapos i-paste sa `img:` field sa `script.js`:

```js
img: "https://link-ng-picture-mo.jpg",
```

### Option B — Local na picture (nasa computer mo)
1. Gumawa ng folder na `images` sa loob ng memorygames folder
2. I-lagay dun ang mga picture mo (ex: `malupiton.jpg`)
3. Sa `script.js`, gamitin ang relative path:

```js
img: "images/malupiton.jpg",
```

---

## ✏️ Paano mag-edit ng cards (sa script.js)

Bawat card ay ganito ang format:

```js
{
  id: 1,                          // ← natatanging numero, huwag parehoin
  img: "images/iyong-pic.jpg",    // ← URL o path ng picture
  label: "Pangalan ng card",      // ← label lang, hindi nakikita sa laro
  question: "Anong tanong dito?", // ← lalabas sa question modal
  choices: ["A", "B", "C", "D"], // ← laging 4 choices
  answer: "B"                     // ← dapat exactly same sa isa sa choices
},
```

### ⚠️ Tandaan:
- Ang `answer` ay dapat **exactly** same (same spelling, same case) sa isa sa `choices`
- Ang bilang ng cards sa `cardsData` ay dapat **EVEN** (2, 4, 6, 8...) dahil nagdouble para sa matching
- Ang bawat `id` ay dapat **natatangi** (1, 2, 3, 4...)

---

## 🎨 Paano baguhin ang kulay (sa style.css)

Sa simula ng `style.css`, makikita mo ang:

```css
:root {
  --team1: #ff6b6b;   /* ← kulay ng Team 1 panel */
  --team2: #4ecdc4;   /* ← kulay ng Team 2 panel */
  --gold:  #ffd700;   /* ← kulay ng active glow */
  --bg:    #1a1a2e;   /* ← background ng page */
  --accent:#e94560;   /* ← accent color */
}
```

Palitan lang ang hex color values para baguhin ang theme.

---

## 🏷️ Paano baguhin ang title

Sa `index.html`, hanapin ang:

```html
<h1>🃏 Memory Challenge</h1>
<p>Match the cards, answer the question, steal the win!</p>
```

Palitan ng gusto mong text.

---

## 🎮 Game Rules
1. Mag-flip ng dalawang card — kapag nag-match, may lalabas na tanong
2. Ang kasalukuyang team ay sasagot muna
3. **3 attempts total** — alternate ang sagot ng dalawang team
4. Kung tama → +points ang sumabot, tapos next turn
5. Kung lahat ng 3 attempts ay mali → walang points, next turn

**Steal system:**
- Attempt 1: Team A
- Attempt 2: Team B (steal chance)
- Attempt 3: Team A (last chance)
- Attempt 3 mali pa rin → walang nakakuha ng points
