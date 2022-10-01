import { Node } from '../../src/model/node';
import { World } from '../../src/model/world';

it('constructWorldSuccess', ()=>{
    const playTime = 231;

    const world = new World({
        playTime: playTime,
        entities: 
        [
            { type: "node", x: 0, y: 0, neighbours: [] }
        ]
    });

    expect(world.entities.length).toBe(1);
    expect(world.playTime).toBe(playTime);
});

it('addEntityToWorldSuccess', ()=>{
    const world = new World({
        playTime: 231,
        entities: []
    });
    
    expect(world.entities.length).toBe(0);

    const entity = new Node(world, {
        type: "node",
        x: 0,
        y: 0,
        neighbours: []
    });

    expect(world.entities.length).toBe(1);
});

it('removeEntityToWorldSuccess', ()=>{
    const world = new World({
        playTime: 231,
        entities: [
            { type: "node", x: 0, y: 0, neighbours: [] }
        ]
    });
    
    expect(world.entities.length).toBe(1);

    const node = world.entities[0];
    world.remove(node);
    
    expect(world.entities.length).toBe(0);
});

it('serializeWorld', ()=>{
    const playTime = 231;
    const world = new World({
        playTime: playTime,
        entities: [
            { type: "node", x: 0, y: 0, neighbours: [] }
        ]
    });
    
    expect(world.entities.length).toBe(1);

    const result = world.serialize();
    
    expect(result.playTime).toBe(playTime);
    expect(result.entities.length).toBe(1);
    expect(result.entities[0].type).toBe("node");
});