import { mount } from "@vue/test-utils";
import ButtonInstallation from "../../../src/components/layers/ButtonInstallation";

it("renders props.title when passed", () => {
  const title = "new message";
  const wrapper = mount(ButtonInstallation, {
    props: { title },
  });
  expect(wrapper.text()).toMatch(title);
});
