import { mount } from "@vue/test-utils";
import RightNode from "../../../src/components/UI/RightNode";

test("RightNode default slot", () => {
  const wrapper = mount(RightNode, {
    slots: {
      default: "div Content",
    },
  });

  expect(wrapper.html()).toContain("div Content");
});
