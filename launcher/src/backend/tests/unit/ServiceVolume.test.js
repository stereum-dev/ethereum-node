import { ServiceVolume } from "../../ethereum-services/ServiceVolume";

test("servicevolume", () => {
  expect(new ServiceVolume("/opt/stereum/foo", "/opt/app/data").buildVolumeMapping()).toBe("/opt/stereum/foo:/opt/app/data");
});

test("buildByConfig", () => {
  const serviceVolume = ServiceVolume.buildByConfig("/opt/stereum/foo:/opt/app/data");

  expect(serviceVolume.destinationPath).toBe("/opt/stereum/foo");
  expect(serviceVolume.servicePath).toBe("/opt/app/data");
  expect(serviceVolume.bindOptions).toBeFalsy();
});

test("servicevolume bindOptions", () => {
  expect(new ServiceVolume("/", "/host", "ro,rslave").buildVolumeMapping()).toBe("/:/host:ro,rslave");
});

test("buildByConfig bindOptions", () => {
  const serviceVolume = ServiceVolume.buildByConfig("/opt/stereum/foo:/opt/app/data:ro,rslave");

  expect(serviceVolume.destinationPath).toBe("/opt/stereum/foo");
  expect(serviceVolume.servicePath).toBe("/opt/app/data");
  expect(serviceVolume.bindOptions).toBe("ro,rslave");
});

// EOF
