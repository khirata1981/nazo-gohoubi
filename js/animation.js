// ========================================
// ごほうびアニメーション
// ========================================

const RewardAnimation = {
  overlay: null,
  stage: null,
  titleEl: null,
  buttonsEl: null,
  animationTimer: null,
  effectTimers: [],

  // 5つのアニメーションパターン
  patterns: ["ouen", "banzai", "dance", "hanamaru", "kurukuru"],

  // --- DOM生成ヘルパー ---
  createBlockKun() {
    const el = document.createElement("div");
    el.className = "block-kun";
    el.innerHTML = `
      <div class="head">
        <div class="eye-left"></div>
        <div class="eye-right"></div>
        <div class="mouth"></div>
      </div>
      <div class="body"></div>
      <div class="arm-left"></div>
      <div class="arm-right"></div>
      <div class="leg-left"></div>
      <div class="leg-right"></div>
    `;
    return el;
  },

  createCubeChan() {
    const el = document.createElement("div");
    el.className = "cube-chan";
    el.innerHTML = `
      <div class="head">
        <div class="ribbon"></div>
        <div class="eye-left"></div>
        <div class="eye-right"></div>
        <div class="cheek-left"></div>
        <div class="cheek-right"></div>
        <div class="mouth"></div>
      </div>
      <div class="body"></div>
      <div class="arm-left"></div>
      <div class="arm-right"></div>
      <div class="leg-left"></div>
      <div class="leg-right"></div>
    `;
    return el;
  },

  createSpeechBubble(text) {
    const el = document.createElement("div");
    el.className = "speech-bubble";
    el.textContent = text;
    return el;
  },

  // --- メイン制御 ---
  play(onFinish) {
    this.onFinish = onFinish;
    const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
    this.showOverlay(pattern);
  },

  showOverlay(pattern) {
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
    this.titleEl.textContent = "★ よくできました！ ★";

    // パターン別に演出を実行
    this.stage.classList.add(`anim-${pattern}`);
    this[`play_${pattern}`]();

    // オーバーレイ表示
    this.overlay.classList.remove("hidden");

    // ボタンを表示（アニメーション終了後）
    this.animationTimer = setTimeout(() => {
      this.buttonsEl.classList.add("visible");
    }, 5500);
  },

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
    this.effectTimers.forEach((t) => clearTimeout(t));
    this.effectTimers = [];
  },

  getChildName() {
    return Settings.childName || "さくやくん";
  },

  // ========================================
  // パターン1: おうえん
  // ========================================
  play_ouen() {
    const blockKun = this.createBlockKun();
    const cubeChan = this.createCubeChan();
    const bubble = this.createSpeechBubble(`${this.getChildName()} すごいね！`);

    this.stage.appendChild(blockKun);
    this.stage.appendChild(cubeChan);
    this.stage.appendChild(bubble);

    // スライドイン完了後にジャンプ（位置を固定してからアニメ切り替え）
    this.effectTimers.push(setTimeout(() => {
      blockKun.style.left = "60px";
      blockKun.style.animation = "none";
      // リフローを強制してからジャンプアニメーション適用
      void blockKun.offsetHeight;
      blockKun.classList.add("jumping");
    }, 1000));

    this.effectTimers.push(setTimeout(() => {
      cubeChan.style.right = "60px";
      cubeChan.style.animation = "none";
      void cubeChan.offsetHeight;
      cubeChan.classList.add("jumping");
    }, 1300));

    // 1.5秒後に吹き出し表示
    this.effectTimers.push(setTimeout(() => {
      bubble.classList.add("show");
    }, 1500));

    // 2秒後に紙吹雪
    this.effectTimers.push(setTimeout(() => {
      this.spawnConfetti(20);
    }, 2000));
  },

  // ========================================
  // パターン2: ばんざい
  // ========================================
  play_banzai() {
    const blockKun = this.createBlockKun();
    const cubeChan = this.createCubeChan();
    const bubble = this.createSpeechBubble(`${this.getChildName()} やったね！`);

    this.stage.appendChild(blockKun);
    this.stage.appendChild(cubeChan);
    this.stage.appendChild(bubble);

    // popIn完了後にばんざい（popInはforwardsなので位置は維持される）
    // banzaiクラスは腕だけにアニメーションを追加するので親アニメーションとは衝突しない
    this.effectTimers.push(setTimeout(() => {
      blockKun.style.opacity = "1";
      blockKun.classList.add("banzai");
      cubeChan.style.opacity = "1";
      cubeChan.classList.add("banzai");
    }, 1000));

    // 1.5秒後に吹き出し
    this.effectTimers.push(setTimeout(() => {
      bubble.classList.add("show");
    }, 1500));

    // 2秒後に星エフェクト
    this.effectTimers.push(setTimeout(() => {
      this.spawnStars(12);
    }, 2000));

    // 3.5秒後にもう一回星
    this.effectTimers.push(setTimeout(() => {
      this.spawnStars(8);
    }, 3500));
  },

  // ========================================
  // パターン3: ダンス
  // ========================================
  play_dance() {
    const blockKun = this.createBlockKun();
    const cubeChan = this.createCubeChan();
    const bubble = this.createSpeechBubble(`${this.getChildName()} かっこいい！`);

    this.stage.appendChild(blockKun);
    this.stage.appendChild(cubeChan);
    this.stage.appendChild(bubble);

    // 2秒後にジャンプダンスに切り替え（位置を固定してから）
    this.effectTimers.push(setTimeout(() => {
      blockKun.style.left = "calc(50% - 140px)";
      blockKun.style.animation = "none";
      void blockKun.offsetHeight;
      blockKun.classList.add("jump-alt");

      cubeChan.style.right = "calc(50% - 140px)";
      cubeChan.style.animation = "none";
      void cubeChan.offsetHeight;
      cubeChan.classList.add("jump-alt");
    }, 2000));

    // 2.5秒後に吹き出し
    this.effectTimers.push(setTimeout(() => {
      bubble.classList.add("show");
    }, 2500));

    // 音符を定期的に出す
    for (let i = 0; i < 6; i++) {
      this.effectTimers.push(setTimeout(() => {
        this.spawnNote();
      }, 1500 + i * 700));
    }
  },

  // ========================================
  // パターン4: はなまる
  // ========================================
  play_hanamaru() {
    // SVGの花丸
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "hanamaru-svg");
    svg.setAttribute("viewBox", "0 0 180 180");

    // メインの丸
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("class", "hanamaru-circle");
    circle.setAttribute("cx", "90");
    circle.setAttribute("cy", "90");
    circle.setAttribute("r", "70");
    svg.appendChild(circle);

    // 花びら（6枚）
    const petalAngles = [0, 60, 120, 180, 240, 300];
    petalAngles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 90 + 68 * Math.cos(rad);
      const y1 = 90 + 68 * Math.sin(rad);
      const x2 = 90 + 88 * Math.cos(rad);
      const y2 = 90 + 88 * Math.sin(rad);

      const petal = document.createElementNS(svgNS, "line");
      petal.setAttribute("class", `hanamaru-petal petal-${i + 1}`);
      petal.setAttribute("x1", x1);
      petal.setAttribute("y1", y1);
      petal.setAttribute("x2", x2);
      petal.setAttribute("y2", y2);
      svg.appendChild(petal);
    });

    this.stage.appendChild(svg);

    const blockKun = this.createBlockKun();
    const cubeChan = this.createCubeChan();
    const bubble = this.createSpeechBubble(`${this.getChildName()} はなまる！`);

    this.stage.appendChild(blockKun);
    this.stage.appendChild(cubeChan);
    this.stage.appendChild(bubble);

    // 2.5秒後に拍手
    this.effectTimers.push(setTimeout(() => {
      blockKun.classList.add("clapping");
      cubeChan.classList.add("clapping");
    }, 2500));

    // 3秒後に吹き出し
    this.effectTimers.push(setTimeout(() => {
      bubble.classList.add("show");
    }, 3000));
  },

  // ========================================
  // パターン5: くるくる
  // ========================================
  play_kurukuru() {
    const rainbow = document.createElement("div");
    rainbow.className = "rainbow-arch";
    this.stage.appendChild(rainbow);

    const blockKun = this.createBlockKun();
    const cubeChan = this.createCubeChan();
    const bubble = this.createSpeechBubble(`${this.getChildName()} てんさい！`);

    this.stage.appendChild(blockKun);
    this.stage.appendChild(cubeChan);
    this.stage.appendChild(bubble);

    // スピンイン完了後にポーズ（位置を固定してから）
    this.effectTimers.push(setTimeout(() => {
      blockKun.style.left = "calc(50% - 130px)";
      blockKun.style.opacity = "1";
      blockKun.style.animation = "none";
      void blockKun.offsetHeight;
      blockKun.classList.add("pose");
    }, 1500));

    this.effectTimers.push(setTimeout(() => {
      cubeChan.style.right = "calc(50% - 130px)";
      cubeChan.style.opacity = "1";
      cubeChan.style.animation = "none";
      void cubeChan.offsetHeight;
      cubeChan.classList.add("pose");
    }, 1800));

    // 2秒後に吹き出し
    this.effectTimers.push(setTimeout(() => {
      bubble.classList.add("show");
    }, 2000));
  },

  // ========================================
  // エフェクト生成
  // ========================================
  spawnConfetti(count) {
    const colors = ["#FF6B6B", "#FFD93D", "#74C0FC", "#77DD77", "#FFB347", "#FF9FF3"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "anim-confetti";
      piece.style.left = `${10 + Math.random() * 80}%`;
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = piece.style.width;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 1}s`;
      piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      this.stage.appendChild(piece);
    }
  },

  spawnStars(count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star-effect";
      star.textContent = "★";
      star.style.left = `${10 + Math.random() * 80}%`;
      star.style.top = `${30 + Math.random() * 50}%`;
      star.style.animationDelay = `${Math.random() * 0.8}s`;
      star.style.color = Math.random() > 0.5 ? "#FFD93D" : "#FFB347";
      this.stage.appendChild(star);
    }
  },

  spawnNote() {
    const notes = ["♪", "♫", "♬"];
    const note = document.createElement("div");
    note.className = "note-effect";
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.left = `${20 + Math.random() * 60}%`;
    note.style.top = `${40 + Math.random() * 40}%`;
    note.style.color = ["#FF6B6B", "#74C0FC", "#FFD93D", "#77DD77"][Math.floor(Math.random() * 4)];
    this.stage.appendChild(note);
  },
};
