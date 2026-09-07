import { createPinia, setActivePinia } from "pinia";
import { useServices } from "@/store/services";

// Lodestar's heap is set through NODE_OPTIONS in MB, and the option offers it in
// whole GB. These cover the pattern's side of that conversion the way
// ExpertWindow uses it: group 2 is read for the dropdown and replaced on write,
// so everything else the variable holds has to survive untouched.

let option;

beforeEach(() => {
  setActivePinia(createPinia());
  option = useServices()
    .allServices.find((s) => s.service === "LodestarBeaconService")
    .expertOptions.find((o) => o.commands?.[0] === "--max-old-space-size=");
});

const config = (env) => `service: LodestarBeaconService
command:
  - beacon
  - --network=hoodi
env:
${env}
image: chainsafe/lodestar:v1.46.0
`;

// what ExpertWindow's select branch does, so the option is exercised as used
const read = (yaml) => {
  const match = yaml.match(new RegExp(option.pattern[0]));
  return match ? Number(match[2]) / option.unitFactor : "";
};
const write = (yaml, gb) => yaml.replace(new RegExp(option.pattern[0]), `$1${gb * option.unitFactor}$3`);

test("the heap size is read as GB and written back as MB", () => {
  const yaml = config("  NODE_OPTIONS: --max-old-space-size=8192");

  expect(read(yaml)).toEqual(8);
  expect(write(yaml, 16)).toContain("NODE_OPTIONS: --max-old-space-size=16384\n");
});

test("a quoted value keeps its quotes", () => {
  const yaml = config('  NODE_OPTIONS: "--max-old-space-size=8192"');

  expect(read(yaml)).toEqual(8);
  expect(write(yaml, 4)).toContain('NODE_OPTIONS: "--max-old-space-size=4096"\n');
});

test("other node options are left alone", () => {
  const yaml = config("  NODE_OPTIONS: --dns-result-order=ipv4first --max-old-space-size=8192 --trace-warnings");

  expect(read(yaml)).toEqual(8);
  expect(write(yaml, 12)).toContain("NODE_OPTIONS: --dns-result-order=ipv4first --max-old-space-size=12288 --trace-warnings\n");
});

test("other env vars are left alone", () => {
  const yaml = config('  NODE_OPTIONS: --max-old-space-size=8192\n  SOME_OTHER: "--max-old-space-size=1"');

  expect(write(yaml, 2)).toContain("NODE_OPTIONS: --max-old-space-size=2048\n");
  expect(write(yaml, 2)).toContain('SOME_OTHER: "--max-old-space-size=1"');
});

test("every offered size converts to whole MB", () => {
  for (const gb of option.value) {
    expect(gb * option.unitFactor).toEqual(Math.round(gb * option.unitFactor));
  }
});

test("a configuration without the flag does not match, so it has to be added", () => {
  expect(read(config("  NODE_OPTIONS: --trace-warnings"))).toEqual("");
  expect(read(config('  DRY_RUN: "false"'))).toEqual("");
  expect("service: LodestarValidatorService\nenv: {}\n".match(new RegExp(option.pattern[0]))).toBeNull();
});
