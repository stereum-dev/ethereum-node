import { mount } from "@vue/test-utils";
import TheNode from "../../../src/pages/TheNode";
import NodeGrid from "../../../src/components/UI/NodeGrid";

test("TheNode contains Child comp", () => {
  const wrapper = mount(TheNode);
  const bar = wrapper.findComponent(NodeGrid);
  expect(bar.exists()).toBe(true);
});
