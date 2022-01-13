import { serivceState, ServiceManager } from "./ServiceManager";
import { NodeConnection } from "./NodeConnection";

test('manageServiceState success', async () => {
    jest.mock('./NodeConnection');
    const NodeConnection = require('./NodeConnection');
    const mMock = jest.fn((pb, args) => {
        return new Promise(async (resolve, reject) => {
            resolve({
                playbook: pb,
                playbookRunRef: "asdf"
            });
        });
    });
    NodeConnection.NodeConnection.mockImplementation(() => {
        return {
            runPlaybook: mMock,
        };
    });

    const sm = new ServiceManager(NodeConnection.NodeConnection());

    await expect(sm.manageServiceState("123", serivceState.restarted)).resolves.toEqual({
        playbook: "manage-service",
        playbookRunRef: "asdf"
    });

    expect(mMock.mock.calls[0][0]).toMatch(/manage-service/);
    expect(mMock.mock.calls[0][1].stereum.manage_service.configuration.id).toMatch(/123/);
    expect(mMock.mock.calls[0][1].stereum.manage_service.configuration.state).toMatch(serivceState.restarted);
});


test('manageServiceState failure', async () => {
    jest.mock('./NodeConnection');
    const NodeConnection = require('./NodeConnection');
    const mMock = jest.fn((pb, args) => {
        return new Promise(async (resolve, reject) => {
            reject("error321");
        });
    });
    NodeConnection.NodeConnection.mockImplementation(() => {
        return {
            runPlaybook: mMock,
        };
    });

    const sm = new ServiceManager(NodeConnection.NodeConnection());

    await expect(sm.manageServiceState("123", serivceState.started)).rejects.toMatch(/error321/);

    expect(mMock.mock.calls[0][0]).toMatch(/manage-service/);
    expect(mMock.mock.calls[0][1].stereum.manage_service.configuration.id).toMatch(/123/);
    expect(mMock.mock.calls[0][1].stereum.manage_service.configuration.state).toMatch(serivceState.started);
});

test('readServiceConfigurations success', async () => {
    jest.mock('./NodeConnection');
    const NodeConnection = require('./NodeConnection');
    const listServicesConfigurationsMock = jest.fn(() => {
        return new Promise(async (resolve, reject) => {
            resolve(["first", "second"]);
        });
    });
    const readServiceConfigurationMock = jest.fn();
    readServiceConfigurationMock.mockReturnValueOnce(new Promise(async (resolve, reject) => {
        resolve({
            service: "LighthouseBeaconService",
            id: "first",
        });
    })).mockReturnValueOnce(new Promise(async (resolve, reject) => {
        resolve({
            service: "LighthouseValidatorService",
            id: "second",
        });
    }));

    NodeConnection.NodeConnection.mockImplementation(() => {
        return {
            listServicesConfigurations: listServicesConfigurationsMock,
            readServiceConfiguration: readServiceConfigurationMock,
        };
    });

    const sm = new ServiceManager(NodeConnection.NodeConnection());

    const serviceConfigs = await sm.readServiceConfigurations();

    expect(serviceConfigs.length).toBe(2);
    expect(serviceConfigs[0]).toEqual({
        service: "LighthouseBeaconService",
        id: "first",
    });
    expect(serviceConfigs[1]).toEqual({
        service: "LighthouseValidatorService",
        id: "second",
    });
});

test('readServiceConfigurations success empty', async () => {
    jest.mock('./NodeConnection');
    const NodeConnection = require('./NodeConnection');
    const listServicesConfigurationsMock = jest.fn(() => {
        return new Promise(async (resolve, reject) => {
            resolve(new Array());
        });
    });

    NodeConnection.NodeConnection.mockImplementation(() => {
        return {
            listServicesConfigurations: listServicesConfigurationsMock,
        };
    });

    const sm = new ServiceManager(NodeConnection.NodeConnection());

    const serviceConfigs = await sm.readServiceConfigurations();

    expect(serviceConfigs.length).toBe(0);
});

