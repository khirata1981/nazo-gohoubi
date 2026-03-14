// ========================================
// メインアプリケーション
// ========================================

const App = {
  screen: "select", // select | tracing | cleared | reward

  // クリア済み文字を管理（localStorageで永続化）
  clearedChars: new Set(),

  // 今回のセッションでクリアした文字数（ごほうびカウント用）
  sessionClears: 0,

  async init() {
    // クリア済みデータを読み込み
    this.loadProgress();

    // キャンバス初期化
    const canvas = document.getElementById("tracing-canvas");
    TracingCanvas.init(canvas);

    // ボタンイベント
    document.getElementById("btn-check").addEventListener("click", () => this.checkTracing());
    document.getElementById("btn-clear").addEventListener("click", () => this.clearCanvas());
    document.getElementById("btn-back").addEventListener("click", () => this.showSelectScreen());
    document.getElementById("btn-next").addEventListener("click", () => this.goNextChar());
    document.getElementById("btn-select").addEventListener("click", () => this.showSelectScreen());
    document.getElementById("btn-reward").addEventListener("click", () => this.playReward());
    document.getElementById("btn-close-video").addEventListener("click", () => YouTube.stop());

    // YouTube API 読み込み
    YouTube.loadAPI();

    // 文字選択画面を表示
    this.showSelectScreen();
  },

  // --- 進捗管理 ---
  loadProgress() {
    try {
      const saved = localStorage.getItem("nazo-gohoubi-cleared");
      if (saved) {
        this.clearedChars = new Set(JSON.parse(saved));
      }
    } catch (e) {
      this.clearedChars = new Set();
    }
  },

  saveProgress() {
    localStorage.setItem(
      "nazo-gohoubi-cleared",
      JSON.stringify([...this.clearedChars])
    );
  },

  // --- 文字選択画面 ---
  showSelectScreen() {
    this.screen = "select";
    document.getElementById("select-screen").classList.remove("hidden");
    document.getElementById("tracing-screen").classList.add("hidden");
    document.getElementById("clear-overlay").classList.add("hidden");
    document.getElementById("reward-overlay").classList.add("hidden");

    this.renderCharGrid();
    this.updateProgress();
  },

  renderCharGrid() {
    const grid = document.getElementById("char-grid");
    grid.innerHTML = "";

    const rows = Hiragana.getCharactersByRow();

    for (const [rowName, chars] of Object.entries(rows)) {
      // 行ラベル
      const label = document.createElement("div");
      label.className = "row-label";
      label.textContent = rowName;
      grid.appendChild(label);

      // 文字カード
      const cardRow = document.createElement("div");
      cardRow.className = "card-row";

      for (const char of chars) {
        const card = document.createElement("button");
        card.className = "char-card";
        if (this.clearedChars.has(char)) {
          card.classList.add("cleared");
        }

        const charText = document.createElement("span");
        charText.className = "char-text";
        charText.textContent = char;

        card.appendChild(charText);

        if (this.clearedChars.has(char)) {
          const star = document.createElement("span");
          star.className = "char-star";
          star.textContent = "★";
          card.appendChild(star);
        }

        card.addEventListener("click", () => this.selectChar(char));
        cardRow.appendChild(card);
      }

      grid.appendChild(cardRow);
    }
  },

  updateProgress() {
    const remaining = Settings.requiredClears - this.sessionClears;
    const progressText = document.getElementById("progress-text");

    if (remaining <= 0) {
      progressText.textContent = "🎬 ごほうび どうがが みられるよ！";
    } else {
      progressText.textContent = `あと ${remaining}もじ で ごほうび！`;
    }
  },

  // --- なぞり画面 ---
  selectChar(char) {
    Hiragana.setCurrent(char);
    this.showTracingScreen();
  },

  showTracingScreen() {
    this.screen = "tracing";
    document.getElementById("select-screen").classList.add("hidden");
    document.getElementById("tracing-screen").classList.remove("hidden");
    document.getElementById("clear-overlay").classList.add("hidden");
    document.getElementById("reward-overlay").classList.add("hidden");

    const msg = document.getElementById("message");
    msg.textContent = `「${Hiragana.current}」を ゆびで なぞってね！`;

    TracingCanvas.reset();
  },

  checkTracing() {
    const score = TracingCanvas.evaluate();
    if (score >= Settings.passThreshold) {
      this.onCharCleared();
    } else {
      const msg = document.getElementById("message");
      msg.textContent = "もうすこし なぞってみよう！";
      setTimeout(() => {
        if (this.screen === "tracing") {
          msg.textContent = `「${Hiragana.current}」を ゆびで なぞってね！`;
        }
      }, 2000);
    }
  },

  clearCanvas() {
    TracingCanvas.reset();
    const msg = document.getElementById("message");
    msg.textContent = `「${Hiragana.current}」を ゆびで なぞってね！`;
  },

  onCharCleared() {
    // まだクリアしていない文字なら、セッションクリア数を加算
    if (!this.clearedChars.has(Hiragana.current)) {
      this.sessionClears++;
    }

    this.clearedChars.add(Hiragana.current);
    this.saveProgress();

    // ごほうび条件を満たしたか
    if (this.sessionClears >= Settings.requiredClears) {
      this.showRewardScreen();
    } else {
      this.showClearOverlay();
    }
  },

  showClearOverlay() {
    this.screen = "cleared";
    document.getElementById("clear-overlay").classList.remove("hidden");
  },

  showRewardScreen() {
    this.screen = "reward";
    document.getElementById("clear-overlay").classList.add("hidden");
    document.getElementById("reward-overlay").classList.remove("hidden");
  },

  // 次の未クリア文字へ進む
  goNextChar() {
    const allChars = Hiragana.getAllCharacters();
    const currentIndex = allChars.indexOf(Hiragana.current);

    // 現在の文字の次から探す
    for (let i = 1; i <= allChars.length; i++) {
      const nextIndex = (currentIndex + i) % allChars.length;
      const nextChar = allChars[nextIndex];
      if (!this.clearedChars.has(nextChar)) {
        this.selectChar(nextChar);
        return;
      }
    }

    // 全部クリア済みなら選択画面へ
    this.showSelectScreen();
  },

  playReward() {
    document.getElementById("reward-overlay").classList.add("hidden");
    document.getElementById("tracing-screen").classList.add("hidden");
    YouTube.play("youtube-player");
  },

  onVideoClose() {
    // セッションクリア数をリセットして選択画面へ
    this.sessionClears = 0;
    this.showSelectScreen();
  },
};

// DOM 準備完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
