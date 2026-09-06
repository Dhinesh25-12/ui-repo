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
  URL.revokeObjectURL(url);
}
