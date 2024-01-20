import { describe, expect, test } from "@/bun/test";
import {
  findReachableAsync,
  inverse,
  reachable,
  reachableSinks,
  sinks,
  sources,
} from "./graph";

function createGraph() {
  const graph = new Map<string, Set<string>>();
  graph.set("a", new Set(["main"]));
  graph.set("b", new Set(["main"]));
  graph.set("c", new Set(["b"]));
  graph.set("d", new Set(["c", "a"]));
  graph.set("f", new Set(["d"]));
  return graph;
}

describe("inverse()", () => {
  test("returns the inverse graph", () => {
    const graph = createGraph();
    const inverseGraph = inverse(graph);
    expect(inverseGraph).toEqual(
      new Map([
        ["main", new Set(["a", "b"])],
        ["a", new Set(["d"])],
        ["b", new Set(["c"])],
        ["c", new Set(["d"])],
        ["d", new Set(["f"])],
      ]),
    );
  });
});

describe("sources()", () => {
  test("returns the sources of the graph", () => {
    const graph = createGraph();
    expect(sources(graph)).toEqual(new Set(["f"]));
  });
});

describe("sinks()", () => {
  test("returns the sinks of the graph", () => {
    const graph = createGraph();
    expect(sinks(graph)).toEqual(new Set(["main"]));
  });
});

describe("reachableSinks()", () => {
  test("returns the reachable sinks", () => {
    const graph = createGraph();
    expect(reachableSinks(graph, "f")).toEqual(new Set(["main"]));
  });
});

describe("reachable()", () => {
  test("returns the reachable nodes from f", () => {
    const graph = createGraph();
    expect(reachable(graph, "f")).toEqual(
      new Set(["main", "a", "b", "c", "d"]),
    );
  });

  test("returns the reachable nodes from c", () => {
    const graph = createGraph();
    expect(reachable(graph, "c")).toEqual(new Set(["main", "b"]));
  });
});

describe("findReachableAsync()", () => {
  test("returns the reachable nodes from f", async () => {
    const graph = createGraph();
    const reachable = await findReachableAsync(
      graph,
      "f",
      async (n) => n === "a" || n === "b",
    );
    expect(reachable).toEqual(new Set(["a", "b"]));
  });
});
