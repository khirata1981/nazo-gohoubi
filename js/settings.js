// ========================================
// 設定管理（localStorage永続化）
// ========================================

const Settings = {
  // --- 固定値（UIから変更しない） ---
  canvasSize: 400,
  guideFont: "Hiragino Maru Gothic ProN",
  guideFontSize: 320,
  guideColor: "rgba(200, 200, 200, 0.5)",
  guideStrokeWidth: 25,        // お手本・マスクの線幅（strokeText用）
  strokeColor: "#FF6B6B",
  strokeWidth: 28,
  gridSize: 4,                 // なぞり判定のグリッド分割数（4×4=16マス）
  defaultMinCoverRatio: 0.6,   // ゾーンカバー率の合格ライン（文字個別設定がない場合）
  minZoneDensity: 0.10,        // セル内のガイドピクセル密度がこの値以上でゾーンと認識
  minStrokeLengthRatio: 0.75,  // 合計ストローク長 >= canvasSize × この値（タップ防止）
  maxOutOfBoundsRatio: 0.5,    // はみ出し率がこの値以上なら不合格

  // --- 動的設定値（localStorageで保存） ---
  // パスコード
  passcode: "0000",

  // 有効な行（キー: 行ID, 値: boolean）
  enabledRows: {
    "あぎょう": true,
    "かぎょう": true,
  },

  // クリア条件（何文字なぞったら動画1回）
  requiredClears: 3,

  // 1日の動画上限
  dailyVideoLimit: 3,

  // 今日の動画再生回数
  todayVideoCount: 0,
  lastPlayDate: "",

  // ごほうび動画リスト
  videoList: [
    { id: "ptNx7MUtOJQ", title: "サンプル動画" },
  ],

  // 後方互換: 最初の動画IDを返す
  get youtubeVideoId() {
    if (this.videoList.length > 0) {
      return this.videoList[0].id;
    }
    return "ptNx7MUtOJQ";
  },

  // ストレージキー
  STORAGE_KEY: "nazo-gohoubi-settings",

  // --- 初期化 ---
  init() {
    this.load();
    this.checkDateReset();
  },

  // --- ロード ---
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);

      if (data.passcode) this.passcode = data.passcode;
      if (data.enabledRows) this.enabledRows = data.enabledRows;
      if (typeof data.requiredClears === "number") this.requiredClears = data.requiredClears;
      if (typeof data.dailyVideoLimit === "number") this.dailyVideoLimit = data.dailyVideoLimit;
      if (typeof data.todayVideoCount === "number") this.todayVideoCount = data.todayVideoCount;
      if (data.lastPlayDate) this.lastPlayDate = data.lastPlayDate;
      if (Array.isArray(data.videoList) && data.videoList.length > 0) {
        this.videoList = data.videoList;
      }
    } catch (e) {
      console.warn("設定の読み込みに失敗:", e);
    }
  },

  // --- セーブ ---
  save() {
    const data = {
      passcode: this.passcode,
      enabledRows: this.enabledRows,
      requiredClears: this.requiredClears,
      dailyVideoLimit: this.dailyVideoLimit,
      todayVideoCount: this.todayVideoCount,
      lastPlayDate: this.lastPlayDate,
      videoList: this.videoList,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // --- 日付リセット ---
  checkDateReset() {
    const today = new Date().toDateString();
    if (this.lastPlayDate !== today) {
      this.todayVideoCount = 0;
      this.lastPlayDate = today;
      this.save();
    }
  },

  // --- 動画再生可能か ---
  canPlayVideo() {
    this.checkDateReset();
    return this.todayVideoCount < this.dailyVideoLimit;
  },

  // --- 動画再生回数を記録 ---
  recordVideoPlay() {
    this.checkDateReset();
    this.todayVideoCount++;
    this.save();
  },

  // --- ランダムな動画IDを返す ---
  getRandomVideoId() {
    if (this.videoList.length === 0) return "ptNx7MUtOJQ";
    const idx = Math.floor(Math.random() * this.videoList.length);
    return this.videoList[idx].id;
  },

  // --- YouTubeのURLから動画IDを抽出 ---
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  },

  // --- パスコード検証 ---
  verifyPasscode(input) {
    return input === this.passcode;
  },

  // --- 利用可能な全行リスト ---
  getAllRows() {
    return [
      { id: "あぎょう", label: "あ行" },
      { id: "かぎょう", label: "か行" },
      // 将来の追加用
      // { id: "さぎょう", label: "さ行" },
      // { id: "たぎょう", label: "た行" },
    ];
  },

  // --- 行が有効かどうか ---
  isRowEnabled(rowId) {
    return this.enabledRows[rowId] === true;
  },
};

// 起動時にロード
Settings.init();
