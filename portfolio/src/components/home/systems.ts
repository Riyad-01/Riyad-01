/** Shared model for the hero systems visualization (SVG fallback and WebGL). */
export const NODES = [
  { id: "need", label: "Human Needs", x: -1.0, y: 0.0, z: 0.0, kind: "origin" },
  { id: "product", label: "Product", x: -0.42, y: 0.62, z: 0.35, kind: "discipline" },
  { id: "learning", label: "Learning", x: -0.42, y: -0.62, z: -0.3, kind: "discipline" },
  { id: "design", label: "Design", x: 0.12, y: 0.3, z: -0.35, kind: "discipline" },
  { id: "ai", label: "AI", x: 0.12, y: -0.3, z: 0.4, kind: "discipline" },
  { id: "teams", label: "Teams", x: 0.58, y: 0.12, z: 0.0, kind: "discipline" },
  { id: "outcome", label: "Business Outcomes", x: 1.0, y: 0.0, z: 0.0, kind: "result" },
] as const;

export const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
  [5, 6],
];

export const RELATIONSHIPS =
  "Human needs feed product and learning. Product and learning shape design and AI. Design and AI enable teams. Teams deliver business outcomes.";
