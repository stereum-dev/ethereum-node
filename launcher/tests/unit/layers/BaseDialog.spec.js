import { mount} from '@vue/test-utils';
import BaseDialog from '../../../src/components/layers/BaseDialog';

describe('BaseDialog.vue',()=>{
    test('custom events',()=>{
        const wrapper = mount(BaseDialog)
        wrapper.vm.$emit('bDialogDis')
        expect(wrapper.emitted().bDialogDis).toBeTruthy()
    })
})