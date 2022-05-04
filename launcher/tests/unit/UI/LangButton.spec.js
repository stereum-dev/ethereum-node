import { mount } from '@vue/test-utils'
import LangButton from '../../../src/components/UI/LangButton'

test('Img element exists', () => {
  const wrapper = mount(LangButton)
  const img = wrapper.find('img')

  expect(img.exists()).toBe(true)
})
