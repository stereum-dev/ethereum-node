import { mount } from "@vue/test-utils";
import CircleLoading from "../../../src/components/UI/CircleLoading";

test("Props rendered", () => {
  const wrapper = mount(CircleLoading, {
    propsData: {
      open: "open",
    },
  });

  expect(wrapper.props().open).toBe("open");
});
