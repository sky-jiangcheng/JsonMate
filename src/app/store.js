/**
 * src/app/store.js
 * Central state store with pub/sub. All app state lives here — no more
 * scattered window.* globals.
 * Enhanced with platform-aware state management.
 */

(function () {
  'use strict';

  var _state = {
    input: '',
    output: '',
    outputType: 'empty',   // 'empty' | 'text' | 'json'
    outputFixed: false,
    outputParsed: null,
    // 输出区当前显示的是解析错误时为 { error, input }。
    // 错误也必须走 store: 之前 renderErrorOutput 直接写 innerHTML 而不动
    // output/outputType, 于是"格式化 A 成功 → 格式化失败(显示错误) → 改回 A
    // 再格式化"会被订阅者的 _lastRenderContent 守卫判成"没变化", 错误页残留。
    outputError: null,
    lang: localStorage.getItem('appLang') || 'en',
    theme: localStorage.getItem('theme') || 'light',
    selectedIds: [],
    loadedHistoryId: null, // id of the history record currently loaded into the editor; save overwrites it
    compareOrder: [0, 1],
    listSelectedIndex: 0,
    lastDetailContent: '',
    lastOutputLineCount: 0,
    searchOpen: false,
    searchQuery: '',
    searchMatches: [],
    searchIndex: -1,
    _listArr: null,
    _listArrStr: [],
    _lastRenderContent: '',
    _lastRenderType: 'empty',
    _lastRenderFixed: false,
    _lastRenderParsedObj: null,
    _lastRenderError: null,
    _compareScrollController: null,
  };

  var _subscribers = [];

  function getState() { return _state; }

  function setState(partial) {
    for (var key in partial) {
      if (partial.hasOwnProperty(key)) _state[key] = partial[key];
    }
    for (var i = 0; i < _subscribers.length; i++) _subscribers[i](_state);
  }

  function getStateForKey(key) { return _state[key]; }

  function subscribe(fn) {
    _subscribers.push(fn);
    // Immediately call with current state so renderer can do one-shot render
    fn(_state);
    return function unsubscribe() {
      var idx = _subscribers.indexOf(fn);
      if (idx !== -1) _subscribers.splice(idx, 1);
    };
  }

  // Persistence helpers
  function persistLang(lang) {
    _state.lang = lang;
    localStorage.setItem('appLang', lang);
  }

  function persistTheme(theme) {
    _state.theme = theme;
    localStorage.setItem('theme', theme);
  }

  window.__store = { getState, setState, getStateForKey, subscribe, persistLang, persistTheme };
})();
