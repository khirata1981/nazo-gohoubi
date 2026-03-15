// ========================================
// メインアプリケーション
// ========================================

const App = {
  screen: "select", // select | tracing | cleared | reward

  // クリア済み文字を管理（localStorageで永続化）
  clearedChars: new Set(),

  // 今回のセッションでクリアした文字数（ごほうびカウント用）
  sessionClears: 0,

  // ほめ言葉リスト
  praiseWords: [
    "すごい！",
    "やったね！",
    "じょうず！",
    "ばっちり！",
    "すばらしい！",
    "かっこいい！",
    "きれいにかけたね！",
    "がんばったね！",
    "さいこう！",
    "おみごと！",
  ],

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
    document.getElementById("btn-anim-next").addEventListener("click", () => { RewardAnimation.hide(); this.goNextChar(); });
    document.getElementById("btn-anim-select").addEventListener("click", () => { RewardAnimation.hide(); this.showSelectScreen(); });
    document.getElementById("btn-close-video").addEventListener("click", () => YouTube.stop());
    document.getElementById("btn-limit-ok").addEventListener("click", () => this.showSelectScreen());

    // ずかんボタン
    document.getElementById("btn-zukan").addEventListener("click", () => Zukan.renderZukanScreen());
    document.getElementById("btn-zukan-close").addEventListener("click", () => Zukan.hideZukanScreen());

    // 設定ボタン
    document.getElementById("btn-settings").addEventListener("click", () => SettingsUI.showPasscode());

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
    document.getElementById("limit-overlay").classList.add("hidden");
    document.getElementById("animation-overlay").classList.add("hidden");

    this.renderCharGrid();
    this.updateProgress();
    this.updateZukanButton();
  },

  updateZukanButton() {
    const p = Zukan.getProgress();
    const el = document.getElementById("zukan-btn-progress");
    if (el) {
      el.textContent = `(${p.collected}/${p.total})`;
    }
  },

  renderCharGrid() {
    const grid = document.getElementById("char-grid");
    grid.innerHTML = "";

    const rows = Hiragana.getEnabledCharactersByRow();

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
      progressText.textContent = "🎉 ごほうびが もらえるよ！";
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
    TracingCanvas.updateDisplaySize();
  },

  checkTracing() {
    const result = TracingCanvas.evaluate();
    if (result.pass) {
      this.onCharCleared();
    } else {
      const msg = document.getElementById("message");
      if (result.reason === "tooShort") {
        msg.textContent = "もっと たくさん なぞってみよう！";
      } else if (result.reason === "outOfBounds") {
        msg.textContent = "おてほんの うえを なぞってね！";
      } else {
        msg.textContent = "もうすこし なぞってみよう！";
      }
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
      this.playAnimation();
    } else {
      this.showClearOverlay();
    }
  },

  showClearOverlay() {
    this.screen = "cleared";
    // ほめ言葉をランダムに設定
    const praise = this.praiseWords[Math.floor(Math.random() * this.praiseWords.length)];
    document.querySelector(".clear-text").textContent = `⭐ ${praise} ⭐`;
    document.getElementById("clear-overlay").classList.remove("hidden");
    // 紙吹雪を表示
    this.showConfetti(30);
  },

  showRewardScreen() {
    this.screen = "reward";
    document.getElementById("clear-overlay").classList.add("hidden");

    const rewardType = Settings.rewardType;

    if (rewardType === "animation") {
      // アニメーションのみ
      this.playAnimation();
    } else if (rewardType === "youtube") {
      // YouTube動画のみ
      document.getElementById("reward-overlay").classList.remove("hidden");
      this.showConfetti(60);
    } else {
      // "both": 50%の確率でどちらか
      if (Math.random() < 0.5) {
        this.playAnimation();
      } else {
        document.getElementById("reward-overlay").classList.remove("hidden");
        this.showConfetti(60);
      }
    }
  },

  playAnimation() {
    this.sessionClears = 0;
    document.getElementById("tracing-screen").classList.add("hidden");
    RewardAnimation.play(() => {
      // アニメーション終了時のコールバック（ボタンで制御するので空）
    });
  },

  showLimitScreen() {
    this.screen = "limit";
    document.getElementById("clear-overlay").classList.add("hidden");
    document.getElementById("tracing-screen").classList.add("hidden");
    document.getElementById("limit-overlay").classList.remove("hidden");
  },

  // 紙吹雪エフェクト（CSSアニメーションのみ）
  showConfetti(count) {
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    const colors = ["#FF6B6B", "#FFD93D", "#74C0FC", "#77DD77", "#FFB347", "#FF9FF3", "#A29BFE"];
    const shapes = ["circle", "square", "star"];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      piece.className = `confetti ${shape}`;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(piece);
    }

    // 4秒後に紙吹雪を削除
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 4500);
  },

  // 次の未クリア文字へ進む
  goNextChar() {
    const allChars = Hiragana.getEnabledCharacters();
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
    Settings.recordVideoPlay();
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

// ========================================
// 設定UI管理
// ========================================

const SettingsUI = {
  passcodeInput: "",
  testPlayer: null,

  // --- パスコード画面 ---
  showPasscode() {
    this.passcodeInput = "";
    this.updateDots();
    document.getElementById("passcode-error").textContent = "";
    document.getElementById("passcode-screen").classList.remove("hidden");
    this.bindNumpad();
  },

  hidePasscode() {
    document.getElementById("passcode-screen").classList.add("hidden");
    this.unbindNumpad();
  },

  bindNumpad() {
    // イベントハンドラを保存して後で解除できるようにする
    this._numpadHandler = (e) => {
      const btn = e.target.closest(".numpad-btn");
      if (!btn) return;

      const num = btn.dataset.num;
      const action = btn.dataset.action;

      if (num !== undefined) {
        if (this.passcodeInput.length < 4) {
          this.passcodeInput += num;
          this.updateDots();

          if (this.passcodeInput.length === 4) {
            setTimeout(() => this.verifyPasscode(), 200);
          }
        }
      } else if (action === "delete") {
        this.passcodeInput = this.passcodeInput.slice(0, -1);
        this.updateDots();
      } else if (action === "cancel") {
        this.hidePasscode();
      }
    };

    document.querySelector(".numpad").addEventListener("click", this._numpadHandler);
  },

  unbindNumpad() {
    if (this._numpadHandler) {
      document.querySelector(".numpad").removeEventListener("click", this._numpadHandler);
      this._numpadHandler = null;
    }
  },

  updateDots() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      dot.classList.toggle("filled", i < this.passcodeInput.length);
    }
  },

  verifyPasscode() {
    if (Settings.verifyPasscode(this.passcodeInput)) {
      this.hidePasscode();
      this.showSettings();
    } else {
      document.getElementById("passcode-error").textContent = "パスコードが違います";
      this.passcodeInput = "";
      this.updateDots();
    }
  },

  // --- 設定画面 ---
  showSettings() {
    this.renderChildName();
    this.renderRewardType();
    this.renderRowCheckboxes();
    this.renderSelects();
    this.renderVideoList();
    this.clearPasscodeChangeForm();

    document.getElementById("settings-screen").classList.remove("hidden");
    this.bindSettingsEvents();
  },

  hideSettings() {
    document.getElementById("settings-screen").classList.add("hidden");
    this.unbindSettingsEvents();
  },

  bindSettingsEvents() {
    this._settingsHandlers = {};

    // 閉じるボタン
    const closeBtn = document.getElementById("btn-settings-close");
    this._settingsHandlers.close = () => this.hideSettings();
    closeBtn.addEventListener("click", this._settingsHandlers.close);

    // 保存ボタン
    const saveBtn = document.getElementById("btn-save-settings");
    this._settingsHandlers.save = () => this.saveAndClose();
    saveBtn.addEventListener("click", this._settingsHandlers.save);

    // 動画追加ボタン
    const addBtn = document.getElementById("btn-add-video");
    this._settingsHandlers.addVideo = () => this.addVideo();
    addBtn.addEventListener("click", this._settingsHandlers.addVideo);

    // パスコード変更ボタン
    const changeBtn = document.getElementById("btn-change-passcode");
    this._settingsHandlers.changePasscode = () => this.changePasscode();
    changeBtn.addEventListener("click", this._settingsHandlers.changePasscode);

    // テスト動画閉じるボタン
    const closeTestBtn = document.getElementById("btn-close-test-video");
    this._settingsHandlers.closeTest = () => this.closeTestVideo();
    closeTestBtn.addEventListener("click", this._settingsHandlers.closeTest);

    // リセットボタン
    const resetBtn = document.getElementById("btn-reset-progress");
    this._settingsHandlers.reset = () => this.resetProgress();
    resetBtn.addEventListener("click", this._settingsHandlers.reset);
  },

  unbindSettingsEvents() {
    if (!this._settingsHandlers) return;

    document.getElementById("btn-settings-close").removeEventListener("click", this._settingsHandlers.close);
    document.getElementById("btn-save-settings").removeEventListener("click", this._settingsHandlers.save);
    document.getElementById("btn-add-video").removeEventListener("click", this._settingsHandlers.addVideo);
    document.getElementById("btn-change-passcode").removeEventListener("click", this._settingsHandlers.changePasscode);
    document.getElementById("btn-close-test-video").removeEventListener("click", this._settingsHandlers.closeTest);
    document.getElementById("btn-reset-progress").removeEventListener("click", this._settingsHandlers.reset);
    this._settingsHandlers = null;
  },

  // --- おこさまの名前 ---
  renderChildName() {
    document.getElementById("child-name").value = Settings.childName;
  },

  // --- ごほうびの種類 ---
  renderRewardType() {
    document.getElementById("reward-type").value = Settings.rewardType;
  },

  // --- 行チェックボックス ---
  renderRowCheckboxes() {
    const container = document.getElementById("row-checkboxes");
    container.innerHTML = "";

    const allRows = Settings.getAllRows();
    for (const row of allRows) {
      const label = document.createElement("label");
      label.className = "row-checkbox-label";
      if (Settings.isRowEnabled(row.id)) {
        label.classList.add("checked");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Settings.isRowEnabled(row.id);
      checkbox.dataset.rowId = row.id;

      checkbox.addEventListener("change", () => {
        label.classList.toggle("checked", checkbox.checked);
      });

      const text = document.createTextNode(row.label);
      label.appendChild(checkbox);
      label.appendChild(text);
      container.appendChild(label);
    }
  },

  // --- セレクトボックス ---
  renderSelects() {
    // クリア条件
    const requiredSelect = document.getElementById("required-clears");
    requiredSelect.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      if (i === Settings.requiredClears) opt.selected = true;
      requiredSelect.appendChild(opt);
    }

    // 動画上限
    const limitSelect = document.getElementById("daily-limit");
    limitSelect.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      if (i === Settings.dailyVideoLimit) opt.selected = true;
      limitSelect.appendChild(opt);
    }
  },

  // --- 動画リスト ---
  renderVideoList() {
    const container = document.getElementById("video-list");
    container.innerHTML = "";

    if (Settings.videoList.length === 0) {
      container.innerHTML = '<p style="color: #999; text-align: center;">動画が登録されていません</p>';
      return;
    }

    Settings.videoList.forEach((video, index) => {
      const item = document.createElement("div");
      item.className = "video-item";

      const info = document.createElement("div");
      info.className = "video-item-info";

      const title = document.createElement("div");
      title.className = "video-item-title";
      title.textContent = video.title;

      const id = document.createElement("div");
      id.className = "video-item-id";
      id.textContent = video.id;

      info.appendChild(title);
      info.appendChild(id);

      const actions = document.createElement("div");
      actions.className = "video-item-actions";

      const testBtn = document.createElement("button");
      testBtn.className = "btn-video-action btn-video-test";
      testBtn.textContent = "▶ テスト";
      testBtn.addEventListener("click", () => this.testPlayVideo(video.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-video-action btn-video-delete";
      deleteBtn.textContent = "削除";
      // 最後の1本は削除不可
      if (Settings.videoList.length <= 1) {
        deleteBtn.disabled = true;
        deleteBtn.style.opacity = "0.4";
        deleteBtn.style.cursor = "not-allowed";
      } else {
        deleteBtn.addEventListener("click", () => this.deleteVideo(index));
      }

      actions.appendChild(testBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);
      container.appendChild(item);
    });
  },

  // --- 動画追加 ---
  addVideo() {
    const urlInput = document.getElementById("video-url");
    const titleInput = document.getElementById("video-title");
    const url = urlInput.value.trim();
    const title = titleInput.value.trim();

    if (!url) {
      alert("YouTube URLを入力してください");
      return;
    }

    const videoId = Settings.extractVideoId(url);
    if (!videoId) {
      alert("有効なYouTube URLを入力してください");
      return;
    }

    const videoTitle = title || `動画 ${Settings.videoList.length + 1}`;
    Settings.videoList.push({ id: videoId, title: videoTitle });
    Settings.save();

    urlInput.value = "";
    titleInput.value = "";
    this.renderVideoList();
  },

  // --- 動画削除 ---
  deleteVideo(index) {
    if (Settings.videoList.length <= 1) {
      alert("最低1本は登録が必要です");
      return;
    }
    Settings.videoList.splice(index, 1);
    Settings.save();
    this.renderVideoList();
  },

  // --- テスト再生 ---
  testPlayVideo(videoId) {
    const area = document.getElementById("test-video-area");
    area.classList.remove("hidden");

    if (this.testPlayer) {
      this.testPlayer.destroy();
      this.testPlayer = null;
    }

    // プレイヤーdivを再作成
    let playerDiv = document.getElementById("test-youtube-player");
    if (!playerDiv) {
      playerDiv = document.createElement("div");
      playerDiv.id = "test-youtube-player";
      area.insertBefore(playerDiv, area.querySelector(".close-btn"));
    }

    if (window.YT && window.YT.Player) {
      this.testPlayer = new YT.Player("test-youtube-player", {
        videoId: videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
      });
    } else {
      alert("YouTube APIが読み込まれていません。少し待ってからお試しください。");
      area.classList.add("hidden");
    }
  },

  closeTestVideo() {
    if (this.testPlayer) {
      this.testPlayer.destroy();
      this.testPlayer = null;
    }
    const area = document.getElementById("test-video-area");
    area.classList.add("hidden");

    // プレイヤーdivを再作成
    const existing = document.getElementById("test-youtube-player");
    if (!existing) {
      const div = document.createElement("div");
      div.id = "test-youtube-player";
      area.insertBefore(div, area.querySelector(".close-btn"));
    }
  },

  // --- パスコード変更 ---
  changePasscode() {
    const currentInput = document.getElementById("current-passcode");
    const newInput = document.getElementById("new-passcode");
    const msg = document.getElementById("passcode-change-msg");

    const current = currentInput.value;
    const newCode = newInput.value;

    if (!Settings.verifyPasscode(current)) {
      msg.textContent = "現在のパスコードが正しくありません";
      msg.className = "passcode-change-msg error";
      return;
    }

    if (!/^\d{4}$/.test(newCode)) {
      msg.textContent = "新しいパスコードは4桁の数字で入力してください";
      msg.className = "passcode-change-msg error";
      return;
    }

    Settings.passcode = newCode;
    Settings.save();
    msg.textContent = "パスコードを変更しました";
    msg.className = "passcode-change-msg success";
    currentInput.value = "";
    newInput.value = "";
  },

  clearPasscodeChangeForm() {
    document.getElementById("current-passcode").value = "";
    document.getElementById("new-passcode").value = "";
    document.getElementById("passcode-change-msg").textContent = "";
    document.getElementById("passcode-change-msg").className = "passcode-change-msg";
  },

  // --- 学習データリセット ---
  resetProgress() {
    if (!confirm("すべてのクリアきろくをけします。よろしいですか？")) {
      return;
    }

    // クリア済み文字をリセット
    App.clearedChars.clear();
    App.sessionClears = 0;
    localStorage.removeItem("nazo-gohoubi-cleared");

    // ずかんデータをリセット
    Zukan.reset();

    // 今日の動画再生回数をリセット
    Settings.todayVideoCount = 0;
    Settings.lastPlayDate = "";
    Settings.save();

    // 設定画面を閉じて文字選択画面に戻る
    this.hideSettings();
    App.showSelectScreen();
  },

  // --- 保存して閉じる ---
  saveAndClose() {
    // 行チェックボックスの状態を反映
    const checkboxes = document.querySelectorAll("#row-checkboxes input[type='checkbox']");
    let enabledCount = 0;
    checkboxes.forEach((cb) => {
      if (cb.checked) enabledCount++;
    });

    if (enabledCount === 0) {
      alert("最低1つの行を選択してください");
      return;
    }

    checkboxes.forEach((cb) => {
      Settings.enabledRows[cb.dataset.rowId] = cb.checked;
    });

    // おこさまの名前
    const childName = document.getElementById("child-name").value.trim();
    Settings.childName = childName || "さくやくん";

    // ごほうびの種類
    Settings.rewardType = document.getElementById("reward-type").value;

    // クリア条件
    Settings.requiredClears = parseInt(document.getElementById("required-clears").value, 10);

    // 動画上限
    Settings.dailyVideoLimit = parseInt(document.getElementById("daily-limit").value, 10);

    // 保存
    Settings.save();

    // 設定画面を閉じる
    this.hideSettings();

    // 文字選択画面を再描画
    App.showSelectScreen();
  },
};

// DOM 準備完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
