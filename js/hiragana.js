// ========================================
// ひらがなデータ
// ========================================

const Hiragana = {
  // 現在の文字
  current: "あ",

  // 文字データ（あ行・か行）
  // minCoverRatio: ゾーンカバー率の合格ライン（省略時は Settings.defaultMinCoverRatio）
  characters: {
    "あ": { char: "あ", strokeCount: 3, row: "あぎょう", minCoverRatio: 0.5 },
    "い": { char: "い", strokeCount: 2, row: "あぎょう", minCoverRatio: 0.45 },
    "う": { char: "う", strokeCount: 2, row: "あぎょう", minCoverRatio: 0.5 },
    "え": { char: "え", strokeCount: 2, row: "あぎょう", minCoverRatio: 0.5 },
    "お": { char: "お", strokeCount: 3, row: "あぎょう", minCoverRatio: 0.5 },
    "か": { char: "か", strokeCount: 3, row: "かぎょう", minCoverRatio: 0.5 },
    "き": { char: "き", strokeCount: 4, row: "かぎょう", minCoverRatio: 0.45 },
    "く": { char: "く", strokeCount: 1, row: "かぎょう", minCoverRatio: 0.45 },
    "け": { char: "け", strokeCount: 3, row: "かぎょう", minCoverRatio: 0.5 },
    "こ": { char: "こ", strokeCount: 2, row: "かぎょう", minCoverRatio: 0.5 },
  },

  // 利用可能な全文字を配列で返す
  getAllCharacters() {
    return Object.keys(this.characters);
  },

  // 有効な行の文字のみ返す
  getEnabledCharacters() {
    return Object.entries(this.characters)
      .filter(([, data]) => Settings.isRowEnabled(data.row))
      .map(([char]) => char);
  },

  // 行ごとにグループ化して返す
  getCharactersByRow() {
    const rows = {};
    for (const [char, data] of Object.entries(this.characters)) {
      if (!rows[data.row]) {
        rows[data.row] = [];
      }
      rows[data.row].push(char);
    }
    return rows;
  },

  // 有効な行のみグループ化して返す
  getEnabledCharactersByRow() {
    const rows = {};
    for (const [char, data] of Object.entries(this.characters)) {
      if (!Settings.isRowEnabled(data.row)) continue;
      if (!rows[data.row]) {
        rows[data.row] = [];
      }
      rows[data.row].push(char);
    }
    return rows;
  },

  // 現在の文字を設定
  setCurrent(char) {
    if (this.characters[char]) {
      this.current = char;
    }
  },

  // お手本をキャンバスに描画（strokeTextで線の輪郭のみ）
  drawGuide(ctx, size) {
    ctx.save();
    ctx.font = `${Settings.guideFontSize}px "${Settings.guideFont}"`;
    ctx.strokeStyle = Settings.guideColor;
    ctx.lineWidth = Settings.guideStrokeWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(this.current, size / 2, size / 2 + 10);
    ctx.restore();
  },

  // お手本文字のピクセルマスクを生成（strokeTextで線の部分だけ）
  createGuideMask(size) {
    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext("2d");

    ctx.font = `${Settings.guideFontSize}px "${Settings.guideFont}"`;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = Settings.maskStrokeWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(this.current, size / 2, size / 2 + 10);

    return ctx.getImageData(0, 0, size, size);
  },
};
