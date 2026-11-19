"use client";

import { useEffect, useRef } from "react";
import { Quicksand } from "next/font/google";
import styles from "./Hero.module.css";

// Huruf rounded dan ringan supaya tidak kaku. Ganti di sini kalau mau gaya lain.
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const TEXT = "KAFABIH";
const FONT_WEIGHT = 500;
const FONT_FAMILY = `${quicksand.style.fontFamily}, system-ui, sans-serif`;

// Jumlah partikel
const MAX_PARTICLES = 2000;
const MOBILE_PARTICLES = 1000;
const MOBILE_BREAKPOINT = 640;

// Performa
const MAX_DPR = 1.5;
const FRAME_INTERVAL = 1000 / 30;
const SAMPLE_STEP = 2; // grid sampling teks (px), hanya dipakai saat build

// Timing. progress bergerak linear 0..1, easing dilakukan per partikel.
const DURATION = 1.5; // detik dari teks ke sphere (dan sebaliknya)
const MAX_DELAY = 0.35; // jeda acak per partikel supaya terurai bertahap
const FADE = 0.2; // rentang progress untuk crossfade teks <-> partikel

// Sphere
const ROT_SPEED = 0.45; // rad/detik
const TILT = 0.35; // kemiringan sumbu putar (rad)
const PERSP = 0.28; // kekuatan perspektif
const WOBBLE = 2.2; // gerak organik (px)

// Visual
const LEVEL_ALPHA = [0.3, 0.5, 0.75, 1]; // opacity per level kedalaman
const GLOW_ALPHA = 0.1;
const GLOW_SCALE = 3.2;
const TINT_STEPS = 5; // tahap perubahan warna putih -> cyan/ungu
const LEVELS = LEVEL_ALPHA.length;
const BUCKETS = 2 * TINT_STEPS * LEVELS;
const WHITE = [248, 248, 242]; // warna awal partikel, selaras dengan teks

const TAU = Math.PI * 2;
const COS_TILT = Math.cos(TILT);
const SIN_TILT = Math.sin(TILT);
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Ubah warna CSS apa pun menjadi [r, g, b] lewat normalisasi bawaan canvas.
// Dipanggil hanya saat build.
function parseColor(
  c: CanvasRenderingContext2D,
  value: string,
  fallback: string
): [number, number, number] {
  c.fillStyle = fallback;
  c.fillStyle = value; // nilai tidak valid diabaikan, fallback tetap dipakai
  const s = String(c.fillStyle);

  if (s[0] === "#" && s.length === 7) {
    return [
      parseInt(s.slice(1, 3), 16),
      parseInt(s.slice(3, 5), 16),
      parseInt(s.slice(5, 7), 16),
    ];
  }

  const m = s.match(/\d+(\.\d+)?/g);
  if (m && m.length >= 3) {
    return [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])];
  }
  return [255, 255, 255];
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !ctx) return;

    // Canvas bantu untuk sampling bentuk huruf. Dipakai ulang di setiap build.
    const off = document.createElement("canvas");

    // ---- Layout (dihitung ulang hanya di build) ----
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let sizeScale = 1;
    let font = "";
    let haloWidth = 0;
    let fontsReady = false;
    let fallbackTimer = 0;
    let textFill: string | CanvasGradient = "#ffffff";
    let bucketColors: string[] = [];
    const starts = new Uint16Array(BUCKETS + 1);
    const cursor = new Uint16Array(BUCKETS);

    // ---- Data partikel (typed array, dialokasikan sekali per build) ----
    let n = 0;
    let tx = new Float32Array(0); // posisi di teks
    let ty = new Float32Array(0);
    let ux = new Float32Array(0); // posisi di sphere satuan
    let uy = new Float32Array(0);
    let uz = new Float32Array(0);
    let delay = new Float32Array(0);
    let swirl = new Float32Array(0);
    let phase = new Float32Array(0);
    let col = new Uint8Array(0);
    // Output per frame
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let sr = new Float32Array(0);
    let bucket = new Uint8Array(0); // indeks (warna, tahap tint, level kedalaman)
    let order = new Uint16Array(0); // urutan partikel per bucket

    // ---- State animasi ----
    let progress = 0; // 0 = teks solid, 1 = sphere penuh
    let time = 0;
    let rot = 0;
    let pointerHeld = false;
    let keyToggled = false;
    let wantSphere = false;

    let rafId = 0;
    let lastTs = 0;
    let resizeTimer = 0;
    let disposed = false;

    // ---------- Menggambar ----------

    const drawText = (alpha: number) => {
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Halo tipis di tepi huruf supaya terasa lembut, bukan blok solid
      ctx.lineJoin = "round";
      ctx.lineWidth = haloWidth;
      ctx.strokeStyle = "rgb(166, 226, 46)";
      ctx.globalAlpha = alpha * 0.16;
      ctx.strokeText(TEXT, cx, cy);

      ctx.fillStyle = textFill;
      ctx.globalAlpha = alpha * 0.94;
      ctx.fillText(TEXT, cx, cy);
      ctx.globalAlpha = 1;
    };

    // Partikel dikelompokkan per bucket (warna x tahap tint x kedalaman) lewat
    // counting sort tanpa alokasi, sehingga fill() per frame tetap sedikit.
    const drawParticles = (pa: number) => {
      starts.fill(0);
      for (let i = 0; i < n; i++) starts[bucket[i] + 1]++;
      for (let b = 0; b < BUCKETS; b++) starts[b + 1] += starts[b];
      for (let b = 0; b < BUCKETS; b++) cursor[b] = starts[b];
      for (let i = 0; i < n; i++) order[cursor[bucket[i]]++] = i;

      ctx.globalCompositeOperation = "lighter";

      for (let b = 0; b < BUCKETS; b++) {
        const from = starts[b];
        const to = starts[b + 1];
        if (from === to) continue;

        const level = b % LEVELS;
        ctx.fillStyle = bucketColors[(b / LEVELS) | 0];

        // Cahaya luar (tanpa shadowBlur)
        ctx.globalAlpha = GLOW_ALPHA * LEVEL_ALPHA[level] * pa;
        ctx.beginPath();
        for (let k = from; k < to; k++) {
          const i = order[k];
          const r = sr[i] * GLOW_SCALE;
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, TAU);
        }
        ctx.fill();

        // Inti partikel
        ctx.globalAlpha = LEVEL_ALPHA[level] * pa;
        ctx.beginPath();
        for (let k = from; k < to; k++) {
          const i = order[k];
          ctx.moveTo(sx[i] + sr[i], sy[i]);
          ctx.arc(sx[i], sy[i], sr[i], 0, TAU);
        }
        ctx.fill();
      }

      // Titik terang kecil hanya pada partikel paling depan
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.8 * pa;
      ctx.beginPath();
      for (let b = LEVELS - 1; b < BUCKETS; b += LEVELS) {
        for (let k = starts[b]; k < starts[b + 1]; k++) {
          const i = order[k];
          const r = sr[i] * 0.45;
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, TAU);
        }
      }
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const render = () => {
      if (width < 1 || height < 1) return;

      ctx.clearRect(0, 0, width, height);

      // fade = seberapa jauh teks sudah berganti menjadi partikel
      const fade = n === 0 ? 0 : Math.min(1, progress / FADE);

      if (fade < 1) drawText(1 - fade);
      if (fade <= 0) return;

      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const spanInv = 1 / (1 - MAX_DELAY);
      const breath = 1 + 0.025 * Math.sin(time * 1.1);
      const sphereRadius = radius * breath;
      const wobble = WOBBLE * sizeScale;
      const levelMax = LEVELS - 1;

      for (let i = 0; i < n; i++) {
        // Progress lokal + easing in-out cubic
        let local = (progress - delay[i]) * spanInv;
        local = local < 0 ? 0 : local > 1 ? 1 : local;
        let e: number;
        if (local < 0.5) {
          e = 4 * local * local * local;
        } else {
          const k = -2 * local + 2;
          e = 1 - (k * k * k) / 2;
        }

        // Putar sphere: sumbu Y, lalu miringkan terhadap sumbu X
        const x0 = ux[i];
        const y0 = uy[i];
        const z0 = uz[i];
        const rx = x0 * cosR + z0 * sinR;
        const rz = -x0 * sinR + z0 * cosR;
        const ry = y0 * COS_TILT - rz * SIN_TILT;
        const rz2 = y0 * SIN_TILT + rz * COS_TILT;

        const persp = 1 / (1 - rz2 * PERSP);
        const spx = cx + rx * sphereRadius * persp;
        const spy = cy + ry * sphereRadius * persp;

        // Lintasan melengkung dari teks ke sphere
        const dx = spx - tx[i];
        const dy = spy - ty[i];
        const arc = Math.sin(Math.PI * e) * swirl[i];

        // Gerak organik, hanya terasa saat mendekati bentuk sphere
        const wob = e * wobble;
        sx[i] =
          tx[i] + dx * e - dy * arc + Math.sin(time * 1.3 + phase[i]) * wob;
        sy[i] =
          ty[i] + dy * e + dx * arc + Math.cos(time * 1.1 + phase[i] * 1.7) * wob;

        // Kedalaman: 0 (belakang) .. 1 (depan)
        const d = (rz2 + 1) * 0.5;
        sr[i] = (1.3 * (1 - e) + (0.7 + 1.4 * d) * e) * sizeScale;

        const depthLevel = Math.min(levelMax, (d * (levelMax + 1)) | 0);
        const neutral = levelMax - 1;
        const level = (neutral + (depthLevel - neutral) * e + 0.5) | 0;

        // Warna: putih (seperti teks) -> cyan/ungu seiring menuju sphere
        const tint = (e * (TINT_STEPS - 1) + 0.5) | 0;
        bucket[i] = (col[i] * TINT_STEPS + tint) * LEVELS + level;
      }

      drawParticles(fade);
    };

    // ---------- Loop animasi ----------

    const frame = (ts: number) => {
      rafId = 0;
      if (disposed) return;

      // Batasi ke ~30 FPS
      if (ts - lastTs < FRAME_INTERVAL - 1) {
        rafId = requestAnimationFrame(frame);
        return;
      }

      const dt = lastTs === 0 ? 1 / 30 : Math.min((ts - lastTs) / 1000, 0.1);
      lastTs = ts;
      time += dt;

      const target = wantSphere ? 1 : 0;
      if (progress < target) {
        progress = Math.min(target, progress + dt / DURATION);
      } else if (progress > target) {
        progress = Math.max(target, progress - dt / DURATION);
      }

      if (progress > 0) rot += dt * ROT_SPEED * progress;

      render();

      // Loop berhenti sendiri saat kembali ke teks solid (idle)
      if (progress !== target || progress > 0) {
        rafId = requestAnimationFrame(frame);
      } else {
        lastTs = 0;
      }
    };

    const startLoop = () => {
      if (disposed || rafId !== 0) return;
      rafId = requestAnimationFrame(frame);
    };

    // ---------- Build (hanya saat ukuran berubah) ----------

    const build = () => {
      if (disposed || !fontsReady) return;

      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      // Ukuran belum valid (atau NaN): tunggu ResizeObserver
      if (!(w >= 1 && h >= 1)) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      width = w;
      height = h;
      cx = w / 2;
      cy = h / 2;

      const isMobile = w < MOBILE_BREAKPOINT;
      sizeScale = isMobile ? 0.85 : 1;
      radius = Math.min(Math.min(w, h) * 0.3, 220);

      // Warna dibaca sekali dari CSS variable, bukan setiap frame
      const cssVars = window.getComputedStyle(canvas.parentElement ?? canvas);
      const accents = [
        parseColor(ctx, cssVars.getPropertyValue("--dot").trim(), "#a6e22e"),
        parseColor(ctx, cssVars.getPropertyValue("--dot-hot").trim(), "#fd971f"),
      ];
      bucketColors = [];
      for (let c = 0; c < 2; c++) {
        for (let k = 0; k < TINT_STEPS; k++) {
          const t = k / (TINT_STEPS - 1);
          const r = Math.round(WHITE[0] + (accents[c][0] - WHITE[0]) * t);
          const g = Math.round(WHITE[1] + (accents[c][1] - WHITE[1]) * t);
          const b = Math.round(WHITE[2] + (accents[c][2] - WHITE[2]) * t);
          bucketColors.push(`rgb(${r}, ${g}, ${b})`);
        }
      }

      // Ukuran font: muat di lebar layar, dibatasi tinggi dan ukuran maksimum
      ctx.font = `${FONT_WEIGHT} 100px ${FONT_FAMILY}`;
      const measured = ctx.measureText(TEXT).width;
      if (!(measured > 0)) {
        n = 0;
        render();
        return;
      }

      const targetWidth = Math.min(w * (isMobile ? 0.88 : 0.78), 980);
      const size = Math.max(
        12,
        Math.min((100 * targetWidth) / measured, h * 0.3, 190)
      );
      font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
      haloWidth = size * 0.05;
      ctx.font = font;
      const textWidth = ctx.measureText(TEXT).width;

      const gradient = ctx.createLinearGradient(
        cx - textWidth / 2,
        0,
        cx + textWidth / 2,
        0
      );
      gradient.addColorStop(0, "#f8f8f2");
      gradient.addColorStop(0.5, "#e6e6d9");
      gradient.addColorStop(1, "#a6e22e");
      textFill = gradient;

      // Sampling bentuk huruf pada canvas bantu seukuran kotak teks saja
      const pad = size * 0.2;
      const bw = Math.ceil(textWidth + pad * 2);
      const bh = Math.ceil(size * 1.6);

      if (bw < 1 || bh < 1 || bw > 8192 || bh > 8192) {
        n = 0;
        render();
        return;
      }

      off.width = bw;
      off.height = bh;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) {
        n = 0;
        render();
        return;
      }

      offCtx.font = font;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";
      offCtx.fillText(TEXT, bw / 2, bh / 2);

      let data: Uint8ClampedArray;
      try {
        data = offCtx.getImageData(0, 0, bw, bh).data;
      } catch {
        n = 0;
        render();
        return;
      }

      const cols = Math.ceil(bw / SAMPLE_STEP);
      const rows = Math.ceil(bh / SAMPLE_STEP);
      const candidates = new Uint32Array(cols * rows);
      let count = 0;

      for (let gy = 0; gy < rows; gy++) {
        const py = Math.min(bh - 1, gy * SAMPLE_STEP);
        for (let gx = 0; gx < cols; gx++) {
          const px = Math.min(bw - 1, gx * SAMPLE_STEP);
          if (data[(py * bw + px) * 4 + 3] > 128) {
            candidates[count++] = gy * cols + gx;
          }
        }
      }

      if (count === 0) {
        n = 0;
        render();
        return;
      }

      n = Math.min(isMobile ? MOBILE_PARTICLES : MAX_PARTICLES, count);

      // Acak kandidat (partial Fisher-Yates) agar penyebarannya merata di huruf
      for (let i = 0; i < n; i++) {
        const j = i + Math.floor(Math.random() * (count - i));
        const t = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = t;
      }

      tx = new Float32Array(n);
      ty = new Float32Array(n);
      ux = new Float32Array(n);
      uy = new Float32Array(n);
      uz = new Float32Array(n);
      delay = new Float32Array(n);
      swirl = new Float32Array(n);
      phase = new Float32Array(n);
      col = new Uint8Array(n);
      sx = new Float32Array(n);
      sy = new Float32Array(n);
      sr = new Float32Array(n);
      bucket = new Uint8Array(n);
      order = new Uint16Array(n);

      const originX = cx - bw / 2;
      const originY = cy - bh / 2;

      for (let i = 0; i < n; i++) {
        const id = candidates[i];
        const gx = id % cols;
        const gy = (id / cols) | 0;
        tx[i] = originX + gx * SAMPLE_STEP + Math.random() * SAMPLE_STEP;
        ty[i] = originY + gy * SAMPLE_STEP + Math.random() * SAMPLE_STEP;

        // Titik Fibonacci di permukaan bola, sedikit dijitter agar organik
        const y = 1 - (2 * (i + 0.5)) / n;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const angle = i * GOLDEN_ANGLE;
        const jitter = 1 + (Math.random() - 0.5) * 0.06;
        ux[i] = Math.cos(angle) * ring * jitter;
        uy[i] = y * jitter;
        uz[i] = Math.sin(angle) * ring * jitter;

        delay[i] = Math.random() * MAX_DELAY;
        swirl[i] = (Math.random() - 0.5) * 0.5;
        phase[i] = Math.random() * TAU;

        // Gradasi cyan -> ungu mengikuti sumbu vertikal, dengan campuran acak
        const mix = (y * 0.5 + 0.5) * 0.65 + Math.random() * 0.35;
        col[i] = mix > 0.5 ? 1 : 0;
      }

      render();
      if (progress !== (wantSphere ? 1 : 0) || progress > 0) startLoop();
    };

    // ---------- Interaksi ----------

    const syncTarget = () => {
      wantSphere = pointerHeld || keyToggled;
      canvas.setAttribute("aria-pressed", String(wantSphere));
      startLoop();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      event.preventDefault();

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture bisa gagal jika pointer sudah tidak aktif.
      }

      pointerHeld = true;
      syncTarget();
    };

    const handlePointerEnd = () => {
      if (!pointerHeld) return;
      pointerHeld = false;
      syncTarget();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      event.preventDefault(); // cegah halaman scroll saat menekan Space
      if (event.repeat) return;
      keyToggled = !keyToggled;
      syncTarget();
    };

    const handleContextMenu = (event: Event) => {
      event.preventDefault(); // tekan lama di mobile tidak membuka menu
    };

    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      if (w < 1 || h < 1 || (w === width && h === height)) return;

      if (width === 0) {
        build(); // ukuran valid pertama kali
        return;
      }

      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 120);
    });

    observer.observe(canvas);

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerEnd);
    canvas.addEventListener("lostpointercapture", handlePointerEnd);
    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("contextmenu", handleContextMenu);

    // Tunggu font siap supaya teks tidak berganti bentuk setelah tampil.
    // Jika font gagal dimuat, tetap lanjut memakai font cadangan.
    const markFontsReady = () => {
      if (disposed || fontsReady) return;
      fontsReady = true;
      window.clearTimeout(fallbackTimer);
      build(); // jika ukuran masih 0, ResizeObserver akan memanggilnya nanti
    };

    const fontSet = document.fonts;
    if (fontSet && typeof fontSet.load === "function") {
      fontSet
        .load(`${FONT_WEIGHT} 100px ${FONT_FAMILY}`)
        .then(markFontsReady, markFontsReady);
      fallbackTimer = window.setTimeout(markFontsReady, 1500);
    } else {
      markFontsReady();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      rafId = 0;
      window.clearTimeout(resizeTimer);
      window.clearTimeout(fallbackTimer);
      observer.disconnect();

      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerEnd);
      canvas.removeEventListener("lostpointercapture", handlePointerEnd);
      canvas.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);

      off.width = 0;
      off.height = 0;
    };
  }, []);

  return (
    <section
      className={styles.hero}
      style={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "calc(100svh - 64px)",
        minHeight: "520px",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          // pan-y: tahan tanpa bergerak = sphere, geser vertikal = scroll halaman
          touchAction: "pan-y",
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        role="button"
        tabIndex={0}
        aria-pressed={false}
        aria-label="Hold to transform KAFABIH into a particle sphere"
      />
    </section>
  );
}