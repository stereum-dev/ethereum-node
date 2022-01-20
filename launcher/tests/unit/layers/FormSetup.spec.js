import { mount } from '@vue/test-utils'
import FormSetup from "../../../src/components/layers/FormSetup";

test('Click event',async ()=>{
    const wrapper = mount(FormSetup)

    const textInput = wrapper.find('input[type="image"]')
    await textInput.setValue('imgTrash')
  
    expect(wrapper.find('input[type="image"]').element.value).toBe('imgTrash')
})
