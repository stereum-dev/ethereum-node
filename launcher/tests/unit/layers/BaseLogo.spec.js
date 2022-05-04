import { mount } from '@vue/test-utils'
import BaseLogo from '../../../src/components/layers/BaseLogo'

test('Check that the specific image exists', () => {
  const wrapper = mount(BaseLogo)
  const img = wrapper.findAll('img')
  expect(img.length).toBe(1)
})
