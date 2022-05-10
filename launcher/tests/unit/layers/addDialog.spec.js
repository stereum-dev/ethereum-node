import { mount } from '@vue/test-utils'
import AddDialog from '../../../src/components/layers/AddDialog'

test('AddDialog.vue', () => {
  const wrapper = mount(AddDialog)
  wrapper.vm.$emit('dialogDis', true)
  expect(wrapper.emitted('dialogDis')).toBeTruthy()
})
