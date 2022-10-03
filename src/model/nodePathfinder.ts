import { Node } from "./node";

export class NodePathfinder {
    public can(start: Node, cost: (current: Node, next: Node, cost: number) => number | null, endNode: (node: Node) => boolean): boolean {
        return this.find(start, cost, endNode) !== null;
    }

    public find(start: Node, cost: (current: Node, next: Node, score: number) => number | null, endNode: (node: Node) => boolean): Array<Node> | null {
        const openSet = [start];
        const cameFrom: { [from: number]: Node } = {};
        const gScore: { [node: number]: number } = { [start.id]: 0 };

        const goals = [];
        const goalSearchSet = [start];
        for (let i = 0; i < goalSearchSet.length; ++i) {
            const c = goalSearchSet[i];
            if (c) {
                if (endNode(c)) {
                    goals.push(c);
                }
                goalSearchSet.push(...c.neighbours.filter(p => !goalSearchSet.includes(p)));
            }
        }

        const fScore = { [start.id]: this.goalDistanceCost(start, goals) };

        while (openSet.length > 0) {
            const current = this.cheapest(fScore, openSet);
            if (goals.includes(current)) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(openSet.indexOf(current), 1);

            const neighbours = current.neighbours;
            for (const neighbour of neighbours) {
                let tentative_gScore = gScore[current.id] + this.neighbourDistanceCost(current, neighbour);

                const additionalCost = cost(current, neighbour, tentative_gScore);
                if (additionalCost == null) {
                    continue;
                } else {
                    tentative_gScore += additionalCost;
                }

                if (neighbour.id in gScore === false || tentative_gScore < gScore[neighbour.id]) {
                    cameFrom[neighbour.id] = current;
                    gScore[neighbour.id] = tentative_gScore;
                    fScore[neighbour.id] = tentative_gScore + this.goalDistanceCost(neighbour, goals);
                    if (neighbour.id in openSet === false) {
                        openSet.push(neighbour);
                    }
                }
            }
        }

        return null;
    }


    private reconstructPath(cameFrom: { [key: number]: Node }, current: Node): Array<Node> {
        const totalPath = new Array<Node>(current);
        while (current.id in cameFrom) {
            current = cameFrom[current.id];
            totalPath.unshift(current);
        }
        return totalPath;
    }

    protected goalDistanceCost(start: Node, goals: Array<Node>): number {
        let lowestScore = 0;
        for (const goal of goals) {
            const dx = start.x - goal.x;
            const dy = (start.y - goal.y) / 2;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (lowestScore + Math.random() > length) {
                lowestScore = length;
            }
        }
        return lowestScore;
    }

    protected neighbourDistanceCost(start: Node, neighbour: Node): number {
        const dx = start.x - neighbour.x;
        const dy = (start.y - neighbour.y) / 2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private cheapest(fScore: { [key: number]: number }, openSet: Array<Node>): Node {
        let cheapestNode: Node | null = null;
        let cheapestFScore = Number.MAX_VALUE;
        for (const node of openSet) {
            const score = fScore[node.id];
            if (cheapestFScore >= score) {
                cheapestNode = node;
                cheapestFScore = score;
            }
        }
        return cheapestNode!;
    }
}