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
    // Check if already in DOM
    const existing = document.querySelector('script[data-pdfjs="true"]');
    if (existing && window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.setAttribute("data-pdfjs", "true");

    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib not found on window"));
      }
    };

    script.onerror = () => {
      delete window.__pdfjsLoadingPromise;
      reject(new Error("Failed to load PDF.js script"));
    };

    document.head.appendChild(script);
  });

  return window.__pdfjsLoadingPromise;
}

/**
 * Renders the first page of a PDF file to a high-quality WebP image data URL.
 */
export async function renderPdfFirstPage(
  pdfUrl: string,
  targetWidth = 420
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("renderPdfFirstPage can only run in the browser");
  }

  const pdfjsLib = await loadPdfJs();

  const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
    cMapPacked: true,
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

  return canvas.toDataURL("image/webp", 0.85);
}
