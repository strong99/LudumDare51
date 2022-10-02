import { WorldData } from "../io/dto";

export const DemoWorld: WorldData = {
    playTime: 0,
    lastGeneratdId: 34  ,
    agents: [
        {
            player: 10,
            type: "humanComputer"
        }
    ],
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
            x: -50,
            y: 0,
            neighbours: [3, 4, 5, 6]
        },
        {
            id: 17,
            type: "digestivePod",
            age: 900,
            x: 0,
            y: -140
        },
        {
            id: 18,
            type: "digestivePod",
            age: 7500,
            x: 80,
            y: -145
        },
        {
            id: 19,
            type: "digestivePod",
            age: 800,
            x: 30,
            y: -145
        },
        {
            id: 20,
            type: "digestivePod",
            age: 1200,
            x: 90,
            y: -125
        },
        {
            type: "node",
            neighbours: [1, 7, 21, 27],
            id: 3,
            road: 'paved',
            x: -250,
            y: 100
        },
        {
            type: "node",
            neighbours: [1, 8, 21, 35],
            id: 4,
            road: 'paved',
            x: 250,
            y: 100
        },
        {
            type: "node",
            neighbours: [1, 7, 22, 25],
            id: 5,
            x: -250,
            y: -100
        },
        {
            type: "node",
            neighbours: [1, 8, 22],
            id: 6,
            x: 250,
            y: -80
        },
        {
            type: "node",
            neighbours: [3, 5, 26],
            id: 7,
            road: 'paved',
            x: -500,
            y: 0
        },
        {
            type: "node",
            neighbours: [4, 6, 11, 12],
            id: 8,
            road: 'paved',
            x: 500,
            y: 0
        },
        {
            type: "node",
            neighbours: [8, 13, 35],
            id: 11,
            x: 750,
            y: 100
        },
        {
            type: "node",
            neighbours: [8, 14, 24],
            id: 12,
            road: 'paved',
            x: 750,
            y: -100,
            construction: {
                id: 16,
                player: 10,
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
            road: 'paved',
            x: 1000,
            y: -100
        },
        {
            type: "node",
            neighbours: [13, 14],
            id: 15,
            road: 'paved',
            x: 1250,
            y: 0,
            construction: {
                id: 16,
                player: 10,
                type: "city",
                level: 1
            }
        },
        {
            type: "node",
            neighbours: [3, 4],
            id: 21,
            road: 'paved',
            x: 0,
            y: 150
        },
        {
            type: "node",
            neighbours: [5, 6, 23],
            id: 22,
            x: 50,
            y: -150,
            construction: {
                id: 2,
                player: 9,
                type: "tree",
                level: 1,
                withering: false,
                timeSincePodConsumed: 0
            }
        },
        {
            type: "node",
            neighbours: [22, 24],
            id: 23,
            x: 290,
            y: -180
        },
        {
            type: "node",
            neighbours: [23, 12],
            id: 24,
            x: 480,
            y: -150
        },
        {
            type: "node",
            neighbours: [28, 5],
            id: 25,
            x: -480,
            y: -150
        },
        {
            type: "node",
            neighbours: [7, 27, 32],
            id: 26,
            x: -680,
            y: 100
        },
        {
            type: "node",
            neighbours: [3, 26],
            id: 27,
            x: -450,
            y: 150
        },
        {
            type: "node",
            neighbours: [30, 33, 28],
            id: 34,
            road: 'paved',
            x: -1000,
            y: 0
        },
        {
            type: "node",
            neighbours: [31, 34, 25, 7],
            id: 28,
            road: 'paved',
            x: -800,
            y: -100
        },
        {
            type: "node",
            neighbours: [26, 33],
            id: 32,
            x: -880,
            y: 170
        },
        {
            type: "node",
            neighbours: [30, 31],
            id: 29,
            road: 'paved',
            x: -1100,
            y: -250,
            construction: {
                id: 16,
                player: 10,
                type: "city",
                level: 1
            }
        },
        {
            type: "node",
            neighbours: [29, 34],
            id: 30,
            x: -1150,
            y: -120
        },
        {
            type: "node",
            neighbours: [29, 28],
            id: 31,
            road: 'paved',
            x: -930,
            y: -200
        },
        {
            type: "node",
            neighbours: [32, 34],
            id: 33,
            road: 'paved',
            x: -1150,
            y: 130,
            construction: {
                id: 16,
                player: 10,
                type: "town",
                level: 1
            }
        },
        {
            type: "node",
            neighbours: [4, 11],
            id: 35,
            x: 500,
            y: 180
        },
    ],
};