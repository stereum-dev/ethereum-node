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

// "du -h" reports binary units, which Monitoring.getStorageStatus labels
// B/KB/MB/GB/TB/PB. Sizes are compared against totalDisk, which comes from
// "df --total -BG" and is therefore in GiB, so everything is converted to GiB
// here. The ladder has to cover every suffix: a missing one silently reads
// e.g. "1.2 TB" as 1.2 GB, which is a thousandfold understatement.
const GIB_PER_UNIT = {
  B: 1 / 1024 ** 3,
  KB: 1 / 1024 ** 2,
  MB: 1 / 1024,
  GB: 1,
  TB: 1024,
  PB: 1024 ** 2,
};

/**
 * @param {string} storageValue - a size such as "1.2 TB" or "450 GB"
 * @returns {number} the size in GiB, or 0 if it cannot be parsed
 */
export function storageValueToGiB(storageValue) {
  // some locales make "du -h" print "1,2T", so accept a comma decimal mark
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*([KMGTP]?B)\s*$/i.exec(storageValue ?? "");
  if (!match) return 0;
  return parseFloat(match[1].replace(",", ".")) * GIB_PER_UNIT[match[2].toUpperCase()];
}
