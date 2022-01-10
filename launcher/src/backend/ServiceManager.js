export class ServiceManager {

    constructor(nodeConnection) {
        this.nodeConnection = nodeConnection;
    }

    async manageService(service, action) {
        return new Promise(async (resolve, reject) => {
            this.nodeConnection.runPlaybook("manage-service", {
                // extra args
                stereum: {
                    manage_service: {
                        configuration: {
                            id: service.id,
                            state: action,
                        },
                    },
                },
            });
        });
    }
}
