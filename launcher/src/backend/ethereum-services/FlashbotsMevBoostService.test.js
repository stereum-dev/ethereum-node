import { MevboostService } from './FlashbotsMevBoostService.js'

test('buildConfiguration', () => {
  const mbService = MevboostService.buildByUserInput().buildConfiguration()

  expect(mbService.image).toMatch(/flashbots\/mev-boost/)
})

test('buildByConfiguration', () => {
  const mb = MevboostService.buildByConfiguration({
    id: '124',
    service: 'MevboostService',
    configVersion: 655,
    image: 'flashbots/mev-boost:v0.8.2',
    volumes: ['/opt/stereum/foo:/opt/app/data']
  })

  expect(mb.id).toBe('124')
  expect(mb.service).toBe('MevboostService')
  expect(mb.configVersion).toBe(655)
  expect(mb.image).toBe('flashbots/mev-boost')
  expect(mb.imageVersion).toBe('v0.8.2')
  expect(mb.volumes).toHaveLength(1)
  expect(mb.volumes[0]).toBeDefined()
})