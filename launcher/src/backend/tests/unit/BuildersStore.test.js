jest.mock("@/store/ControlService", () => ({ __esModule: true, default: {} }));
import { epbsRelay } from "@/store/builders";

const ultrasound = { name: "Ultra sound money", hoodi: "https://0xb1@relay-hoodi.ultrasound.money" };

test("a listed relay serves ePBS at its listed address, or at its MEV-Boost host once the live check found it answering", () => {
  expect(epbsRelay(ultrasound, "hoodi")).toBeNull();
  expect(epbsRelay(ultrasound, "hoodi", { "https://relay-hoodi.ultrasound.money": { result: "no" } })).toBeNull();
  expect(epbsRelay(ultrasound, "hoodi", { "https://relay-hoodi.ultrasound.money": { result: "ready" } })).toEqual({
    name: "Ultra sound money",
    url: "https://relay-hoodi.ultrasound.money",
    authData: "",
  });
  expect(epbsRelay({ ...ultrasound, epbs: { hoodi: "https://epbs.example" } }, "hoodi").url).toBe("https://epbs.example");
  expect(epbsRelay(ultrasound, "mainnet", { "https://relay-hoodi.ultrasound.money": { result: "ready" } })).toBeNull();
});
