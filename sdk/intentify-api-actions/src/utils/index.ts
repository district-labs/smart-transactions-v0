export function addExpandParamsToUrl(
  url: URL,
  expand: Record<string, boolean> | undefined,
) {
  if (expand) {
    for (const [key, value] of Object.entries(expand)) {
      if (value) {
        url.searchParams.append("expand", key);
      }
    }
  }

  return url;
}
