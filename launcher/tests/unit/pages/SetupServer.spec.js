import { mount } from "@vue/test-utils";
import SetupServer from "../../../src/pages/SetupServer";
import child from "../../../src/components/layers/FormSetup";

describe("SetupServer.vue", () => {
    test("Child Component exists", () => {
      const wrapper = mount(SetupServer);
      const childComp = wrapper.findComponent(child);
      expect(childComp.exists()).toBe(true);
    });
  });