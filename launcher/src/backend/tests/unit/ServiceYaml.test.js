import { addCommandEntry, setEnvFlag } from "@/share/serviceYaml";

// Expert mode adds a flag the configuration does not carry yet behind the last
// one in the command list. Looking for that last flag in the whole file put it
// inside Lodestar's NODE_OPTIONS instead, because an env var can hold "--"
// values of its own and the env block comes after the command list.

const lodestar = `service: LodestarBeaconService
id: 6bc6f0d4-6df2-4d21-9a0d-b7a5e0b4a111
configVersion: 1
command:
  - beacon
  - --network=hoodi
  - --dataDir=/opt/app/beacon
entrypoint:
  - node
  - ./packages/cli/bin/lodestar
env:
  NODE_OPTIONS: --max-old-space-size=8192
image: chainsafe/lodestar:v1.46.0
`;

test("an entry is added behind the last one in the command list", () => {
  const result = addCommandEntry(lodestar, "--enr.ip=80.249.121.1");

  expect(result).toContain("  - --dataDir=/opt/app/beacon\n  - --enr.ip=80.249.121.1\nentrypoint:");
});

test("an entry never lands inside an env var that holds flags of its own", () => {
  const result = addCommandEntry(lodestar, "--enr.ip=80.249.121.1");

  expect(result).toContain("NODE_OPTIONS: --max-old-space-size=8192\n");
  expect(result).not.toMatch(/NODE_OPTIONS:.*--enr\.ip/);
  // and the command list is the only place it shows up
  expect(result.match(/--enr\.ip=80\.249\.121\.1/g)).toHaveLength(1);
});

test("the indentation of the command list is kept", () => {
  const result = addCommandEntry("command:\n    - --network=hoodi\nenv: {}\n", "--enr.ip=1.2.3.4");

  expect(result).toEqual("command:\n    - --network=hoodi\n    - --enr.ip=1.2.3.4\nenv: {}\n");
});

test("an entry that repeats an earlier one is still added at the end", () => {
  const result = addCommandEntry("command:\n  - --metrics\n  - --network=hoodi\n  - --metrics\nenv: {}\n", "--enr.ip=1.2.3.4");

  expect(result).toEqual("command:\n  - --metrics\n  - --network=hoodi\n  - --metrics\n  - --enr.ip=1.2.3.4\nenv: {}\n");
});

test("entries are inserted as text, not as a pattern", () => {
  const result = addCommandEntry("command:\n  - --Network.ExternalIp=1.2.3.4\nenv: {}\n", "--Pruning.Mode=Full");

  expect(result).toContain("  - --Pruning.Mode=Full\n");
});

test("a configuration without a command list cannot take an entry", () => {
  expect(addCommandEntry('service: ValidatorEjectorService\ncommand: []\nenv:\n  DRY_RUN: "false"\n', "--x=1")).toBeNull();
  expect(addCommandEntry("service: ValidatorEjectorService\nenv: {}\n", "--x=1")).toBeNull();
});

// A setting that lives inside an env var, such as Lodestar's heap size in
// NODE_OPTIONS, has to be addable to a service that does not carry it yet.

test("a flag is added to an env var that is already there", () => {
  const result = setEnvFlag("env:\n  NODE_OPTIONS: --trace-warnings\nimage: x\n", "NODE_OPTIONS", "--max-old-space-size=8192");

  expect(result).toEqual('env:\n  NODE_OPTIONS: "--trace-warnings --max-old-space-size=8192"\nimage: x\n');
});

test("quotes around an existing value are not doubled", () => {
  const result = setEnvFlag('env:\n  NODE_OPTIONS: "--trace-warnings"\n', "NODE_OPTIONS", "--max-old-space-size=8192");

  expect(result).toEqual('env:\n  NODE_OPTIONS: "--trace-warnings --max-old-space-size=8192"\n');
});

test("an empty env block becomes a block mapping to take the variable", () => {
  const result = setEnvFlag("service: LodestarValidatorService\nenv: {}\nimage: x\n", "NODE_OPTIONS", "--max-old-space-size=4096");

  expect(result).toEqual('service: LodestarValidatorService\nenv:\n  NODE_OPTIONS: "--max-old-space-size=4096"\nimage: x\n');
});

test("an env block with entries keeps them", () => {
  const result = setEnvFlag('env:\n  DRY_RUN: "false"\nimage: x\n', "NODE_OPTIONS", "--max-old-space-size=4096");

  expect(result).toEqual('env:\n  NODE_OPTIONS: "--max-old-space-size=4096"\n  DRY_RUN: "false"\nimage: x\n');
});

test("a configuration without an env block cannot take the variable", () => {
  expect(setEnvFlag("service: LodestarValidatorService\nimage: x\n", "NODE_OPTIONS", "--max-old-space-size=4096")).toBeNull();
});
