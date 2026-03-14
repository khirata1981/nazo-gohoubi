// ========================================
// キャンバス描画・なぞり判定
// ========================================

const TracingCanvas = {
  canvas: null,
  ctx: null,
  isDrawing: false,
  strokes: [],       // ユーザーが描いた座標 [[{x,y}, ...], ...]
  currentStroke: [],
  guideMask: null,

  init(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.resize();
    this.bindEvents();
    this.reset();
  },

  resize() {
    const size = Settings.canvasSize;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + "px";
    this.canvas.style.height = size + "px";
    this.ctx.scale(dpr, dpr);
  },

  reset() {
    const size = Settings.canvasSize;
    this.strokes = [];
    this.currentStroke = [];
    this.ctx.clearRect(0, 0, size, size);

    // お手本を描画
    Hiragana.drawGuide(this.ctx, size);

    // 判定用マスクを生成
    this.guideMask = Hiragana.createGuideMask(size);
  },

  // --- イベント ---
  bindEvents() {
    // タッチイベント
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startStroke(this.getTouchPos(e));
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.continueStroke(this.getTouchPos(e));
    }, { passive: false });

    this.canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.endStroke();
    });

    // マウスイベント（PC デバッグ用）
    this.canvas.addEventListener("mousedown", (e) => {
      this.startStroke(this.getMousePos(e));
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isDrawing) {
        this.continueStroke(this.getMousePos(e));
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.endStroke();
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.endStroke();
    });
  },

  getTouchPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  },

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  },

  // --- 描画 ---
  startStroke(pos) {
    this.isDrawing = true;
    this.currentStroke = [pos];
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.ctx.strokeStyle = Settings.strokeColor;
    this.ctx.lineWidth = Settings.strokeWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  },

  continueStroke(pos) {
    if (!this.isDrawing) return;
    this.currentStroke.push(pos);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  },

  endStroke() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.currentStroke.length > 0) {
      this.strokes.push(this.currentStroke);
    }
    this.currentStroke = [];
  },

  // --- なぞり判定 ---
  evaluate() {
    const size = Settings.canvasSize;
    const step = Settings.sampleStep;
    const hitRadius = Settings.hitRadius;
    const mask = this.guideMask;

    // お手本文字のピクセル座標をサンプリング
    let guidePoints = [];
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4 + 3; // alpha チャンネル
        if (mask.data[idx] > 128) {
          guidePoints.push({ x, y });
        }
      }
    }

    if (guidePoints.length === 0) return 0;

    // 全ストロークのポイントをフラットに
    const allPoints = this.strokes.flat();
    if (allPoints.length === 0) return 0;

    // 各ガイドポイントに対して、ユーザーストロークが近くを通ったか判定
    let hitCount = 0;
    const r2 = hitRadius * hitRadius;

    for (const gp of guidePoints) {
      for (const sp of allPoints) {
        const dx = gp.x - sp.x;
        const dy = gp.y - sp.y;
        if (dx * dx + dy * dy <= r2) {
          hitCount++;
          break;
        }
      }
    }

    return hitCount / guidePoints.length;
  },
};
