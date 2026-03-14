// ========================================
// メインアプリケーション
// ========================================

const App = {
  state: "tracing", // tracing | cleared | reward

  async init() {
    // キャンバス初期化
    const canvas = document.getElementById("tracing-canvas");
    TracingCanvas.init(canvas);

    // ボタンイベント
    document.getElementById("btn-check").addEventListener("click", () => this.checkTracing());
    document.getElementById("btn-clear").addEventListener("click", () => this.clearCanvas());
    document.getElementById("btn-reward").addEventListener("click", () => this.playReward());
    document.getElementById("btn-retry").addEventListener("click", () => this.retry());
    document.getElementById("btn-close-video").addEventListener("click", () => YouTube.stop());

    // YouTube API 読み込み
    YouTube.loadAPI();

    this.setState("tracing");
  },

  setState(newState) {
    this.state = newState;
    const msg = document.getElementById("message");
    const btnCheck = document.getElementById("btn-check");
    const btnClear = document.getElementById("btn-clear");
    const btnReward = document.getElementById("btn-reward");
    const btnRetry = document.getElementById("btn-retry");
    const clearOverlay = document.getElementById("clear-overlay");

    switch (newState) {
      case "tracing":
        msg.textContent = "「あ」を ゆびで なぞってね！";
        btnCheck.classList.remove("hidden");
        btnClear.classList.remove("hidden");
        btnReward.classList.add("hidden");
        btnRetry.classList.add("hidden");
        clearOverlay.classList.add("hidden");
        break;

      case "cleared":
        msg.textContent = "";
        btnCheck.classList.add("hidden");
        btnClear.classList.add("hidden");
        btnReward.classList.remove("hidden");
        btnRetry.classList.remove("hidden");
        clearOverlay.classList.remove("hidden");
        break;

      case "reward":
        clearOverlay.classList.add("hidden");
        break;
    }
  },

  checkTracing() {
    const score = TracingCanvas.evaluate();
    if (score >= Settings.passThreshold) {
      this.setState("cleared");
    } else {
      // 不合格でも励ましメッセージ
      const msg = document.getElementById("message");
      msg.textContent = "もうすこし なぞってみよう！";
      setTimeout(() => {
        if (this.state === "tracing") {
          msg.textContent = "「あ」を ゆびで なぞってね！";
        }
      }, 2000);
    }
  },

  clearCanvas() {
    TracingCanvas.reset();
    this.setState("tracing");
  },

  playReward() {
    this.setState("reward");
    YouTube.play("youtube-player");
  },

  retry() {
    TracingCanvas.reset();
    this.setState("tracing");
  },

  onVideoClose() {
    TracingCanvas.reset();
    this.setState("tracing");
  },
};

// DOM 準備完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
