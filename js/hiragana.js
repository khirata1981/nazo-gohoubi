// ========================================
// ひらがなデータ
// ========================================

const Hiragana = {
  // 現在の文字
  current: "あ",

  // 文字データ（あ行・か行）
  // requiredAreas: 必須エリア（ストロークが通るべき矩形）
  // minAreasRequired: クリアに必要な通過エリア数
  // minStrokeLengthRatio: 合計ストローク長 >= canvasSize × この値
  characters: {
    "あ": {
      char: "あ", strokeCount: 3, row: "あぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 240, h: 80, label: "横棒" },
        { x: 140, y: 80, w: 80, h: 200, label: "縦棒" },
        { x: 80, y: 200, w: 240, h: 160, label: "下の丸" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.5,
    },
    "い": {
      char: "い", strokeCount: 2, row: "あぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 120, h: 300, label: "左の線" },
        { x: 220, y: 40, w: 140, h: 320, label: "右の線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 1.0,
    },
    "う": {
      char: "う", strokeCount: 2, row: "あぎょう",
      requiredAreas: [
        { x: 140, y: 20, w: 100, h: 60, label: "上の点" },
        { x: 80, y: 100, w: 240, h: 260, label: "下の曲線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 1.0,
    },
    "え": {
      char: "え", strokeCount: 2, row: "あぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 240, h: 100, label: "上部" },
        { x: 60, y: 160, w: 280, h: 200, label: "下部" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 1.0,
    },
    "お": {
      char: "お", strokeCount: 3, row: "あぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 200, h: 80, label: "横棒" },
        { x: 120, y: 80, w: 80, h: 240, label: "縦棒" },
        { x: 100, y: 200, w: 200, h: 160, label: "下の丸" },
        { x: 260, y: 40, w: 100, h: 100, label: "右上の点" },
      ],
      minAreasRequired: 4,
      minStrokeLengthRatio: 1.5,
    },
    "か": {
      char: "か", strokeCount: 3, row: "かぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 160, h: 100, label: "左上" },
        { x: 60, y: 160, w: 160, h: 200, label: "左下" },
        { x: 240, y: 60, w: 120, h: 300, label: "右の線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "き": {
      char: "き", strokeCount: 4, row: "かぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 100, label: "上の横棒" },
        { x: 60, y: 140, w: 280, h: 100, label: "下の横棒" },
        { x: 100, y: 260, w: 200, h: 120, label: "下の曲線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "く": {
      char: "く", strokeCount: 1, row: "かぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 200, h: 180, label: "上半分" },
        { x: 80, y: 200, w: 200, h: 180, label: "下半分" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },
    "け": {
      char: "け", strokeCount: 3, row: "かぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 140, y: 40, w: 120, h: 160, label: "中央上" },
        { x: 240, y: 40, w: 120, h: 320, label: "右の線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "こ": {
      char: "こ", strokeCount: 2, row: "かぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 240, h: 120, label: "上の横棒" },
        { x: 80, y: 240, w: 240, h: 120, label: "下の横棒" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
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

};
