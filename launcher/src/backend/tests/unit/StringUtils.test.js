import { StringUtils } from "../../StringUtils";

test("escapeStringForShell small json", () => {
  expect(StringUtils.escapeStringForShell(JSON.stringify({ foo: "bar", xyz: 123 }))).toEqual('"{\\"foo\\":\\"bar\\",\\"xyz\\":123}"');
});

test("escapeStringForShell simple String", () => {
  expect(StringUtils.escapeStringForShell('this is a test! "wooo"')).toEqual('"this is a test! \\"wooo\\""');
});

test("escapeStringForShell new line", () => {
  expect(StringUtils.escapeStringForShell("this\nnext-line")).toEqual('"this\nnext-line"');
});
