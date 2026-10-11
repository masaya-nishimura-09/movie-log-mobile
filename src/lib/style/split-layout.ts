const outerPattern =
  /^(-?m[trblxy]?-|flex-(1|auto|initial|none)$|grow|shrink|self-|w-|min-w-|max-w-|basis-|order-)/;

export function splitLayout(className: string | undefined) {
  const outer: string[] = [];
  const inner: string[] = [];
  for (const token of (className ?? "").split(/\s+/).filter(Boolean)) {
    (outerPattern.test(token) ? outer : inner).push(token);
  }
  return { outer: outer.join(" "), inner: inner.join(" ") };
}
