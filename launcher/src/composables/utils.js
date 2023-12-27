export function useDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}