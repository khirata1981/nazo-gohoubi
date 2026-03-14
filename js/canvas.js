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
  guideComponents: [],  // ガイドマスクの連結成分（独立パーツ検出用）
  componentMap: null,   // ピクセル→コンポーネントIDのマップ

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

    // 連結成分を検出（点などの独立パーツを識別）
    this.guideComponents = this.findMaskComponents();
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

  // --- なぞり判定（ストロークゾーン方式） ---
  // キャンバスを gridSize×gridSize のグリッドに分割し、
  // お手本が通るゾーンをユーザーが一定割合通過したかで判定
  evaluate() {
    const size = Settings.canvasSize;
    const gridSize = Settings.gridSize;
    const cellSize = size / gridSize;

    // 全ストロークのポイントをフラットに
    const allPoints = this.strokes.flat();
    if (allPoints.length === 0) {
      return { pass: false, reason: "noStroke" };
    }

    // === 最低ストローク長チェック（タップ防止） ===
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

    // === お手本ゾーンをマスクから自動検出 ===
    const guideZones = this.detectGuideZones(gridSize, cellSize);
    if (guideZones.size === 0) {
      return { pass: false, reason: "noGuide" };
    }

    // === ユーザーが通ったゾーンを集計 + ピクセルベースはみ出し判定 ===
    const userZones = new Set();
    let outOfBoundsCount = 0;
    const mask = this.guideMask;

    for (const pt of allPoints) {
      const col = Math.floor(pt.x / cellSize);
      const row = Math.floor(pt.y / cellSize);

      // キャンバス外
      if (col < 0 || col >= gridSize || row < 0 || row >= gridSize) {
        outOfBoundsCount++;
        continue;
      }

      // ゾーン通過を記録
      const key = `${col},${row}`;
      userZones.add(key);

      // ピクセルベースのはみ出しチェック（マスクのピクセルに乗っていなければはみ出し）
      const px = Math.min(Math.max(Math.floor(pt.x), 0), size - 1);
      const py = Math.min(Math.max(Math.floor(pt.y), 0), size - 1);
      const pidx = (py * size + px) * 4 + 3;
      if (mask.data[pidx] <= 128) {
        outOfBoundsCount++;
      }
    }

    // === はみ出し率チェック（ピクセルベース） ===
    const outOfBoundsRatio = outOfBoundsCount / allPoints.length;
    if (outOfBoundsRatio >= Settings.maxOutOfBoundsRatio) {
      return { pass: false, reason: "outOfBounds" };
    }

    // === コンポーネントカバーチェック（点などの独立パーツ到達確認） ===
    // componentMap を使い、ユーザーのストロークが各パーツの実際のピクセル上を通ったか判定
    // マスク自体が maskStrokeWidth(20px) の太さを持つので、追加のtolerance不要
    const coveredComps = new Set();
    const compMap = this.componentMap;

    for (const pt of allPoints) {
      const px = Math.min(Math.max(Math.floor(pt.x), 0), size - 1);
      const py = Math.min(Math.max(Math.floor(pt.y), 0), size - 1);
      const cid = compMap[py * size + px];
      if (cid > 0) coveredComps.add(cid);

      // 全コンポーネントがカバーされたら早期終了
      if (coveredComps.size >= this.guideComponents.length) break;
    }

    for (const comp of this.guideComponents) {
      if (!coveredComps.has(comp.id)) {
        return { pass: false, reason: "missedPart" };
      }
    }

    // === ゾーンカバー率チェック ===
    let hitCount = 0;
    for (const zone of guideZones) {
      if (userZones.has(zone)) hitCount++;
    }
    const coverageRatio = hitCount / guideZones.size;

    // 文字ごとの minCoverRatio（未設定なら Settings のデフォルト値）
    const charData = Hiragana.characters[Hiragana.current];
    const minCoverRatio = (charData && charData.minCoverRatio) || Settings.defaultMinCoverRatio;
    const pass = coverageRatio >= minCoverRatio;

    return { pass, reason: pass ? "clear" : "lowCoverage", coverageRatio };
  },

  // ガイドマスクのピクセルから連結成分を検出（BFS）
  // 点や独立した画のような分離パーツを識別する
  // 各ピクセルにコンポーネントIDを割り当てたマップも構築
  findMaskComponents() {
    const mask = this.guideMask;
    const size = Settings.canvasSize;
    const minPixels = Settings.minComponentPixels;
    const compMap = new Uint16Array(size * size);
    const components = [];
    let nextId = 1;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4 + 3;
        if (mask.data[idx] > 128 && compMap[y * size + x] === 0) {
          const id = nextId++;
          const queue = [{x, y}];
          let qi = 0;
          compMap[y * size + x] = id;
          let count = 0;
          let minX = x, maxX = x, minY = y, maxY = y;

          while (qi < queue.length) {
            const p = queue[qi++];
            count++;
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;

            // 4方向の隣接ピクセルをチェック
            const neighbors = [
              {x: p.x + 1, y: p.y}, {x: p.x - 1, y: p.y},
              {x: p.x, y: p.y + 1}, {x: p.x, y: p.y - 1},
            ];
            for (const n of neighbors) {
              if (n.x >= 0 && n.x < size && n.y >= 0 && n.y < size) {
                const nIdx = (n.y * size + n.x) * 4 + 3;
                if (mask.data[nIdx] > 128 && compMap[n.y * size + n.x] === 0) {
                  compMap[n.y * size + n.x] = id;
                  queue.push(n);
                }
              }
            }
          }

          // 一定サイズ以上のコンポーネントのみ記録
          if (count >= minPixels) {
            components.push({
              id: id,
              size: count,
              bbox: {x0: minX, y0: minY, x1: maxX, y1: maxY},
            });
          }
        }
      }
    }

    this.componentMap = compMap;
    return components;
  },

  // ガイドマスクからお手本が通るグリッドゾーンを自動検出
  // セル内のガイドピクセル密度が閾値以上のセルのみゾーンとして認識
  detectGuideZones(gridSize, cellSize) {
    const mask = this.guideMask;
    const size = Settings.canvasSize;
    const zones = new Set();
    const step = 4; // マスクのサンプリング間隔
    const minDensity = Settings.minZoneDensity;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x0 = Math.floor(col * cellSize);
        const y0 = Math.floor(row * cellSize);
        const x1 = Math.floor((col + 1) * cellSize);
        const y1 = Math.floor((row + 1) * cellSize);
        let hitCount = 0;
        let totalCount = 0;

        for (let y = y0; y < y1; y += step) {
          for (let x = x0; x < x1; x += step) {
            totalCount++;
            const idx = (y * size + x) * 4 + 3;
            if (mask.data[idx] > 128) {
              hitCount++;
            }
          }
        }

        if (totalCount > 0 && (hitCount / totalCount) >= minDensity) {
          zones.add(`${col},${row}`);
        }
      }
    }

    return zones;
  },
};
