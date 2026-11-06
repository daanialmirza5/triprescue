export function cn(...classes: (string | undefined | null | false | Record<string, boolean | undefined>)[]): string {
  return classes
    .filter(Boolean)
    .map((c) => {
      if (typeof c === 'string') return c;
      if (c && typeof c === 'object') {
        return Object.entries(c)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}
