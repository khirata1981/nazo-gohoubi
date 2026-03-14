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

    // --- さ行 ---
    "さ": {
      char: "さ", strokeCount: 3, row: "さぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 80, label: "上の横棒" },
        { x: 60, y: 120, w: 280, h: 80, label: "下の横棒" },
        { x: 100, y: 220, w: 200, h: 160, label: "下のカーブ" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "し": {
      char: "し", strokeCount: 1, row: "さぎょう",
      requiredAreas: [
        { x: 100, y: 40, w: 120, h: 200, label: "縦の部分" },
        { x: 120, y: 220, w: 220, h: 140, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },
    "す": {
      char: "す", strokeCount: 2, row: "さぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 100, label: "横棒" },
        { x: 100, y: 120, w: 200, h: 260, label: "縦とカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 1.0,
    },
    "せ": {
      char: "せ", strokeCount: 3, row: "さぎょう",
      requiredAreas: [
        { x: 40, y: 60, w: 100, h: 280, label: "左の縦線" },
        { x: 60, y: 80, w: 280, h: 100, label: "横棒" },
        { x: 180, y: 180, w: 180, h: 180, label: "右の曲線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "そ": {
      char: "そ", strokeCount: 1, row: "さぎょう",
      requiredAreas: [
        { x: 80, y: 40, w: 240, h: 160, label: "上部" },
        { x: 60, y: 200, w: 280, h: 160, label: "下部" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },

    // --- た行 ---
    "た": {
      char: "た", strokeCount: 4, row: "たぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 160, h: 100, label: "左上の横棒" },
        { x: 40, y: 120, w: 160, h: 240, label: "左の縦棒" },
        { x: 220, y: 60, w: 140, h: 300, label: "右の線と点" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "ち": {
      char: "ち", strokeCount: 2, row: "たぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 120, label: "横棒" },
        { x: 80, y: 140, w: 240, h: 220, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "つ": {
      char: "つ", strokeCount: 1, row: "たぎょう",
      requiredAreas: [
        { x: 60, y: 60, w: 280, h: 160, label: "上部" },
        { x: 100, y: 200, w: 240, h: 160, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.5,
    },
    "て": {
      char: "て", strokeCount: 1, row: "たぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 140, label: "上の横棒" },
        { x: 60, y: 180, w: 200, h: 180, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },
    "と": {
      char: "と", strokeCount: 2, row: "たぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 140, h: 320, label: "縦の線" },
        { x: 140, y: 120, w: 200, h: 180, label: "右のはね" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },

    // --- な行 ---
    "な": {
      char: "な", strokeCount: 4, row: "なぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 160, h: 100, label: "左上の横棒" },
        { x: 40, y: 120, w: 140, h: 240, label: "左の縦と曲線" },
        { x: 220, y: 60, w: 140, h: 140, label: "右上" },
        { x: 220, y: 200, w: 140, h: 140, label: "右下の点" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "に": {
      char: "に", strokeCount: 3, row: "なぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 180, y: 60, w: 180, h: 120, label: "右上の横" },
        { x: 180, y: 240, w: 180, h: 120, label: "右下の横" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },
    "ぬ": {
      char: "ぬ", strokeCount: 2, row: "なぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 160, h: 160, label: "左上" },
        { x: 200, y: 40, w: 160, h: 160, label: "右上" },
        { x: 60, y: 200, w: 280, h: 180, label: "下のループ" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "ね": {
      char: "ね", strokeCount: 2, row: "なぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 140, y: 40, w: 220, h: 180, label: "右上" },
        { x: 100, y: 200, w: 260, h: 180, label: "下のループ" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "の": {
      char: "の", strokeCount: 1, row: "なぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 180, label: "上部" },
        { x: 60, y: 200, w: 280, h: 180, label: "下部" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },

    // --- は行 ---
    "は": {
      char: "は", strokeCount: 3, row: "はぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 160, y: 40, w: 200, h: 160, label: "右上" },
        { x: 160, y: 200, w: 200, h: 180, label: "右下のカーブ" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "ひ": {
      char: "ひ", strokeCount: 1, row: "はぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 180, h: 320, label: "左の曲線" },
        { x: 200, y: 80, w: 160, h: 280, label: "右の曲線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },
    "ふ": {
      char: "ふ", strokeCount: 4, row: "はぎょう",
      requiredAreas: [
        { x: 140, y: 20, w: 120, h: 80, label: "上の点" },
        { x: 40, y: 120, w: 140, h: 140, label: "左の点" },
        { x: 80, y: 240, w: 240, h: 140, label: "下のカーブ" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },
    "へ": {
      char: "へ", strokeCount: 1, row: "はぎょう",
      requiredAreas: [
        { x: 40, y: 100, w: 180, h: 200, label: "左の上り" },
        { x: 180, y: 100, w: 200, h: 240, label: "右の下り" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.5,
    },
    "ほ": {
      char: "ほ", strokeCount: 4, row: "はぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 140, y: 40, w: 220, h: 80, label: "横棒" },
        { x: 200, y: 120, w: 80, h: 160, label: "右の縦" },
        { x: 140, y: 240, w: 220, h: 140, label: "下の丸" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },

    // --- ま行 ---
    "ま": {
      char: "ま", strokeCount: 3, row: "まぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 80, label: "上の横棒" },
        { x: 60, y: 120, w: 280, h: 80, label: "下の横棒" },
        { x: 100, y: 220, w: 200, h: 160, label: "下の丸" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "み": {
      char: "み", strokeCount: 2, row: "まぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 200, h: 200, label: "上の曲線" },
        { x: 100, y: 220, w: 260, h: 160, label: "下の曲線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "む": {
      char: "む", strokeCount: 3, row: "まぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 120, label: "上部" },
        { x: 60, y: 160, w: 240, h: 180, label: "下のカーブ" },
        { x: 280, y: 200, w: 100, h: 100, label: "右の点" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },
    "め": {
      char: "め", strokeCount: 2, row: "まぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 160, h: 320, label: "左の線" },
        { x: 180, y: 40, w: 180, h: 320, label: "右のループ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "も": {
      char: "も", strokeCount: 3, row: "まぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 100, label: "上の横棒" },
        { x: 60, y: 140, w: 280, h: 100, label: "下の横棒" },
        { x: 100, y: 40, w: 120, h: 340, label: "縦の曲線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },

    // --- や行 ---
    "や": {
      char: "や", strokeCount: 3, row: "やぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 160, h: 200, label: "左の線" },
        { x: 40, y: 240, w: 160, h: 140, label: "左下" },
        { x: 200, y: 40, w: 160, h: 320, label: "右の線" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },
    "ゆ": {
      char: "ゆ", strokeCount: 2, row: "やぎょう",
      requiredAreas: [
        { x: 40, y: 60, w: 160, h: 280, label: "左の線" },
        { x: 160, y: 40, w: 200, h: 320, label: "右の曲線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "よ": {
      char: "よ", strokeCount: 2, row: "やぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 120, label: "横棒" },
        { x: 100, y: 100, w: 160, h: 280, label: "縦の曲線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },

    // --- ら行 ---
    "ら": {
      char: "ら", strokeCount: 2, row: "らぎょう",
      requiredAreas: [
        { x: 120, y: 20, w: 160, h: 100, label: "上の点" },
        { x: 60, y: 120, w: 280, h: 260, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "り": {
      char: "り", strokeCount: 2, row: "らぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 120, h: 240, label: "左の線" },
        { x: 220, y: 40, w: 140, h: 320, label: "右の線" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "る": {
      char: "る", strokeCount: 1, row: "らぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 160, label: "上部" },
        { x: 60, y: 200, w: 280, h: 180, label: "下のループ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },
    "れ": {
      char: "れ", strokeCount: 2, row: "らぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 140, y: 40, w: 220, h: 180, label: "右上" },
        { x: 140, y: 200, w: 220, h: 180, label: "右下" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.0,
    },
    "ろ": {
      char: "ろ", strokeCount: 1, row: "らぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 280, h: 160, label: "上部" },
        { x: 60, y: 200, w: 280, h: 180, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.6,
    },

    // --- わ行 ---
    "わ": {
      char: "わ", strokeCount: 2, row: "わぎょう",
      requiredAreas: [
        { x: 40, y: 40, w: 100, h: 320, label: "左の縦線" },
        { x: 160, y: 40, w: 200, h: 320, label: "右のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.8,
    },
    "を": {
      char: "を", strokeCount: 3, row: "わぎょう",
      requiredAreas: [
        { x: 60, y: 20, w: 280, h: 100, label: "上の横棒" },
        { x: 60, y: 120, w: 280, h: 120, label: "中段" },
        { x: 60, y: 240, w: 280, h: 140, label: "下部" },
      ],
      minAreasRequired: 3,
      minStrokeLengthRatio: 1.2,
    },
    "ん": {
      char: "ん", strokeCount: 1, row: "わぎょう",
      requiredAreas: [
        { x: 60, y: 40, w: 180, h: 200, label: "上部" },
        { x: 140, y: 200, w: 220, h: 180, label: "下のカーブ" },
      ],
      minAreasRequired: 2,
      minStrokeLengthRatio: 0.5,
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
