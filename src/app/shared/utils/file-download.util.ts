/**
 * Triggers a browser download for the given blob by creating a temporary
 * object URL and anchor element. Used for authenticated file downloads where
 * the blob is retrieved via HttpClient (so the auth interceptor can attach
 * the bearer token) instead of a plain `<a href>` navigation.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking the object URL synchronously (or too soon) can abort the
  // download before the browser has finished reading the blob, producing a
  // truncated/corrupt file that downloads but won't open. Defer the revoke
  // so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
