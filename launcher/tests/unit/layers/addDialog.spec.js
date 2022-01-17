import { mount} from '@vue/test-utils';
import AddDialog from '../../../src/components/layers/AddDialog';


test('ButtonInstallation.vue', () => {
// it('render emit'),()=>{
const wrapper=mount(AddDialog);
wrapper.vm.$emit('dialogDis',true)
expect(wrapper.emitted('dialogDis')).toBeTruthy();
    
})
