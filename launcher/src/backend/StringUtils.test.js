import { StringUtils } from "./StringUtils";

test('escapeStringForShell small json', () => {
    expect(StringUtils.escapeStringForShell(JSON.stringify({"foo": "bar", "xyz": 123}))).toEqual("\"{\\\"foo\\\":\\\"bar\\\",\\\"xyz\\\":123}\"");
});

test('escapeStringForShell simple String', () => {
    expect(StringUtils.escapeStringForShell("this is a test! \"wooo\"")).toEqual("\"this is a test! \\\"wooo\\\"\"");
});