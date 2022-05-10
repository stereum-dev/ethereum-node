import { shallowMount } from '@vue/test-utils'
import TheTrapezium from '../../../src/components/UI/TheTrapezium'

test('TheTrapezium contains specific id', () => {
  const wrapper = shallowMount(TheTrapezium)
  const byId = wrapper.find('#trapezoid')
  expect(byId.element.id).toBe('trapezoid')
})
