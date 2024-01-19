export function addRecursively(
  a: any = {},
  b: any,
  replacing: boolean = false,
) {
  for (const [key, value] of Object.entries(b)) {
    let _a = a[key];
    let _b = b[key];
    if (_a) {
      if (typeof _a === 'object' && !Array.isArray(_a)) {
        _a = addRecursively(_a, value, replacing);
      } else {
        if (replacing) {
          _a = value;
        } else if (Array.isArray(_a) && typeof _b === 'string') {
          _a.push(_b);
        } else {
          _a += value;
        }
      }
    } else {
      if (typeof _b === 'string') {
        _a = [_b];
      } else {
        _a = value;
      }
    }
    a[key] = _a;
  }
  return a;
}
