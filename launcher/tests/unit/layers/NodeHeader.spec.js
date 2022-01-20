import { mount } from "@vue/test-utils";
import NodeHeader from "../../../src/components/layers/NodeHeader";

test("Check that the specific image exists", () => {
  const wrapper = mount(NodeHeader);
  const img = wrapper.findAll("img");
  expect(img.length).toBe(1);
});
