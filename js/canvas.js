// ========================================
// キャンバス描画・なぞり判定
// ========================================

const TracingCanvas = {
  canvas: null,
  ctx: null,
  isDrawing: false,
  strokes: [],       // ユーザーが描いた座標 [[{x,y}, ...], ...]
  currentStroke: [],

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

    // デバッグ用: 必須エリアを表示
    if (Settings.debugAreas) {
      this.drawDebugAreas();
    }
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

  // --- なぞり判定（必須エリア方式） ---
  // 文字ごとに定義された必須エリアにストロークが通っているかで判定
  evaluate() {
    const size = Settings.canvasSize;
    const allPoints = this.strokes.flat();

    if (allPoints.length === 0) {
      return { pass: false, reason: "noStroke" };
    }

    // 1. 最低ストローク長チェック（タップ防止）
    let totalLength = 0;
    for (const stroke of this.strokes) {
      for (let i = 1; i < stroke.length; i++) {
        const dx = stroke[i].x - stroke[i - 1].x;
        const dy = stroke[i].y - stroke[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
    }
    const charData = Hiragana.characters[Hiragana.current];
    const minRatio = charData.minStrokeLengthRatio || 1.0;
    const minLength = size * minRatio;
    if (totalLength < minLength) {
      return { pass: false, reason: "tooShort" };
    }

    // 2. 必須エリアチェック
    const areas = charData.requiredAreas;
    const minRequired = charData.minAreasRequired;
    let hitAreas = 0;

    for (const area of areas) {
      const pointsInArea = allPoints.filter(pt =>
        pt.x >= area.x && pt.x <= area.x + area.w &&
        pt.y >= area.y && pt.y <= area.y + area.h
      );
      // エリア内に5ポイント以上あれば「通過した」と判定
      if (pointsInArea.length >= 5) {
        hitAreas++;
      }
    }

    if (hitAreas >= minRequired) {
      return { pass: true, reason: "clear" };
    } else {
      return { pass: false, reason: "lowCoverage" };
    }
  },

  // デバッグ用: 必須エリアを薄い矩形で描画
  drawDebugAreas() {
    const charData = Hiragana.characters[Hiragana.current];
    if (!charData || !charData.requiredAreas) return;

    const ctx = this.ctx;
    const colors = [
      "rgba(255, 0, 0, 0.15)",
      "rgba(0, 0, 255, 0.15)",
      "rgba(0, 180, 0, 0.15)",
      "rgba(255, 165, 0, 0.15)",
    ];

    ctx.save();
    for (let i = 0; i < charData.requiredAreas.length; i++) {
      const area = charData.requiredAreas[i];
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(area.x, area.y, area.w, area.h);
      ctx.strokeStyle = colors[i % colors.length].replace("0.15", "0.5");
      ctx.lineWidth = 2;
      ctx.strokeRect(area.x, area.y, area.w, area.h);
      // ラベル表示
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(area.label, area.x + 4, area.y + 4);
    }
    ctx.restore();
  },
};
