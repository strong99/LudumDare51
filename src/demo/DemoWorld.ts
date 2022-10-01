import { WorldData } from "../io/dto";

export const DemoWorld: WorldData = {
    playTime: 0,
    lastGeneratdId: 10,
    players: [
        {
            id: 9,
            type: "tree",
            buildPoints: 3
        },
        {
            id: 10,
            type: "kingdom"
        }
    ],
    entities: [
        {
            type: 'node',
            id: 1,
            x: 0,
            y: 0,
            neighbours: [3, 4, 5, 6],
            construction: {
                id: 2,
                player: 9,
                type: "tree",
                level: 1,
                pods: [],
                withering: false,
                timeSincePodConsumed: 0
            }
        },
        {
            type: "node",
            neighbours: [1, 7],
            id: 3,
            x: -250,
            y: 100
        },
        {
            type: "node",
            neighbours: [1, 8],
            id: 4,
            x: 250,
            y: 100
        },
        {
            type: "node",
            neighbours: [1, 7],
            id: 5,
            x: -250,
            y: -100
        },
        {
            type: "node",
            neighbours: [1, 8],
            id: 6,
            x: 250,
            y: -100
        },
        {
            type: "node",
            neighbours: [3, 5],
            id: 7,
            x: -500,
            y: 0
        },
        {
            type: "node",
            neighbours: [4, 6, 11, 12],
            id: 8,
            x: 500,
            y: 0
        },
        {
            type: "node",
            neighbours: [8, 13],
            id: 11,
            x: 750,
            y: 100
        },
        {
            type: "node",
            neighbours: [8, 14],
            id: 12,
            x: 750,
            y: -100,
            construction: {
                id: 16,
                player: 10,
                pods: [],
                type: "town",
                level: 1
            }
        },
        {
            type: "node",
            neighbours: [11, 15],
            id: 13,
            x: 1000,
            y: 100
        },
        {
            type: "node",
            neighbours: [12, 15],
            id: 14,
            x: 1000,
            y: -100
        },
        {
            type: "node",
            neighbours: [13, 14],
            id: 15,
            x: 1250,
            y: 0,
            construction: {
                id: 16,
                player: 10,
                pods: [],
                type: "city",
                level: 1
            }
        }
    ],
};