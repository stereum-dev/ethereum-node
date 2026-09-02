import { storageValueToGiB } from "@/composables/utils";

// Sizes come from "du -csh" via Monitoring.getStorageStatus, which turns e.g.
// "1.2T" into "1.2 TB". They are divided by totalDisk, which "df --total -BG"
// reports in GiB, so every suffix has to land on the same scale.
test("converts every unit du can emit to GiB", () => {
  expect(storageValueToGiB("1 GB")).toBe(1);
  expect(storageValueToGiB("450 GB")).toBe(450);

  // the regression: TB used to fall through and be read as GB
  expect(storageValueToGiB("1 TB")).toBe(1024);
  expect(storageValueToGiB("1.2 TB")).toBeCloseTo(1228.8, 5);
  expect(storageValueToGiB("2 PB")).toBe(2 * 1024 * 1024);

  expect(storageValueToGiB("512 MB")).toBeCloseTo(0.5, 10);
  expect(storageValueToGiB("4.0 KB")).toBeCloseTo(4 / 1024 ** 2, 12);
  expect(storageValueToGiB("0 B")).toBe(0);
});

test("a terabyte is a thousandfold of a gigabyte, not equal to it", () => {
  expect(storageValueToGiB("1 TB")).toBeGreaterThan(storageValueToGiB("1 GB"));
  expect(storageValueToGiB("1 TB") / storageValueToGiB("1 GB")).toBe(1024);
});

test("accepts the shapes the backend actually produces", () => {
  // getStorageStatus inserts a single space before the unit, and emits "0 B"
  // for empty volumes
  expect(storageValueToGiB("0 B")).toBe(0);
  expect(storageValueToGiB("36 GB")).toBe(36);

  // some locales make du print a comma decimal mark
  expect(storageValueToGiB("1,5 TB")).toBe(1536);

  // case insensitive, tolerant of surrounding whitespace
  expect(storageValueToGiB(" 1 tb ")).toBe(1024);
});

test("returns 0 rather than NaN for anything unparseable", () => {
  for (const value of [undefined, null, "", "n/a", "GB", "1 ZB", "abc GB"]) {
    expect(storageValueToGiB(value)).toBe(0);
  }
});
