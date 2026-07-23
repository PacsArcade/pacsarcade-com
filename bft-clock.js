/**
 * BFT clock badge — Bitcoin Federated Time, self-contained vanilla JS.
 *
 * Ported from the canonical clock (frens.earth src/lib/bb/bft.ts +
 * docs/bft-display.md): 13 months × 28 days × 144 blocks/day; genesis
 * (2009-01-03, block 0) opens year 0000. Time is the block-beat — 6 blocks
 * an hour, ten "minutes" a block — so hh:mm steps by ten and every node on
 * earth agrees on the reading. House law: bitcoin time only, never the old
 * calendar; a genesis-anchored ~10-min/block estimate wears the honest `~`
 * until a real tip is read from mempool.space.
 *
 * Zero dependencies, zero build step — drop-in for the static site.
 */
(function () {
  "use strict";

  // ── the math (bft.ts port) ────────────────────────────────────────────
  var BLOCKS_PER_DAY = 144;
  var BLOCKS_PER_MONTH = 4032; // 28 days · 2 difficulty epochs
  var BLOCKS_PER_YEAR = 52416; // 13 months · 26 difficulty epochs
  var GENESIS_MS = Date.UTC(2009, 0, 3); // 2009-01-03, block 0

  function pad(n, w) {
    return String(n).padStart(w, "0");
  }

  /** height → { year, month (1..13), day (1..28) } */
  function bft(height) {
    var rem = ((height % BLOCKS_PER_YEAR) + BLOCKS_PER_YEAR) % BLOCKS_PER_YEAR;
    return {
      year: Math.floor(height / BLOCKS_PER_YEAR),
      month: Math.floor(rem / BLOCKS_PER_MONTH) + 1,
      day: Math.floor((rem % BLOCKS_PER_MONTH) / BLOCKS_PER_DAY) + 1,
    };
  }

  /** Block-beat time of day, 24h face: "hh:mm" in steps of ten. */
  function bftTime(height) {
    var bid = ((height % BLOCKS_PER_DAY) + BLOCKS_PER_DAY) % BLOCKS_PER_DAY;
    return pad(Math.floor(bid / 6), 2) + ":" + pad((bid % 6) * 10, 2);
  }

  /** Genesis-anchored ~10-min/block estimate — always wears the ~. */
  function estimateHeight(nowMs) {
    return Math.max(0, Math.floor(((nowMs || Date.now()) - GENESIS_MS) / 600000));
  }

  // ── the tip (estimate first, real height when the network answers) ────
  var tip = { height: estimateHeight(), estimated: true };

  function refreshTip() {
    fetch("https://mempool.space/api/blocks/tip/height", { cache: "no-store" })
      .then(function (res) {
        return res.ok ? res.text() : null;
      })
      .then(function (text) {
        if (text == null) return;
        var h = parseInt(text.trim(), 10);
        if (isFinite(h) && h > 0) tip = { height: h, estimated: false };
        render();
      })
      .catch(function () {
        /* offline / blocked → the estimate keeps ticking, marked ~ */
        tip = { height: estimateHeight(), estimated: true };
        render();
      });
  }

  // ── the badge ─────────────────────────────────────────────────────────
  var css =
    ".bft-badge{position:fixed;bottom:12px;right:12px;z-index:1000;" +
    "background:rgba(5,5,5,.92);border:2px solid var(--cyan,#00FFFF);" +
    "box-shadow:4px 4px 0 var(--cyan,#00FFFF);padding:.5rem .7rem;" +
    "font-family:monospace;color:#fff;text-align:center;user-select:none;" +
    "backdrop-filter:blur(6px);line-height:1.35;font-size:11px}" +
    ".bft-badge .bft-head{font-family:var(--font-header,monospace);" +
    "font-size:7px;letter-spacing:.25em;text-transform:uppercase;" +
    "color:var(--cyan,#00FFFF);opacity:.8;margin-bottom:.25rem}" +
    ".bft-badge .bft-date{font-size:12px;color:rgba(255,255,255,.85);" +
    "font-variant-numeric:tabular-nums}" +
    ".bft-badge .bft-time{font-size:20px;color:#fff;" +
    "font-variant-numeric:tabular-nums}" +
    ".bft-badge .bft-colon{color:var(--cyan,#00FFFF);" +
    "animation:bft-blink 2s ease-in-out infinite}" +
    ".bft-badge .bft-sub{font-size:7px;color:rgba(255,255,255,.35);" +
    "font-variant-numeric:tabular-nums;margin-top:.15rem}" +
    "@keyframes bft-blink{0%,100%{opacity:1}50%{opacity:.35}}" +
    "@media (prefers-reduced-motion:reduce){.bft-badge .bft-colon{animation:none}}" +
    "@media (max-width:480px){.bft-badge{bottom:8px;right:8px;transform:scale(.9);transform-origin:bottom right}}";

  var el = null;

  function render() {
    if (!el) return;
    var h = tip.height;
    var d = bft(h);
    var hhmm = bftTime(h).split(":");
    var beat = ((h % BLOCKS_PER_DAY) + BLOCKS_PER_DAY) % BLOCKS_PER_DAY;
    el.innerHTML =
      '<div class="bft-head">⧗ BITCOIN TIME</div>' +
      '<div class="bft-date">' + pad(d.year, 4) + "." + pad(d.month, 2) + "." + pad(d.day, 2) + " a₿</div>" +
      '<div class="bft-time">' + hhmm[0] + '<span class="bft-colon">:</span>' + hhmm[1] + "</div>" +
      '<div class="bft-sub">beat ' + pad(beat, 3) + "/144 · ★" + (tip.estimated ? "~" : "") + h.toLocaleString() + "</div>";
    el.title =
      "Bitcoin Time Clock — the calendar that syncs to the block, not the sun. " +
      "144 blocks a day, 6 blocks an hour, ten minutes a block. " +
      (tip.estimated ? "~ marks a genesis-anchored estimate (network unreachable). " : "") +
      "Tick tock, it all comes back to the block.";
  }

  function mount() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    el = document.createElement("div");
    el.className = "bft-badge";
    el.setAttribute("aria-label", "Bitcoin time clock");
    document.body.appendChild(el);
    render();
    refreshTip();
    setInterval(function () {
      if (tip.estimated) {
        tip.height = estimateHeight();
        render();
      }
      refreshTip();
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
