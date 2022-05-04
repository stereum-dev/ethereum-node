import { mount } from '@vue/test-utils'
import BaseDialog from '../../../src/components/layers/BaseDialog'

test('custom events', () => {
  const wrapper = mount(BaseDialog)
  wrapper.vm.$emit('bDialogDis')
  expect(wrapper.emitted().bDialogDis).toBeTruthy()
})
