import { Node } from "./node";

export class NodePathfinder {
    public can(start: Node, cost: (current: Node, next: Node, cost: number) => number | null, endNode: (node: Node) => boolean): boolean {
        return this.find(start, cost, endNode) !== null;
    }

    public find(start: Node, cost: (current: Node, next: Node, score: number) => number | null, endNode: (node: Node) => boolean): Array<Node> | null {
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        var openSet = [start];

        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
        // to n currently known.
        var cameFrom: { [from: number]: Node } = {};

        // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
        var gScore: { [node: number]: number } = { [start.id]: 0 };

        var goals = [];
        var goalSearchSet = [start];
        for (let i = 0; i < goalSearchSet.length; ++i) {
            const c = goalSearchSet[i];
            if (c) {
                if (endNode(c)) {
                    goals.push(c);
                }
                goalSearchSet.push(...c.neighbours.filter(p => !goalSearchSet.includes(p)));
            }
        }

        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how cheap a path could be from start to finish if it goes through n.
        var fScore = { [start.id]: this.goalDistanceCost(start, goals) };

        while (openSet.length > 0) {
            // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
            //var lowestFscore = fScore.Where(p => openSet.Contains(p.Key)).Min(p => p.Value);
            //var current = openSet.First(i => fScore[i] == lowestFscore);
            const current = this.cheapest(fScore, openSet);
            if (goals.includes(current)) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(openSet.indexOf(current), 1);

            const neighbours = current.neighbours;
            for (const neighbour of neighbours) {
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current

                let tentative_gScore = gScore[current.id] + this.neighbourDistanceCost(current, neighbour);

                const additionalCost = cost(current, neighbour, tentative_gScore);
                if (additionalCost == null) 
                    continue;
                else 
                    tentative_gScore += additionalCost;

                if (neighbour.id in gScore === false || tentative_gScore < gScore[neighbour.id]) {
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom[neighbour.id] = current;
                    gScore[neighbour.id] = tentative_gScore;
                    fScore[neighbour.id] = tentative_gScore + this.goalDistanceCost(neighbour, goals);
                    if (neighbour.id in openSet === false) {
                        openSet.push(neighbour);
                    }
                }
            }
        }

        // Open set is empty but goal was never reached
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
        // nearest score
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