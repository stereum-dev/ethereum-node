export function useDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function useTruncate(str, frontChars, endChars) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }

  if (str.length <= frontChars + endChars) {
    return str;
  }
  return `${str.substring(0, frontChars)} ... ${str.substring(str.length - endChars)}`;
}
