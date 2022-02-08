import { mount } from "@vue/test-utils";
import NodeSetupConfig from "../../../src/components/layers/NodeSetupConfig.vue";

test("img tag exists", async () => {
  const wrapper = mount(NodeSetupConfig);
  await wrapper.setData({
    testData: {
      id: 5,
      name: "test",
      status: "online",
    },
  });
  expect(wrapper.vm.testData.status).toBe("online");
});
