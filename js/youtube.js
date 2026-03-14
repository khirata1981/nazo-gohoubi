// ========================================
// YouTube ごほうび動画
// ========================================

const YouTube = {
  player: null,
  isReady: false,

  // YouTube IFrame API を読み込み
  loadAPI() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        this.isReady = true;
        resolve();
        return;
      }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        this.isReady = true;
        resolve();
      };
    });
  },

  // ごほうび動画を再生
  play(containerId) {
    const area = document.getElementById("youtube-area");
    area.classList.remove("hidden");

    if (this.player) {
      this.player.destroy();
    }

    this.player = new YT.Player(containerId, {
      videoId: Settings.getRandomVideoId(),
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onStateChange: (e) => {
          // 動画が終了したら自動で閉じる
          if (e.data === YT.PlayerState.ENDED) {
            this.stop();
          }
        },
      },
    });
  },

  // 動画を停止して閉じる
  stop() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    // プレイヤーの div を再作成
    const area = document.getElementById("youtube-area");
    area.classList.add("hidden");
    const container = document.getElementById("youtube-player");
    if (!container) {
      const div = document.createElement("div");
      div.id = "youtube-player";
      area.insertBefore(div, area.querySelector(".close-btn"));
    }

    // メイン画面に戻る
    if (typeof App !== "undefined") {
      App.onVideoClose();
    }
  },
};
