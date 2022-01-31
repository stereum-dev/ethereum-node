import { mount } from "@vue/test-utils";
import TheFirst from "../../../src/pages/TheFirst";

  test("The first page", () => {
    const wrapper = mount(TheFirst);
    wrapper.vm.$emit('open')
    expect(wrapper.emitted().open).toBeTruthy();
  });

