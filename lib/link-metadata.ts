export const ACCESS_ERROR = "We couldn’t access this post. Upload a screenshot instead.";
export class LinkError extends Error {}
const LIMIT = 1024 * 1024;
export function publicUrl(value: string): URL {
  let url: URL;
  try { url = new URL(value); } catch { throw new LinkError("Enter a valid HTTPS link."); }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) throw new LinkError("Only public HTTPS links on the standard port are supported.");
  // Reject literal IPs entirely, including URL-normalized decimal/hex IPv4 and IPv6.
  if (!host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":") || /(^|\.)(localhost|local|internal|lan|home|test|invalid)$/.test(host)) throw new LinkError("Local and private-network links are not allowed.");
  url.hostname = host;
  url.hash = "";
  return url;
}
export function publicAddress(ip: string): boolean {
  if (ip.includes(":")) {
    // Only global unicast; exclude transition, documentation and special ranges.
    return /^[23][0-9a-f]{3}:/i.test(ip) && !/^(2001:|2002:|3fff:)/i.test(ip);
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a,b,c] = parts;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113));
}
export async function limitedText(response: Response, signal: AbortSignal): Promise<string> {
  if (Number(response.headers.get("content-length")) > LIMIT) { await response.body?.cancel(); throw new LinkError("This page is too large. Upload a screenshot instead."); }
  const reader = response.body?.getReader();
  if (!reader) return "";
  let size = 0; let text = ""; const decoder = new TextDecoder();
  const abort = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener("abort", abort, { once: true });
  try {
    while (true) {
      signal.throwIfAborted();
      const { value, done } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      size += value.byteLength;
      if (size > LIMIT) { await reader.cancel(); throw new LinkError("This page is too large. Upload a screenshot instead."); }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { signal.removeEventListener("abort", abort); reader.releaseLock(); }
}
async function checkDns(url: URL, signal: AbortSignal) {
  const results = await Promise.all(["A", "AAAA"].map(async type => {
    let response: Response | undefined;
    for (const resolver of ["https://cloudflare-dns.com/dns-query", "https://dns.google/resolve"]) {
      try {
        const candidate = await fetch(`${resolver}?name=${encodeURIComponent(url.hostname)}&type=${type}`, { headers: { accept: "application/dns-json" }, signal, redirect: "manual" });
        if (candidate.ok) { response = candidate; break; }
        await candidate.body?.cancel();
      } catch { signal.throwIfAborted(); }
    }
    if (!response) throw new LinkError("The server couldn’t verify this link’s public address. Try again shortly.");
    const data = JSON.parse(await limitedText(response, signal)) as { Status?: number; Answer?: { type: number; data: string }[] };
    if (data.Status !== 0) throw new LinkError(ACCESS_ERROR);
    return (data.Answer || []).filter(a => a.type === 1 || a.type === 28).map(a => a.data);
  }));
  const addresses = results.flat();
  if (!addresses.length || addresses.some(ip => !publicAddress(ip))) throw new LinkError("Local and private-network links are not allowed.");
}
const isHost = (url: URL, host: string) => url.hostname === host || url.hostname.endsWith(`.${host}`);
export const TIKTOK_ACCESS_ERROR = "We couldn’t access this TikTok post. It may be private, deleted, age-restricted, or unavailable. Upload a screenshot instead.";
function tikTokUrl(url: URL): URL {
  const safe = publicUrl(url.href);
  if (!isHost(safe, "tiktok.com")) throw new LinkError("TikTok redirects must stay on TikTok HTTPS domains. Upload a screenshot instead.");
  return safe;
}
function videoUrl(url: URL): URL | null {
  if (!isHost(url, "tiktok.com") || !/^\/@[^/]+\/video\/\d+\/?$/.test(url.pathname)) return null;
  const canonical = new URL(url.href); canonical.search = ""; canonical.hash = "";
  return canonical;
}
async function safePage(initial: URL, signal: AbortSignal, tikTokOnly = false, resolveVideo = false): Promise<{ response: Response; url: URL }> {
  let url = initial;
  for (let hop = 0; hop < 5; hop++) {
    if (tikTokOnly) tikTokUrl(url);
    await checkDns(url, signal);
    if (resolveVideo && videoUrl(url)) return { response: new Response(null), url: videoUrl(url)! };
    // Workers' public fetch transport is used, never a VPC/service binding or a local socket.
    const response = await fetch(url.href, { redirect: "manual", signal, headers: { accept: "text/html,application/json", "user-agent": "FeedForward/1.0 (public metadata preview)" } }).catch(() => { throw new LinkError("The server couldn’t establish a secure connection to this page. Try again or upload a screenshot."); });
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get("location"); await response.body?.cancel();
      if (!location) throw new LinkError(ACCESS_ERROR);
      url = publicUrl(new URL(location, url).href);
      if (tikTokOnly) tikTokUrl(url);
      continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new LinkError(ACCESS_ERROR); }
    return { response, url };
  }
  throw new LinkError(ACCESS_ERROR);
}
export type LinkMetadata = { title: string; description: string; author: string; image: string; url: string; originalUrl?: string };
export async function extractMetadata(raw: string): Promise<LinkMetadata> {
  const initial = publicUrl(raw);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const signal = controller.signal;
  let stage = "fetch";
  try {
    const target = initial;
    if (isHost(initial, "tiktok.com")) {
      try {
        let finalUrl = videoUrl(initial);
        if (!finalUrl) {
          const resolved = await safePage(initial, signal, true, true);
          await resolved.response.body?.cancel();
          finalUrl = videoUrl(resolved.url);
        }
        if (!finalUrl) throw new LinkError(TIKTOK_ACCESS_ERROR);
        const { response } = await safePage(publicUrl(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl.href)}`), signal, true);
        const data: unknown = JSON.parse(await limitedText(response, signal));
        if (!data || typeof data !== "object" || !("title" in data) || typeof data.title !== "string" || !data.title.trim()) throw new LinkError(TIKTOK_ACCESS_ERROR);
        const post = data as Record<string, unknown>;
        return { title: data.title.slice(0, 4000), description: "", author: typeof post.author_name === "string" ? post.author_name.slice(0, 500) : "", image: imageUrl(post.thumbnail_url, finalUrl), url: finalUrl.href, originalUrl: initial.href };
      } catch (error) {
        if (error instanceof LinkError && error.message !== ACCESS_ERROR) throw error;
        throw new LinkError(TIKTOK_ACCESS_ERROR);
      }
    }
    const { response, url } = await safePage(target, signal);
    if (!response.headers.get("content-type")?.includes("text/html")) { await response.body?.cancel(); throw new LinkError("This link isn’t a public web page. Upload a screenshot instead."); }
    const html = await limitedText(response, signal);
    stage = "parse";
    const fields: Record<string,string> = {};
    // Parse server-side only. No external scripts, images, or HTML are sent to the browser.
    const parser = new HTMLRewriter().on("meta", { element(element) {
      const name = (element.getAttribute("property") || element.getAttribute("name") || "").toLowerCase();
      if (["og:title","og:description","og:image","description","author"].includes(name) && !fields[name]) fields[name] = (element.getAttribute("content") || "").slice(0, 4000);
    }}).on("title", { text(chunk) { fields.title = ((fields.title || "") + chunk.text).slice(0, 4000); } });
    await parser.transform(new Response(html)).text();
    const title = fields["og:title"] || fields.title || "";
    const description = fields["og:description"] || fields.description || "";
    if (!title.trim() || (isHost(initial, "instagram.com") && (!fields["og:title"] || !description || /log in|login|sign up|page isn.t available|private account/i.test(title + " " + description) || /accounts\/login|challenge/.test(url.pathname)))) throw new LinkError(ACCESS_ERROR);
    return { title, description, author: fields.author || "", image: imageUrl(fields["og:image"], url), url: url.href };
  } catch (error) {
    if (signal.aborted) throw new LinkError("This link took too long to load. Try again or upload a screenshot.");
    if (error instanceof LinkError) throw error;
    console.error("Link metadata failed", {stage, name: error instanceof Error ? error.name : "Unknown"});
    throw new LinkError(stage === "parse" ? "The server couldn’t read this page’s metadata. Upload a screenshot instead." : "The server couldn’t connect to this page. Try again or upload a screenshot.");
  } finally { clearTimeout(timeout); }
}
function imageUrl(value: unknown, base: URL): string {
  if (typeof value !== "string" || !value) return "";
  try { return publicUrl(new URL(value, base).href).href; } catch { return ""; }
}
