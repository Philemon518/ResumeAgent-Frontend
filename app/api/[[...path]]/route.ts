import { type NextRequest } from "next/server";
import { normalizeApiBase } from "../../../lib/apiBase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const UPSTREAM = normalizeApiBase(
  process.env.API_INTERNAL_URL || "http://127.0.0.1:8000",
);

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  const { path = [] } = await context.params;
  const target = `${UPSTREAM}/${path.join("/")}${request.nextUrl.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    // Required so Node can stream the multipart CV without buffering it to disk.
    (init as RequestInit & { duplex: "half" }).duplex = "half";
  }
  const upstream = await fetch(target, init);
  const out = new Headers(upstream.headers);
  out.delete("content-encoding");
  if (request.method === "GET" || request.method === "HEAD") {
    out.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
