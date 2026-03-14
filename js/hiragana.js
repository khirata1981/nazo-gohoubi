// ========================================
// ひらがなデータ
// ========================================

const Hiragana = {
  // 現在の文字
  current: "あ",

  // 文字データ（あ行・か行）
  characters: {
    "あ": { char: "あ", strokeCount: 3, row: "あぎょう" },
    "い": { char: "い", strokeCount: 2, row: "あぎょう" },
    "う": { char: "う", strokeCount: 2, row: "あぎょう" },
    "え": { char: "え", strokeCount: 2, row: "あぎょう" },
    "お": { char: "お", strokeCount: 3, row: "あぎょう" },
    "か": { char: "か", strokeCount: 3, row: "かぎょう" },
    "き": { char: "き", strokeCount: 4, row: "かぎょう" },
    "く": { char: "く", strokeCount: 1, row: "かぎょう" },
    "け": { char: "け", strokeCount: 3, row: "かぎょう" },
    "こ": { char: "こ", strokeCount: 2, row: "かぎょう" },
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

  // お手本をキャンバスに描画
  drawGuide(ctx, size) {
    ctx.save();
    ctx.font = `${Settings.guideFontSize}px "${Settings.guideFont}"`;
    ctx.fillStyle = Settings.guideColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.current, size / 2, size / 2 + 10);
    ctx.restore();
  },

  // お手本文字のピクセルマスクを生成
  createGuideMask(size) {
    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext("2d");

    ctx.font = `${Settings.guideFontSize}px "${Settings.guideFont}"`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.current, size / 2, size / 2 + 10);

    return ctx.getImageData(0, 0, size, size);
  },
};
