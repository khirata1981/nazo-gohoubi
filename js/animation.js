// ========================================
// ごほうびアニメーション（恐竜ゲット演出）
// ========================================

const RewardAnimation = {
  overlay: null,
  stage: null,
  titleEl: null,
  buttonsEl: null,
  animationTimer: null,
  effectTimers: [],

  // --- メイン制御 ---
  play(onFinish) {
    this.onFinish = onFinish;
    const result = Zukan.collectForReward();
    this.showOverlay(result);
  },

  showOverlay(result) {
    this.overlay = document.getElementById("animation-overlay");
    this.stage = document.getElementById("animation-stage");
    this.titleEl = document.getElementById("animation-title");
    this.buttonsEl = document.getElementById("animation-buttons");

    // リセット
    this.stage.innerHTML = "";
    this.stage.className = "animation-stage";
    this.buttonsEl.classList.remove("visible");
    this.clearTimers();

    // タイトル
    this.titleEl.textContent = result.isNew ? "★ たまご はっけん！ ★" : "★ また あえたね！ ★";

    // オーバーレイ表示
    this.overlay.classList.remove("hidden");

    // フラッシュ用要素
    const flash = document.createElement("div");
    flash.className = "dino-flash";
    this.stage.appendChild(flash);

    // --- フェーズ1: 卵が震える (0〜1.5秒) ---
    const egg = this.createEgg();
    this.stage.appendChild(egg);

    this.effectTimers.push(setTimeout(() => {
      egg.classList.add("shaking");
    }, 300));

    // --- フェーズ2: ヒビ＋激しく震え (1.5〜2.5秒) ---
    this.effectTimers.push(setTimeout(() => {
      egg.classList.remove("shaking");
      egg.classList.add("shaking-hard");
      // ヒビを追加
      const crack1 = document.createElement("div");
      crack1.className = "egg-crack crack-1";
      egg.querySelector(".egg-body").appendChild(crack1);
    }, 1500));

    this.effectTimers.push(setTimeout(() => {
      const crack2 = document.createElement("div");
      crack2.className = "egg-crack crack-2";
      egg.querySelector(".egg-body").appendChild(crack2);
    }, 2000));

    // --- フェーズ3: フラッシュ＋卵割れる＋殻飛散 (2.5秒) ---
    this.effectTimers.push(setTimeout(() => {
      // フラッシュ
      flash.classList.add("active");
      this.effectTimers.push(setTimeout(() => flash.classList.remove("active"), 400));

      // 卵を割る
      egg.classList.remove("shaking-hard");
      egg.classList.add("explode");

      // 殻の破片を生成
      this.spawnShellPieces(8);
    }, 2500));

    // --- フェーズ4: 恐竜ドーン！(2.9秒〜) ---
    this.effectTimers.push(setTimeout(() => {
      egg.style.display = "none";
      this.showDinoReveal(result);
    }, 2900));

    // --- フェーズ5: 星と紙吹雪 (3.2秒) ---
    this.effectTimers.push(setTimeout(() => {
      this.spawnStarsAndConfetti();
    }, 3200));

    // --- フェーズ6: ボタン表示 (4.5秒) ---
    this.animationTimer = setTimeout(() => {
      this.buttonsEl.classList.add("visible");
    }, 4500);
  },

  // --- 卵を生成 ---
  createEgg() {
    const egg = document.createElement("div");
    egg.className = "dino-egg";
    egg.innerHTML = `
      <div class="egg-body">
        <div class="egg-spot spot-1"></div>
        <div class="egg-spot spot-2"></div>
        <div class="egg-spot spot-3"></div>
      </div>
    `;
    return egg;
  },

  // --- 殻の破片 ---
  spawnShellPieces(count) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "egg-shell-piece";
      const angle = (i / count) * 360;
      const distance = 80 + Math.random() * 60;
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance - 40;
      piece.style.setProperty("--tx", `${tx}px`);
      piece.style.setProperty("--ty", `${ty}px`);
      piece.style.left = "50%";
      piece.style.top = "50%";
      this.stage.appendChild(piece);
    }
  },

  // --- 恐竜登場 ---
  showDinoReveal(result) {
    const reveal = document.createElement("div");
    reveal.className = "dino-reveal";

    const icon = document.createElement("div");
    icon.className = "dino-icon";
    icon.style.background = `${result.dino.color}20`;
    icon.style.borderColor = result.dino.color;

    if (result.dino.img) {
      const img = document.createElement("img");
      img.src = result.dino.img;
      img.alt = result.dino.name;
      img.className = "dino-img";
      icon.appendChild(img);
    } else {
      const emoji = document.createElement("span");
      emoji.className = "dino-emoji";
      emoji.textContent = result.dino.emoji;
      icon.appendChild(emoji);
    }

    const name = document.createElement("div");
    name.className = "dino-name";
    name.style.color = result.dino.color;
    name.textContent = result.dino.name;

    const desc = document.createElement("div");
    desc.className = "dino-desc";
    desc.textContent = result.dino.desc;

    reveal.appendChild(icon);

    if (result.isNew) {
      const badge = document.createElement("div");
      badge.className = "dino-new-badge";
      badge.textContent = "NEW!";
      reveal.appendChild(badge);
    }

    reveal.appendChild(name);
    reveal.appendChild(desc);

    this.stage.appendChild(reveal);
  },

  // --- 星と紙吹雪 ---
  spawnStarsAndConfetti() {
    // 星
    for (let i = 0; i < 10; i++) {
      const star = document.createElement("div");
      star.className = "dino-star";
      star.textContent = "★";
      star.style.left = `${10 + Math.random() * 80}%`;
      star.style.top = `${10 + Math.random() * 60}%`;
      star.style.animationDelay = `${Math.random() * 0.5}s`;
      star.style.color = ["#FFD93D", "#FFB347", "#FF6B6B"][Math.floor(Math.random() * 3)];
      this.stage.appendChild(star);
    }

    // 紙吹雪
    const colors = ["#FF6B6B", "#FFD93D", "#74C0FC", "#77DD77", "#FFB347", "#FF9FF3", "#A29BFE"];
    for (let i = 0; i < 25; i++) {
      const conf = document.createElement("div");
      conf.className = "dino-confetti";
      conf.style.left = `${Math.random() * 100}%`;
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDelay = `${Math.random() * 0.8}s`;
      conf.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
      this.stage.appendChild(conf);
    }
  },

  // --- 表示を閉じる ---
  hide() {
    this.clearTimers();
    if (this.overlay) {
      this.overlay.classList.add("hidden");
      this.stage.innerHTML = "";
    }
    if (this.onFinish) {
      this.onFinish();
      this.onFinish = null;
    }
  },

  clearTimers() {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
    this.effectTimers.forEach(t => clearTimeout(t));
    this.effectTimers = [];
  },
};
