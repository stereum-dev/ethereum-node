import { serivceState, ServiceManager } from './ServiceManager'
import { NodeConnection } from './NodeConnection'

test('manageServiceState success', async () => {
  jest.mock('./NodeConnection')
  const NodeConnection = require('./NodeConnection')
  const mMock = jest.fn((pb, args) => {
    return new Promise(async (resolve, reject) => {
      resolve({
        playbook: pb,
        playbookRunRef: 'asdf'
      })
    })
  })
  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      runPlaybook: mMock
    }
  })

  const sm = new ServiceManager(NodeConnection.NodeConnection())

  await expect(sm.manageServiceState('123', serivceState.restarted)).resolves.toEqual({
    playbook: 'restarting Service',
    playbookRunRef: 'asdf'
  })

  expect(mMock.mock.calls[0][0]).toMatch(/restarting Service/)
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.configuration.id).toMatch(/123/)
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.state).toMatch(serivceState.restarted)
})

test('manageServiceState failure', async () => {
  jest.mock('./NodeConnection')
  const NodeConnection = require('./NodeConnection')
  const mMock = jest.fn((pb, args) => {
    return new Promise(async (resolve, reject) => {
      reject('error321')
    })
  })
  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      runPlaybook: mMock
    }
  })

  const sm = new ServiceManager(NodeConnection.NodeConnection())

  await expect(sm.manageServiceState('123', serivceState.started)).rejects.toMatch(/error321/)

  expect(mMock.mock.calls[0][0]).toMatch(/starting Service/)
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.configuration.id).toMatch(/123/)
  expect(mMock.mock.calls[0][1].stereum_args.manage_service.state).toMatch(serivceState.started)
})

test('readServiceConfigurations success', async () => {
  jest.mock('./NodeConnection')
  const NodeConnection = require('./NodeConnection')
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise(async (resolve, reject) => {
      resolve(['first', 'second'])
    })
  })
  const readServiceConfigurationMock = jest.fn().mockReturnValueOnce(new Promise(async (resolve, reject) => {
    return resolve({
      service: 'LighthouseBeaconService',
      id: 'first'
    })
  })).mockReturnValueOnce(new Promise(async (resolve, reject) => {
    return resolve({
      service: 'LighthouseValidatorService',
      id: 'second'
    })
  }))

  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: listServicesConfigurationsMock,
      readServiceConfiguration: readServiceConfigurationMock
    }
  })

  const sm = new ServiceManager(NodeConnection.NodeConnection())

  const serviceConfigs = await sm.readServiceConfigurations()

  expect(serviceConfigs.length).toBe(2)

  expect(serviceConfigs[0].service).toEqual('LighthouseBeaconService')
  expect(serviceConfigs[0].id).toEqual('first')

  expect(serviceConfigs[1].service).toEqual('LighthouseValidatorService')
  expect(serviceConfigs[1].id).toEqual('second')
})

test('readServiceConfigurations success empty', async () => {
  jest.mock('./NodeConnection')
  const NodeConnection = require('./NodeConnection')
  const listServicesConfigurationsMock = jest.fn(() => {
    return new Promise(async (resolve, reject) => {
      resolve(new Array())
    })
  })

  NodeConnection.NodeConnection.mockImplementation(() => {
    return {
      listServicesConfigurations: listServicesConfigurationsMock
    }
  })

  const sm = new ServiceManager(NodeConnection.NodeConnection())

  const serviceConfigs = await sm.readServiceConfigurations()

  expect(serviceConfigs.length).toBe(0)
})

test('removeConnection String', () => {
  const command = `/app/cmd/validator/validator --accept-terms-of-use=true
  --beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000"
  --beacon-rpc-gateway-provider=stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500
  --web --prater=true --datadir=/opt/app/data/db
  --wallet-dir=/opt/app/data/wallets
  --wallet-password-file=/opt/app/data/passwords/wallet-password
  --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0
  --grpc-gateway-corsdomain="*"  --monitoring-host=0.0.0.0
  --monitoring-port=8081
  --suggested-fee-recipient=0x0000000000000000000000000000000000000000
  --graffiti-file=/opt/app/graffitis/graffitis.yaml`
  const id = '42d9f0b4-257f-f71e-10fe-66c342dd4995'

  const sm = new ServiceManager()
  const result = sm.removeCommandConnection(command, id)
  
  expect(result).not.toMatch(/--beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000"/)
  expect(result).not.toMatch(/--beacon-rpc-gateway-provider=stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500/)
  expect(result).toMatch(/--beacon-rpc-provider=""/)
  expect(result).toMatch(/--beacon-rpc-gateway-provider=/)
})

test('removeConnection String multiple endpoints', () => {
  const command = `/app/cmd/validator/validator --accept-terms-of-use=true
  --beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000,stereum-foo:3000,stereum-bar:2000"
  --beacon-rpc-gateway-provider=stereum-foo:3000,stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500
  --web --prater=true --datadir=/opt/app/data/db
  --wallet-dir=/opt/app/data/wallets
  --wallet-password-file=/opt/app/data/passwords/wallet-password
  --monitoring-host=0.0.0.0 --grpc-gateway-port=7500 --grpc-gateway-host=0.0.0.0
  --grpc-gateway-corsdomain="*"  --monitoring-host=0.0.0.0
  --monitoring-port=8081
  --suggested-fee-recipient=0x0000000000000000000000000000000000000000
  --graffiti-file=/opt/app/graffitis/graffitis.yaml`
  const id = '42d9f0b4-257f-f71e-10fe-66c342dd4995'

  const sm = new ServiceManager()
  const result = sm.removeCommandConnection(command, id)
  
  expect(result).not.toMatch(/--beacon-rpc-provider="stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:4000,stereum-foo:3000,stereum-bar:2000"/)
  expect(result).not.toMatch(/--beacon-rpc-gateway-provider=stereum-foo:3000,stereum-42d9f0b4-257f-f71e-10fe-66c342dd4995:3500/)
  expect(result).toMatch(/--beacon-rpc-provider="stereum-foo:3000,stereum-bar:2000"/)
  expect(result).toMatch(/--beacon-rpc-gateway-provider=stereum-foo:3000/)
})

test('removeConnection array single endpoint', () => {
  const command = [
    '--network=prater',
    '--logging=INFO',
    '--p2p-enabled=true',
    '--p2p-port=9001',
    '--validators-keystore-locking-enabled=false',
    '--validators-graffiti-file=/opt/app/graffitis/graffitis.yaml',
    '--ee-endpoint=http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551',
    '--ee-jwt-secret-file=/engine.jwt',
    '--validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000',
    '--data-path=/opt/app/data',
    '--data-storage-mode=prune',
    '--rest-api-port=5051',
    '--rest-api-host-allowlist=*',
    '--rest-api-interface=0.0.0.0',
    '--rest-api-docs-enabled=true',
    '--rest-api-enabled=true',
  ]
  const id = '9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d'

  const sm = new ServiceManager()
  const result = sm.removeCommandConnection(command, id)
  
  expect(result).not.toContain('--ee-endpoint=http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551')
  expect(result).toContain('--ee-endpoint=')
})

test('removeConnection array multiple endpoints', () => {
  const command = [
    '--network=prater',
    '--logging=INFO',
    '--p2p-enabled=true',
    '--p2p-port=9001',
    '--validators-keystore-locking-enabled=false',
    '--validators-graffiti-file=/opt/app/graffitis/graffitis.yaml',
    '--ee-endpoint="http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551,foo:3000,bar:2000"',
    '--ee-jwt-secret-file=/engine.jwt',
    '--validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000',
    '--data-path=/opt/app/data',
    '--data-storage-mode=prune',
    '--rest-api-port=5051',
    '--rest-api-host-allowlist=*',
    '--rest-api-interface=0.0.0.0',
    '--rest-api-docs-enabled=true',
    '--rest-api-enabled=true',
  ]
  const id = '9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d'

  const sm = new ServiceManager()
  const result = sm.removeCommandConnection(command, id)
  
  expect(result).not.toContain('--ee-endpoint="http://stereum-9adfdb2e-9f5b-aba4-cfde-f3483d7aac8d:8551,foo:3000,bar:2000"')
  expect(result).toContain('--ee-endpoint="foo:3000,bar:2000"')
})
