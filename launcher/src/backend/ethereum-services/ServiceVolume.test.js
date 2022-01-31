import { ServiceVolume } from './ServiceVolume'

test('servicevolume', () => {
    expect(new ServiceVolume("/opt/stereum/foo", "/opt/app/data").buildVolumeMapping())
        .toBe("/opt/stereum/foo:/opt/app/data");
});

test('buildByConfig', () => {
    const serviceVolume = ServiceVolume.buildByConfig("/opt/stereum/foo:/opt/app/data");

    expect(serviceVolume.destinationPath).toBe("/opt/stereum/foo");
    expect(serviceVolume.servicePath).toBe("/opt/app/data");
});

// EOF
