import { mount } from '@vue/test-utils'
import BaseButton from "../../../src/components/UI/BaseButton";
test('Button element exist',()=>{

    const wrapper = mount(BaseButton)
    expect(wrapper.element.button)
})