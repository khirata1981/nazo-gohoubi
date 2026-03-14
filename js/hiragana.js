// ========================================
// ひらがなデータ
// ========================================

const Hiragana = {
  // 現在の文字
  current: "あ",

  // 文字データ（将来の拡張用）
  characters: {
    "あ": {
      char: "あ",
      strokeCount: 3,
    },
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
