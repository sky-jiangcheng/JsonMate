/**
 * src/app/actions.js
 * Pure business-logic actions. No DOM manipulation.
 * Each action takes inputs, returns a result object.
 */

(function () {
  'use strict';

  /* ==============================================================
     Helpers (pure, no DOM)
  ============================================================== */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** 值本身是否是可解析的 JSON 文本 */
  function isJsonText(v) {
    if (typeof v !== 'string' || !v) return false;
    try { JSON.parse(v); return true; } catch (_) { return false; }
  }

  // 老版本记录可能长得跟现在不一样。字段名白名单之外的字符串值一律不认作内容,
  // 否则 name/label 会被误当成 JSON({name:'foo'} 这种记录读出来内容就成了 "foo")。
  var NON_CONTENT_KEYS = { id: 1, _id: 1, name: 1, title: 1, label: 1 };

  function normalizeHistoryItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    // id 必须跨次读取稳定: 之前用 Date.now()+random 兜底, 每次 getHistory() 都换,
    // 而删除/勾选走的是"重新 getHistory 再按 id 比对", 结果永远比不中 —— 老记录删不掉。
    // 这里用 内容+下标 做确定性派生, 同一份存储多次读出同一个 id。
    var id = String(raw.id || raw._id || '');
    var content = '';
    // 跨版本字段兼容：历史上可能用过 content / json / text / data / value 等字段存内容
    if (typeof raw.content === 'string') content = raw.content;
    else if (typeof raw.json === 'string') content = raw.json;
    else if (typeof raw.text === 'string') content = raw.text;
    else if (typeof raw.data === 'string') content = raw.data;
    else if (typeof raw.value === 'string') content = raw.value;
    // 老版本 {id, entries:[...]} 这种容器对象: 取第一个字符串元素
    else if (Array.isArray(raw.entries) && typeof raw.entries[0] === 'string') content = raw.entries[0];
    else if (raw && typeof raw === 'object') {
      for (var k in raw) {
        if (NON_CONTENT_KEYS[k]) continue;
        var v = raw[k];
        if (isJsonText(v)) { content = v; break; }
      }
    }
    if (!id) {
      // 只用 内容+名称 派生, 不掺下标: 掺了下标的话删掉别的记录后 id 会跟着变。
      var sum = 0, seed = content + '|' + String(raw.name || '');
      for (var s = 0; s < seed.length; s++) sum = (sum * 31 + seed.charCodeAt(s)) >>> 0;
      id = 'legacy-' + sum.toString(36);
    }
    var name = String(raw.name || raw.title || raw.label || '');
    if (!name) name = 'untitled';
    // 老版本可能把内容多 stringify 了一层(如 "{\"a\":1}")。仅当脱一层之后
    // 内层仍是合法 JSON 时才脱壳: 顶层 JSON 字符串本身就是合法 JSON,
    // 无条件脱壳会把 "hello" 变成非法的 hello, 该记录重载后再也格式化不了。
    if (content && content.length > 2 && content.charCodeAt(0) === 34 && content.charCodeAt(content.length - 1) === 34) {
      try {
        var unwrapped = JSON.parse(content);
        if (typeof unwrapped === 'string') {
          try { JSON.parse(unwrapped); content = unwrapped; } catch (_inner) { /* 内层不是 JSON: 原样保留 */ }
        }
      } catch (_) {}
    }
    // 单条超大记录的降级提示：不丢弃数据，但后续调用方可以根据 size 决定 UI 提示
    var sizeBytes = content.length;
    return { id: id, name: name, content: String(content || ''), _size: sizeBytes };
  }

  function getHistory() {
    var raw = null;
    try {
      raw = JSON.parse(localStorage.getItem('jsonHistory') || '[]');
    } catch (e) {
      try { localStorage.removeItem('jsonHistory'); } catch (_) {}
      return [];
    }
    if (!Array.isArray(raw)) return [];
    var out = [];
    var seen = {};
    for (var i = 0; i < raw.length; i++) {
      var n = normalizeHistoryItem(raw[i]);
      if (!n) continue;
      // 派生 id 理论上会撞（两条内容与名称都相同的无 id 老记录）。
      // 撞了就加序号后缀, 否则按 id 删除会把两条一起删掉。
      if (seen[n.id] !== undefined) {
        seen[n.id]++;
        n.id = n.id + '-' + seen[n.id];
        while (seen[n.id] !== undefined) { seen[n.id]++; n.id = n.id.replace(/-\d+$/, '') + '-' + seen[n.id]; }
        // 重命名后的最终 id 必须登记为已占用: while 未进入时上面不会登记,
        // 之后某条显式同号记录(如存量里同时有 id x / x / x-1)会拿到同一个 id,
        // 按 id 删除/勾选就会同时命中两条
        seen[n.id] = 0;
      } else {
        seen[n.id] = 0;
      }
      out.push(n);
    }
    return out;
  }

  /**
   * 写入历史记录。返回 true = 已落盘, false = 两次写入都失败。
   * 失败时**保留 localStorage 里的原有数据**并返回 false, 由调用方提示用户;
   * 绝不能 removeItem —— 那会把用户全部历史静默删掉。
   */
  function setHistory(arr) {
    try {
      // 裁剪上限,避免超大历史撑爆 localStorage 配额
      if (Array.isArray(arr)) {
        var normalized = [];
        for (var i = 0; i < Math.min(arr.length, 100); i++) {
          var n = normalizeHistoryItem(arr[i]);
          if (n) normalized.push({ id: n.id, name: n.name, content: n.content });
        }
        arr = normalized;
      }
      localStorage.setItem('jsonHistory', JSON.stringify(arr));
      return true;
    } catch (e) {
      // 配额满/序列化失败时静默降级: 尝试只保留最近的 20 条再写一次
      console.warn('[actions] setHistory failed, trimming:', e);
      try {
        if (Array.isArray(arr)) {
          var trimmed = [];
          for (var j = 0; j < Math.min(arr.length, 20); j++) {
            var m = normalizeHistoryItem(arr[j]);
            if (m) trimmed.push({ id: m.id, name: m.name, content: m.content });
          }
          localStorage.setItem('jsonHistory', JSON.stringify(trimmed));
        }
        return true;
      } catch (e2) {
        // 二次写入仍失败: 不动已有键, 旧历史原样保留, 返回 false 让调用方报错
        console.warn('[actions] setHistory 仍失败, 已保留原有历史记录(未删除):', e2);
        return false;
      }
    }
  }

  /**
   * 自动修复未加引号的键名: `{key: 1}` → `{"key": 1}`。
   * 状态机扫描而非正则: 原正则不感知字符串边界, 会误改字符串内容里
   * 恰好出现的 `{key: ` 模式 (如 `{a: "x: {y: 1}"}` 会破坏字符串内容)。
   */
  function tryFixUnquotedKeys(input) {
    var out = '';
    var inString = false, escape = false;
    var i = 0;

    function isIdStart(c) { return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '_' || c === '$'; }
    function isIdChar(c) { return isIdStart(c) || c >= '0' && c <= '9'; }
    function isWs(c) { return c === ' ' || c === '\t' || c === '\n' || c === '\r'; }

    while (i < input.length) {
      var ch = input[i];

      // 字符串内部: 原样输出, 不做任何修复
      if (inString) {
        out += ch;
        if (escape) escape = false;
        else if (ch === '\\') escape = true;
        else if (ch === '"') inString = false;
        i++;
        continue;
      }
      if (ch === '"') { inString = true; out += ch; i++; continue; }

      // 非字符串: 仅在 `{` / `,` 后紧跟 空白? 标识符 空白? `:` 时补引号
      if (ch === '{' || ch === ',') {
        var j = i + 1;
        while (j < input.length && isWs(input[j])) j++;
        if (j < input.length && isIdStart(input[j])) {
          var k = j + 1;
          while (k < input.length && isIdChar(input[k])) k++;
          var m = k;
          while (m < input.length && isWs(input[m])) m++;
          if (m < input.length && input[m] === ':') {
            out += ch + input.slice(i + 1, j) + '"' + input.slice(j, k) + '"';
            i = m; // 跳到冒号, 后续字符原样处理
            continue;
          }
        }
      }

      out += ch;
      i++;
    }
    return out;
  }

  function tryFixJson(str) {
    var s = str.trim();
    var stack = [];
    var inString = false, escape = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (escape) { escape = false; continue; }
      if (inString) {
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') { inString = true; continue; }
      if (ch === '{') stack.push('}');
      else if (ch === '[') stack.push(']');
      else if (ch === '}' || ch === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === ch) {
          stack.pop();
        }
      }
    }
    var fixed = s, ok = stack.length > 0;
    while (stack.length > 0) {
      fixed += stack.pop();
    }
    return { success: ok, json: fixed };
  }

  function parseInput(value) {
    var jsonObj = null;
    var fixed = false;
    var fixMsg = '';
    var error = null;
    // BOM: Windows 工具导出的 .json 常带 \uFEFF, JSON.parse 直接抛
    // "Unexpected token '﻿'" —— 那不是用户的 JSON 写错了, 不该报"JSON 无效",
    // 后续 tryFixJson 也因为 stack 为空(括号本来就平衡)帮不上忙。
    var text = value && value.charCodeAt(0) === 0xFEFF ? value.slice(1) : value;

    try {
      jsonObj = JSON.parse(text);
    } catch (err) {
      error = err;
      var v = text;
      var uq = tryFixUnquotedKeys(v);
      if (uq !== v) {
        try {
          jsonObj = JSON.parse(uq);
          fixed = true;
          fixMsg = 'autoQuoteId';
        } catch (e2) {}
      }
      if (!jsonObj && uq !== v) {
        var fixUqResult = tryFixJson(uq);
        if (fixUqResult.success) {
          try {
            jsonObj = JSON.parse(fixUqResult.json);
            fixed = true;
            fixMsg = 'autoQuoteId';
          } catch (e3) {}
        }
      }
      if (!jsonObj) {
        var fixResult = tryFixJson(v);
        if (fixResult.success) {
          try {
            jsonObj = JSON.parse(fixResult.json);
            fixed = true;
            fixMsg = fixMsg || 'autoBracket';
          } catch (e2) {
            return { error: err, input: text };
          }
        } else {
          return { error: err, input: text };
        }
      }
    }

    return { json: jsonObj, fixed: fixed, fixMsg: fixMsg, input: text };
  }

  /* ==============================================================
     Actions (pure or returning { state })
  ============================================================== */

  /**
   * formatJSON: parse input → formatted JSON string.
   * Returns { content, type, fixed, parsed } for the renderer.
   */
  function formatJSON(inputValue) {
    var r = parseInput(inputValue);
    if (r.error) return { error: r.error, input: r.input };
    var content = JSON.stringify(r.json, null, 2);
    return { content: content, type: 'json', fixed: r.fixed, parsed: r.json, fixMsg: r.fixMsg };
  }

  /**
   * minifyJSON: parse input → minified JSON string.
   */
  function minifyJSON(inputValue) {
    var r = parseInput(inputValue);
    if (r.error) return { error: r.error, input: r.input };
    var content = JSON.stringify(r.json);
    return { content: content, type: 'text', fixed: r.fixed, parsed: r.json, fixMsg: r.fixMsg };
  }

  /**
   * stringifyJSON: parse input → JSON string of the stringified value.
   */
  function stringifyJSON(inputValue) {
    var r = parseInput(inputValue);
    if (r.error) return { error: r.error, input: r.input };
    var content = JSON.stringify(JSON.stringify(r.json));
    return { content: content, type: 'text', fixed: r.fixed, parsed: r.json, fixMsg: r.fixMsg };
  }

  /**
   * copyOutput: returns the content to copy.
   */
  function copyOutput(detailContent, formattedContent) {
    return detailContent || formattedContent || null;
  }

  /**
   * downloadJSON: returns { content, fileName }.
   */
  function downloadJSON(formattedContent) {
    if (!formattedContent) return null;
    return { content: formattedContent, fileName: 'formatted_' + Date.now() + '.json' };
  }

  /**
   * clearContent: returns new state for cleared output.
   */
  function clearContent() {
    return {
      input: '',
      output: '',
      outputType: 'empty',
      outputFixed: false,
      outputParsed: null,
      lastDetailContent: '',
      // 清空后编辑器内容已经不再是"从某条历史记录载入的那条",
      // 不重置的话接着输入新 JSON 再 Ctrl+S 会命中覆盖分支, 悄悄改掉旧记录
      loadedHistoryId: null,
    };
  }

  /**
   * toggleTheme: returns new theme value.
   */
  function toggleTheme() {
    var current = localStorage.getItem('theme') || 'light';
    return current === 'dark' ? 'light' : 'dark';
  }

  /**
   * saveHistory: validates and returns { name, content }.
   */
  function saveHistory(formattedContent) {
    if (!formattedContent) return { valid: false };
    return { valid: true, content: formattedContent };
  }

  /**
   * confirmSave: returns the history entry to add.
   */
  function confirmSave(formattedContent, name) {
    var id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    return {
      id: id,
      name: name || 'untitled',
      content: formattedContent,
    };
  }

  /**
   * deleteHistory: returns filtered history ids.
   */
  function deleteHistory(history, id, selectedIds) {
    var filtered = history.filter(function (item) { return item.id !== id; });
    var newSelected = selectedIds.filter(function (i) { return i !== id; });
    return { history: filtered, selectedIds: newSelected };
  }

  /**
   * clearAllHistory: returns empty state.
   */
  function clearAllHistory() {
    return { history: [], selectedIds: [] };
  }

  /**
   * loadHistory: returns { content, name }.
   */
  function loadHistory(history, id) {
    var item = history.find(function (h) { return h.id === id; });
    if (!item) return null;
    return { content: item.content, name: item.name };
  }

  /**
   * toggleSelect: returns new selectedIds array.
   */
  function toggleSelect(selectedIds, id) {
    if (selectedIds.indexOf(id) >= 0) {
      return selectedIds.filter(function (i) { return i !== id; });
    } else {
      if (selectedIds.length < 2) {
        return selectedIds.concat([id]);
      } else {
        return [selectedIds[1], id];
      }
    }
  }

  /**
   * reverseCompare: returns new compareOrder.
   */
  function reverseCompare(compareOrder) {
    return compareOrder.slice().reverse();
  }

  /**
   * parse for diff: shared helper.
   */
  function diffParse(content) {
    try { return JSON.parse(content); } catch (e) { return content; }
  }

  /* ==============================================================
     Export
  ============================================================== */
  window.__actions = {
    formatJSON: formatJSON,
    minifyJSON: minifyJSON,
    stringifyJSON: stringifyJSON,
    copyOutput: copyOutput,
    downloadJSON: downloadJSON,
    clearContent: clearContent,
    toggleTheme: toggleTheme,
    saveHistory: saveHistory,
    confirmSave: confirmSave,
    deleteHistory: deleteHistory,
    clearAllHistory: clearAllHistory,
    loadHistory: loadHistory,
    toggleSelect: toggleSelect,
    reverseCompare: reverseCompare,
    diffParse: diffParse,
    getHistory: getHistory,
    setHistory: setHistory,
    escapeHtml: escapeHtml,
  };
})();
