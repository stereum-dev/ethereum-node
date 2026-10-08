import { countOnChainKeys } from "@/composables/validators";

jest.mock("@/store/ControlService", () => ({}));

const vc = (serviceID, consensusClients) => ({ config: { serviceID, dependencies: { consensusClients } } });
const key = (validatorID, key) => ({ validatorID, key });

// A VC behind Charon holds shares of the cluster's validators, which Charon lists as the on-chain keys
test("key shares of a VC behind Charon are not counted", () => {
  const services = [
    vc("teku", [{ service: "CharonService", id: "charon" }]),
    vc("charon", [{ service: "TekuBeaconService", id: "beacon" }]),
  ];
  const keys = [key("teku", "0xshare1"), key("teku", "0xshare2"), key("charon", "0xdv1"), key("charon", "0xdv2")];

  expect(countOnChainKeys(keys, services)).toEqual(2);
});

test("keys of a solo VC are counted once even if listed twice", () => {
  const services = [vc("lighthouse", [{ service: "LighthouseBeaconService", id: "beacon" }])];
  const keys = [key("lighthouse", "0xa"), key("lighthouse", "0xa"), key("lighthouse", "0xb")];

  expect(countOnChainKeys(keys, services)).toEqual(2);
});
