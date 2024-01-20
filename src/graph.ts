export type Graph<T> = Map<T, Set<T>>;

export function inverse<T>(graph: Graph<T>): Graph<T> {
  const inverse = new Map<T, Set<T>>();
  for (const [tail, heads] of graph) {
    for (const head of heads) {
      if (!inverse.has(head)) {
        inverse.set(head, new Set());
      }
      inverse.get(head)?.add(tail);
    }
  }
  return inverse;
}

export function sources<T>(graph: Graph<T>): Set<T> {
  const inverseGraph = inverse(graph);
  const leafNodes = new Set<T>();
  for (const node of graph.keys()) {
    if (inverseGraph.has(node)) continue;
    leafNodes.add(node);
  }
  return leafNodes;
}

export function sinks<T>(graph: Graph<T>): Set<T> {
  const inverseGraph = inverse(graph);
  const leafNodes = new Set<T>();
  for (const node of inverseGraph.keys()) {
    if (graph.has(node)) continue;
    leafNodes.add(node);
  }
  return leafNodes;
}

export function reachableSinks<T>(graph: Graph<T>, source: T) {
  const reachable = new Set<T>();
  const queue = [source];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (reachable.has(node)) continue;
    reachable.add(node);
    for (const head of graph.get(node) ?? []) {
      queue.push(head);
    }
  }

  const graphSinks = sinks(graph);
  for (const node of reachable) {
    if (graphSinks.has(node)) continue;
    reachable.delete(node);
  }

  return reachable;
}

export function reachable<T>(graph: Graph<T>, source: T) {
  const visited = new Set<T>();
  const reachable = new Set<T>();
  const queue = [source];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    for (const head of graph.get(node) ?? []) {
      reachable.add(head);
      queue.push(head);
    }
    visited.add(node);
  }
  return reachable;
}

// Find first nodes that satisfies predicate
export async function findReachableAsync<T>(
  graph: Graph<T>,
  source: T,
  predicate: (node: T) => Promise<boolean>,
) {
  const found = new Set<T>();
  const visited = new Set<T>();
  const queue = [...(graph.get(source) ?? [])];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;

    if (await predicate(node)) {
      found.add(node);
      continue;
    }

    for (const head of graph.get(node) ?? []) {
      queue.push(head);
    }

    visited.add(node);
  }

  // Remove found nodes that are reachable from other found nodes
  for (const node of found) {
    const reachableNodes = reachable(graph, node);
    for (const reachableNode of reachableNodes) {
      found.delete(reachableNode);
    }
  }

  return found;
}
