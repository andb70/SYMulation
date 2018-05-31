
export class JUtil {
private static i = 0;
private constructor() {
  JUtil.i = 0;
}
public static getUID() {
  return ++JUtil.i;
}
public static  circularJSONStringify(obj) {
    const cache = [];
    const result = JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache.length = 0;
    return result;
  }
}
