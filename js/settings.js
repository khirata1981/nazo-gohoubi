// ========================================
// 設定値
// ========================================

const Settings = {
  // キャンバスサイズ
  canvasSize: 400,

  // お手本文字の設定
  guideFont: "Hiragino Maru Gothic ProN",
  guideFontSize: 320,
  guideColor: "rgba(200, 200, 200, 0.4)",

  // なぞり線の設定
  strokeColor: "#FF6B6B",
  strokeWidth: 28,

  // 判定の設定（甘め：4歳向け）
  passThreshold: 0.4,     // カバー率40%でクリア
  sampleStep: 8,          // サンプリング間隔（px）
  hitRadius: 30,           // 判定の許容半径（px）

  // YouTube ごほうび動画ID
  youtubeVideoId: "dQw4w9WgXcQ",
};
