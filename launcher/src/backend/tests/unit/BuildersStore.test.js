import { createPinia, setActivePinia } from "pinia";
import { epbsRelay, useBuilders } from "@/store/builders";
import { useNodeManage } from "@/store/nodeManage";

jest.mock("@/store/ControlService", () => ({ __esModule: true, default: {} }));

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

const TITAN = "https://0xaa@hoodi.titanrelay.xyz";
const NFLAIG = { name: "builder-hoodi.nflaig.dev", url: "https://builder-hoodi.nflaig.dev", authData: "" };

function setup(current) {
  return {
    saved: false,
    network: "hoodi",
    mevBoostRelays: [TITAN],
    mevBoostMinBid: "0.01",
    clients: [{ id: "nimbus" }],
    clusters: [{ id: "charon", current }],
  };
}

beforeEach(() => {
  setActivePinia(createPinia());
  useNodeManage().relaysList = [{ name: "Titan Relay", hoodi: TITAN, epbs: { hoodi: TITAN } }];
});

test("before the first save a cluster without builders in Charon's file starts from MEV-Boost", () => {
  const { builders } = useBuilders().draftFor(setup({ relays: [], minBid: "0", boostFactor: null }));
  expect(builders.clients.charon.relays.map((r) => r.url)).toEqual([TITAN]);
  expect(builders.clients.charon.minBid).toBe("0.01");
});

test("a cluster's builders in Charon's file win over the takeover, and once saved always", () => {
  const current = { relays: [NFLAIG], minBid: "0", boostFactor: 90 };
  expect(useBuilders().draftFor(setup(current)).builders.clients.charon.relays).toEqual([NFLAIG]);

  const saved = { ...setup({ relays: [], minBid: "0", boostFactor: null }), saved: true, builders: { route: "direct", clients: {} } };
  expect(useBuilders().draftFor(saved).builders.clients.charon.relays).toEqual([]);
});
