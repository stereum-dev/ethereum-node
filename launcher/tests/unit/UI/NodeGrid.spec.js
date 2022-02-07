import { mount } from "@vue/test-utils";
import NodeGrid from "../../../src/components/UI/NodeGrid";
import TheTrapezium from "../../../src/components/UI/TheTrapezium";

test("Child component exists", () => {
  const wrapper = mount(NodeGrid);
  expect(wrapper.findComponent(TheTrapezium).exists());
});
