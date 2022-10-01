import { SaveManager } from '../../src/io/saveManager';
import { World } from '../../src/model/world';

const saveKey = 'ld51:save';

it('hasQuickSave', ()=>{
    localStorage[saveKey] = 'something';

    const saveManager = new SaveManager();
    const result = saveManager.hasQuickSave();

    expect(result).toBeTruthy();
});

it('hasNoQuickSave', ()=>{
    delete localStorage[saveKey];

    const saveManager = new SaveManager();
    const result = saveManager.hasQuickSave();

    expect(result).toBeFalsy();
});

it('doLoadExistingQuickSave', ()=>{
    localStorage[saveKey] = JSON.stringify({
        playTime: 453,
        entities: []
    });

    const saveManager = new SaveManager();
    const result = saveManager.loadQuickSave();

    expect(result).toBeInstanceOf(World);
});

it('preventLoadNonExistingQuickSave', ()=>{
    delete localStorage[saveKey];

    const saveManager = new SaveManager();

    expect(()=>saveManager.loadQuickSave()).toThrow();
});