export function useDeepClone(obj) {
  if (obj) return JSON.parse(JSON.stringify(obj));
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

export function saveToFile(fileName, fileContent, fileType = "text/plain") {
  const blob = new Blob([fileContent], { type: fileType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
