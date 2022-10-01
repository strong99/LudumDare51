import { Node } from "./node";

export class NodePathfinder {
    public can(startNode: Node, cost: (node: Node) => number|null, endNode: (node: Node) => boolean): boolean {
        return this.find(startNode, cost, endNode) !== null;
    }

    public find(startNode: Node, cost: (node: Node) => number|null, endNode: (node: Node) => boolean): Array<Node> {
        throw new Error("Not yet implemented");
    }
}