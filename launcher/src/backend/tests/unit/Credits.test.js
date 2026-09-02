import { ServiceManager } from "../../ServiceManager";

jest.mock("axios");
const axios = require("axios");

// SettingScreen checks Array.isArray on these, so returning undefined made it
// log "fetchTesters did not return an array" for what is really just an
// unreachable endpoint. Both credits URLs currently answer 404.
const CREDITS = [
  { name: "fetchTranslators", key: "translators" },
  { name: "fetchGitHubTesters", key: "testers" },
];

beforeEach(() => {
  jest.resetAllMocks();
});

describe.each(CREDITS)("$name", ({ name, key }) => {
  const call = () => new ServiceManager()[name]();

  test("maps the payload when the endpoint answers", async () => {
    axios.get.mockResolvedValue({
      data: { data: { [key]: [{ username: "someone", avatarUrl: "http://avatar", testsCount: 3 }] } },
    });

    const result = await call();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toMatch("someone");
    expect(result[0].avatar).toMatch("http://avatar");
  });

  test("returns an empty array rather than undefined when it 404s", async () => {
    axios.get.mockRejectedValue(new Error("Request failed with status code 404"));

    await expect(call()).resolves.toEqual([]);
  });

  test("returns an empty array when the payload is not the shape expected", async () => {
    axios.get.mockResolvedValue({ data: {} });

    await expect(call()).resolves.toEqual([]);
  });
});
