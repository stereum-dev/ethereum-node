import axios from "axios";
import { NodeUpdates } from "../../NodeUpdates.js";

jest.mock("axios");
jest.mock("electron-log", () => ({ error: jest.fn(), info: jest.fn(), debug: jest.fn() }));

const MAIN = "ee737d101e43fc1b229c71099a7305f4feee010c";
const release = { name: "2.6.0", commit: "1111111111111111111111111111111111111111" };

function nodeUpdates(updates, lsRemote = `${MAIN}\trefs/heads/main\n`) {
  const exec = jest.fn(async () => ({ rc: 0, stdout: lsRemote, stderr: "" }));
  const nodeConnection = {
    sshService: { exec },
    findStereumSettings: jest.fn(async function () {
      this.settings = { stereum: { settings: { updates } } };
    }),
  };
  return { updates: new NodeUpdates(nodeConnection), exec };
}

beforeEach(() => {
  global.branch = undefined;
  axios.get.mockResolvedValue({ data: { stereum: [release] } });
});

test("without a node version the latest release is the target", async () => {
  const { updates, exec } = nodeUpdates({ lane: "stable" });
  expect((await updates.checkUpdates()).stereum.at(-1)).toEqual(release);
  expect(exec).not.toHaveBeenCalled();
});

test("node_version follows the branch's current commit", async () => {
  const { updates, exec } = nodeUpdates({ lane: "stable", node_version: "main" });
  expect((await updates.checkUpdates()).stereum.at(-1)).toEqual({ name: "main", commit: MAIN });
  expect(exec.mock.calls[0][0]).toBe('git ls-remote https://github.com/stereum-dev/ethereum-node.git "main"');
});

test("a node version that is no branch or tag is taken as it is", async () => {
  const { updates } = nodeUpdates({ node_version: "aae4cce8ad8a93c74b4aeb2f1692171a7d01b106" }, "");
  expect((await updates.checkUpdates()).stereum.at(-1).commit).toBe("aae4cce8ad8a93c74b4aeb2f1692171a7d01b106");
});
