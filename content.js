// X Media Search Button - プロフィール欄にメディア検索リンクを追加

(function() {
  'use strict';

  const LINK_ID = 'x-media-search-link';

  // メディア検索URLを生成
  function createMediaSearchUrl(username) {
    const query = `from:${username} filter:media`;
    return `https://x.com/search?q=${encodeURIComponent(query)}&src=recent_search_click&f=live`;
  }

  // ユーザー名をURLから取得
  function getUsernameFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/^\/([^\/]+)\/?$/);
    if (match && !isReservedPath(match[1])) {
      return match[1];
    }
    return null;
  }

  // 予約パス（プロフィール以外）をチェック
  function isReservedPath(path) {
    const reserved = [
      'home', 'explore', 'search', 'notifications', 'messages',
      'settings', 'i', 'compose', 'login', 'logout', 'signup',
      'tos', 'privacy', 'about', 'help', 'jobs', 'download'
    ];
    return reserved.includes(path.toLowerCase());
  }

  // メディア検索リンクを作成
  function createMediaSearchLink(username) {
    const link = document.createElement('a');
    link.id = LINK_ID;
    link.href = createMediaSearchUrl(username);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'x-media-search-link';
    link.textContent = 'メディア検索';
    return link;
  }

  // リンクを挿入
  function insertMediaSearchLink() {
    if (document.getElementById(LINK_ID)) {
      return;
    }

    const username = getUsernameFromUrl();
    if (!username) {
      return;
    }

    // data-testid="UserName" を探す
    const userNameElement = document.querySelector('[data-testid="UserName"]');
    if (!userNameElement) {
      return;
    }

    const link = createMediaSearchLink(username);
    const parent = userNameElement.parentElement;
    if (parent) {
      parent.insertAdjacentElement('afterend', link);
    }
  }

  // リンクを削除
  function removeMediaSearchLink() {
    const existing = document.getElementById(LINK_ID);
    if (existing) {
      existing.remove();
    }
  }

  // URL変更監視
  let lastUrl = location.href;
  function checkUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      removeMediaSearchLink();
    }
  }

  // DOM監視
  function observeDOM() {
    const observer = new MutationObserver(() => {
      checkUrlChange();
      if (getUsernameFromUrl() && !document.getElementById(LINK_ID)) {
        insertMediaSearchLink();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初期化
  function init() {
    setTimeout(insertMediaSearchLink, 1000);
    observeDOM();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
