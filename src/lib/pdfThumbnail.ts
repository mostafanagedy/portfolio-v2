declare global {
  interface Window {
    pdfjsLib?: any;
    __pdfjsLoadingPromise?: Promise<any>;
  }
}

/**
 * Loads Mozilla's PDF.js library dynamically in the browser.
 * This completely avoids Webpack / Node.js SSR attempting to bundle 'canvas'.
 */
export async function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be loaded in the browser");
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  if (window.__pdfjsLoadingPromise) {
    return window.__pdfjsLoadingPromise;
  }

  window.__pdfjsLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existing = document.querySelector('script[data-pdfjs="true"]');
    if (existing && window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.setAttribute("data-pdfjs", "true");

    const timer = setTimeout(() => {
      delete window.__pdfjsLoadingPromise;
      reject(new Error("Timeout loading PDF.js script"));
    }, 6000);

    script.onload = () => {
      clearTimeout(timer);
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib not found on window"));
      }
    };

    script.onerror = () => {
      clearTimeout(timer);
      delete window.__pdfjsLoadingPromise;
      reject(new Error("Failed to load PDF.js script"));
    };

    document.head.appendChild(script);
  });

  return window.__pdfjsLoadingPromise;
}

// Concurrency queue to avoid freezing browser when multiple cards enter viewport
type QueueTask = () => Promise<void>;
const renderQueue: QueueTask[] = [];
let activeRenders = 0;
const MAX_CONCURRENT_RENDERS = 2;

function processQueue() {
  if (activeRenders >= MAX_CONCURRENT_RENDERS || renderQueue.length === 0) {
    return;
  }
  const task = renderQueue.shift();
  if (task) {
    activeRenders++;
    task().finally(() => {
      activeRenders--;
      processQueue();
    });
  }
}

function enqueueRender<T>(renderFn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const task = async () => {
      try {
        const result = await renderFn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    renderQueue.push(task);
    processQueue();
  });
}

/**
 * Renders the first page of a PDF file to a high-quality WebP image data URL.
 * Includes concurrency limiter, sessionStorage caching, and strict timeout.
 */
export async function renderPdfFirstPage(
  pdfUrl: string,
  targetWidth = 420
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("renderPdfFirstPage can only run in the browser");
  }

  // 1. Check SessionStorage cache
  const storageKey = `cert_thumb_${pdfUrl}_w${targetWidth}`;
  try {
    const cached = sessionStorage.getItem(storageKey);
    if (cached) return cached;
  } catch (_) {
    // sessionStorage might be restricted or full
  }

  // 2. Enqueue rendering through concurrency limiter with a strict 5s timeout
  return enqueueRender(() => {
    return Promise.race([
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("PDF render timed out")), 5000)
      ),
      (async () => {
        const pdfjsLib = await loadPdfJs();

        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          disableFontFace: false,
          stopAtErrors: false,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Unable to create canvas 2d context");
        }

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const dataUrl = canvas.toDataURL("image/webp", 0.85);

        // Cache in SessionStorage if under quota
        try {
          sessionStorage.setItem(storageKey, dataUrl);
        } catch (_) {}

        return dataUrl;
      })(),
    ]);
  });
}
