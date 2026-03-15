// ========================================
// きょうりゅう ずかん
// ========================================

const Zukan = {
  STORAGE_KEY: "nazo-gohoubi-zukan",

  // 恐竜対応表（あ行・か行の10文字）
  dinoMap: {
    "あ": { name: "アロサウルス", emoji: "🦖", color: "#E74C3C", desc: "するどい つめで たたかう にくしょく きょうりゅう！", img: null },
    "い": { name: "イグアノドン", emoji: "🦕", color: "#27AE60", desc: "おやゆびの トゲが とくちょう！", img: null },
    "う": { name: "ウルトラサウルス", emoji: "🦕", color: "#3498DB", desc: "とっても おおきい くびなが きょうりゅう！", img: null },
    "え": { name: "エラスモサウルス", emoji: "🐉", color: "#8E44AD", desc: "なが〜い くびの うみの きょうりゅう！", img: null },
    "お": { name: "オヴィラプトル", emoji: "🥚", color: "#F39C12", desc: "たまごが だいすきな きょうりゅう！", img: null },
    "か": { name: "カルノタウルス", emoji: "🦖", color: "#C0392B", desc: "あたまに つのがある こわい やつ！", img: null },
    "き": { name: "ギガノトサウルス", emoji: "🔥", color: "#D35400", desc: "ティラノより おおきい さいきょう きょうりゅう！", img: null },
    "く": { name: "クリョロフォサウルス", emoji: "❄️", color: "#2980B9", desc: "こおりの だいちに すんでいた！", img: null },
    "け": { name: "ケラトサウルス", emoji: "🦴", color: "#7D3C98", desc: "はなの うえに つのが ある！", img: null },
    "こ": { name: "コンプソグナトゥス", emoji: "🦎", color: "#16A085", desc: "ちいさくて すばしっこい きょうりゅう！", img: null },
  },

  // 取得済みセット
  collected: new Set(),

  // --- 初期化 ---
  init() {
    this.load();
  },

  // --- 永続化 ---
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.collected = new Set(JSON.parse(saved));
      }
    } catch (e) {
      this.collected = new Set();
    }
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this.collected]));
  },

  // --- ごほうび時に恐竜をゲット ---
  collectForReward() {
    const allChars = Object.keys(this.dinoMap);
    const uncollected = allChars.filter(c => !this.collected.has(c));

    let char;
    let isNew;

    if (uncollected.length > 0) {
      // 未取得からランダム
      char = uncollected[Math.floor(Math.random() * uncollected.length)];
      isNew = true;
      this.collected.add(char);
      this.save();
    } else {
      // 全部持っている → 既存からランダム
      char = allChars[Math.floor(Math.random() * allChars.length)];
      isNew = false;
    }

    return { isNew, char, dino: this.dinoMap[char] };
  },

  // --- 進捗 ---
  getProgress() {
    return {
      collected: this.collected.size,
      total: Object.keys(this.dinoMap).length,
    };
  },

  // --- 図鑑画面を描画 ---
  renderZukanScreen() {
    const overlay = document.getElementById("zukan-overlay");
    const grid = document.getElementById("zukan-grid");
    const progress = document.getElementById("zukan-progress");

    // 進捗更新
    const p = this.getProgress();
    progress.textContent = `${p.collected} / ${p.total} たい`;

    // グリッド描画
    grid.innerHTML = "";
    const allChars = Object.keys(this.dinoMap);

    for (const char of allChars) {
      const dino = this.dinoMap[char];
      const owned = this.collected.has(char);

      const card = document.createElement("div");
      card.className = "zukan-card" + (owned ? " owned" : " locked");

      if (owned) {
        card.style.borderColor = dino.color;
        card.innerHTML = `
          <div class="zukan-card-icon" style="background: ${dino.color}20;">
            ${dino.img ? `<img src="${dino.img}" alt="${dino.name}">` : `<span class="zukan-card-emoji">${dino.emoji}</span>`}
          </div>
          <div class="zukan-card-name">${dino.name}</div>
          <div class="zukan-card-char">${char}</div>
        `;
        card.addEventListener("click", () => this.showDetail(char));
      } else {
        card.innerHTML = `
          <div class="zukan-card-icon">
            <span class="zukan-card-emoji locked-emoji">？</span>
          </div>
          <div class="zukan-card-name">？？？</div>
          <div class="zukan-card-char">${char}</div>
        `;
      }

      grid.appendChild(card);
    }

    overlay.classList.remove("hidden");
  },

  // --- 図鑑を閉じる ---
  hideZukanScreen() {
    document.getElementById("zukan-overlay").classList.add("hidden");
  },

  // --- 詳細ポップアップ ---
  showDetail(char) {
    if (!this.collected.has(char)) return;

    const dino = this.dinoMap[char];
    const detail = document.getElementById("zukan-detail");

    detail.innerHTML = `
      <div class="zukan-detail-card" style="border-color: ${dino.color};">
        <div class="zukan-detail-icon" style="background: ${dino.color}30;">
          ${dino.img ? `<img src="${dino.img}" alt="${dino.name}">` : `<span class="zukan-detail-emoji">${dino.emoji}</span>`}
        </div>
        <div class="zukan-detail-char" style="color: ${dino.color};">「${char}」</div>
        <div class="zukan-detail-name">${dino.name}</div>
        <div class="zukan-detail-desc">${dino.desc}</div>
        <button class="zukan-detail-close-btn" id="btn-zukan-detail-close">とじる</button>
      </div>
    `;

    detail.classList.remove("hidden");

    document.getElementById("btn-zukan-detail-close").addEventListener("click", () => {
      detail.classList.add("hidden");
    });

    // 背景タップで閉じる
    detail.addEventListener("click", (e) => {
      if (e.target === detail) {
        detail.classList.add("hidden");
      }
    });
  },

  // --- リセット ---
  reset() {
    this.collected.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  },
};

// 起動時に初期化
Zukan.init();
