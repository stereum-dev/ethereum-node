import { ServiceVolume } from './ServiceVolume'

test('servicevolume', () => {
    expect(new ServiceVolume("/opt/stereum/foo", "/opt/app/data").buildVolumeMapping())
        .toBe("/opt/stereum/foo:/opt/app/data");
});
