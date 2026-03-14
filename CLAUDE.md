# Claude Code ルール

## プロジェクト概要
4〜5歳向けのひらがななぞり練習Webアプリ。
ひらがなを指でなぞって、条件クリアでYouTubeのごほうび動画が見られる。

## 技術方針
- Vanilla JS + HTML5 Canvas のみ。フレームワーク不使用
- 外部ライブラリは最小限（YouTube IFrame API のみ）
- 全て静的ファイル。サーバーサイド処理なし
- GitHub Pages で配信するため、index.html がエントリポイント

## ファイル構成
```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── canvas.js
│   ├── hiragana.js
│   ├── youtube.js
│   └── settings.js
├── CLAUDE.md
├── README.md
└── .gitignore
```

## Git ルール
- 作業は必ず claude-work ブランチで行う
- main ブランチには直接コミットしない
- コミットメッセージは日本語で簡潔に

## UI ルール
- ボタンは大きく（高さ80px以上）、4歳の指で押しやすいサイズ
- 文字は大きく読みやすく
- 画面のテキストはすべてひらがな（漢字を使わない）
- iPad横向きを主な対象とする

## なぞり判定
- 4歳向けなので甘めに判定する
- だいたいの形が合っていればOK
- 厳しすぎる判定は子どもの学習意欲を下げるので避ける
