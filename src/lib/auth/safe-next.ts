// Only known in-app paths can be used after authentication.
export function safeNext(path: string | undefined, fallback = "/search") {
  return path &&
    /^\/(listings\/[\w-]+|messages|my-listings|saved)(\?[^\\#]*)?$/.test(path)
    ? path
    : fallback;
}
