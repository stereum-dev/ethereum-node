import { mount } from '@vue/test-utils'
import ConnectionTab from '../../../src/components/wizard/ConnectionTab';


describe('ConnectionTab.vue', () => {
    test('Props rendered', () => {
        const wrapper = mount(ConnectionTab, {
            propsData: {
                model: model
            }
        })
        expect(wrapper.props().model).toBe(model)

    })
})