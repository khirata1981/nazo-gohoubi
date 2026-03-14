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

    // 全ストロークのポイントをフラットに
    const allPoints = this.strokes.flat();
    if (allPoints.length === 0) {
      return { pass: false, reason: "noStroke" };
    }

    // === 改善1: 最低ストローク長チェック ===
    let totalLength = 0;
    for (const stroke of this.strokes) {
      for (let i = 1; i < stroke.length; i++) {
        const dx = stroke[i].x - stroke[i - 1].x;
        const dy = stroke[i].y - stroke[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
    }
    const minLength = size * Settings.minStrokeLengthRatio;
    if (totalLength < minLength) {
      return { pass: false, reason: "tooShort" };
    }

    // === 改善2: はみ出し率チェック ===
    const obRadius = Settings.outOfBoundsRadius;
    let outCount = 0;
    for (const pt of allPoints) {
      if (!this.isNearGuide(pt, mask, size, obRadius)) {
        outCount++;
      }
    }
    const outOfBoundsRatio = outCount / allPoints.length;
    if (outOfBoundsRatio >= Settings.maxOutOfBoundsRatio) {
      return { pass: false, reason: "outOfBounds" };
    }

    // === 改善3: カバー率チェック ===
    let guidePoints = [];
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4 + 3; // alpha チャンネル
        if (mask.data[idx] > 128) {
          guidePoints.push({ x, y });
        }
      }
    }

    if (guidePoints.length === 0) {
      return { pass: false, reason: "noGuide" };
    }

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

    const coverageRatio = hitCount / guidePoints.length;
    const pass = coverageRatio >= Settings.passThreshold;

    return { pass, reason: pass ? "clear" : "lowCoverage", coverageRatio };
  },

  // ガイドマスクの近傍にユーザーのポイントがあるか判定
  isNearGuide(pt, mask, size, radius) {
    const px = Math.round(pt.x);
    const py = Math.round(pt.y);

    // 範囲外はすべてはみ出し扱い
    if (px < 0 || px >= size || py < 0 || py >= size) return false;

    // 直接ヒット（高速パス）
    const directIdx = (py * size + px) * 4 + 3;
    if (mask.data[directIdx] > 128) return true;

    // 近傍をステップ間隔で探索
    const searchStep = 4;
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy += searchStep) {
      for (let dx = -radius; dx <= radius; dx += searchStep) {
        if (dx * dx + dy * dy > r2) continue;
        const cx = px + dx;
        const cy = py + dy;
        if (cx < 0 || cx >= size || cy < 0 || cy >= size) continue;
        const idx = (cy * size + cx) * 4 + 3;
        if (mask.data[idx] > 128) return true;
      }
    }
    return false;
  },
};
