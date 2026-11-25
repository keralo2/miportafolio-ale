"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Cell = { top: boolean; right: boolean; bottom: boolean; left: boolean };
type Position = { row: number; col: number };
type Level = 10 | 15 | 21;
type GameStatus = "ready" | "playing" | "won";

const keyOf = (p: Position) => `${p.row},${p.col}`;
const same = (a: Position, b: Position) => a.row === b.row && a.col === b.col;

function buildMaze(size: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ top: true, right: true, bottom: true, left: true }))
  );
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const stack: Position[] = [{ row: 0, col: 0 }];
  visited[0][0] = true;
  const directions = [
    { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    { dr: 0, dc: 1, wall: "right", opposite: "left" },
    { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    { dr: 0, dc: -1, wall: "left", opposite: "right" },
  ] as const;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = directions
      .map((d) => ({ ...d, row: current.row + d.dr, col: current.col + d.dc }))
      .filter((d) => d.row >= 0 && d.row < size && d.col >= 0 && d.col < size && !visited[d.row][d.col]);
    if (!options.length) {
      stack.pop();
      continue;
    }
    const next = options[Math.floor(Math.random() * options.length)];
    (grid[current.row][current.col] as any)[next.wall] = false;
    (grid[next.row][next.col] as any)[next.opposite] = false;
    visited[next.row][next.col] = true;
    stack.push({ row: next.row, col: next.col });
  }
  return grid;
}

function findPath(grid: Cell[][], start: Position, goals: Position[]): Position[] {
  const size = grid.length;
  const queue: Position[] = [start];
  const previous = new Map<string, string | null>([[keyOf(start), null]]);
  const goalKeys = new Set(goals.map(keyOf));
  let found: string | null = null;
  const moves = [
    { dr: -1, dc: 0, wall: "top" },
    { dr: 0, dc: 1, wall: "right" },
    { dr: 1, dc: 0, wall: "bottom" },
    { dr: 0, dc: -1, wall: "left" },
  ] as const;

  while (queue.length) {
    const current = queue.shift()!;
    const currentKey = keyOf(current);
    if (goalKeys.has(currentKey) && !same(current, start)) {
      found = currentKey;
      break;
    }
    for (const move of moves) {
      const next = { row: current.row + move.dr, col: current.col + move.dc };
      if (next.row < 0 || next.row >= size || next.col < 0 || next.col >= size) continue;
      if (grid[current.row][current.col][move.wall]) continue;
      const nextKey = keyOf(next);
      if (previous.has(nextKey)) continue;
      previous.set(nextKey, currentKey);
      queue.push(next);
    }
  }
  if (!found) return [];
  const path: Position[] = [];
  let cursor: string | null = found;
  while (cursor) {
    const [row, col] = cursor.split(",").map(Number);
    path.unshift({ row, col });
    cursor = previous.get(cursor) ?? null;
  }
  return path;
}

function createCookies(size: number): Position[] {
  const count = size === 10 ? 5 : size === 15 ? 8 : 12;
  const spots = new Set<string>();
  while (spots.size < count) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if ((row !== 0 || col !== 0) && (row !== size - 1 || col !== size - 1)) spots.add(`${row},${col}`);
  }
  return [...spots].map((key) => {
    const [row, col] = key.split(",").map(Number);
    return { row, col };
  });
}

export default function MazeDemo() {
  const [level, setLevel] = useState<Level>(10);
  const [grid, setGrid] = useState<Cell[][]>(() => buildMaze(10));
  const [player, setPlayer] = useState<Position>({ row: 0, col: 0 });
  const [cookies, setCookies] = useState<Position[]>(() => createCookies(10));
  const [steps, setSteps] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [hint, setHint] = useState<Position[]>([]);
  const [message, setMessage] = useState("Presiona «Comenzar» para entrar al laberinto.");
  const exit = useMemo(() => ({ row: level - 1, col: level - 1 }), [level]);
  const collected = cookies.length === 0;
  const hintKeys = useMemo(() => new Set(hint.map(keyOf)), [hint]);

  const reset = useCallback((nextLevel: Level = level) => {
    setLevel(nextLevel);
    setGrid(buildMaze(nextLevel));
    setPlayer({ row: 0, col: 0 });
    setCookies(createCookies(nextLevel));
    setSteps(0);
    setSeconds(0);
    setStatus("ready");
    setHint([]);
    setMessage("Presiona «Comenzar» para entrar al laberinto.");
  }, [level]);

  const move = useCallback((dr: number, dc: number) => {
    if (status === "won") return;
    if (status === "ready") setStatus("playing");
    const wall = dr === -1 ? "top" : dr === 1 ? "bottom" : dc === -1 ? "left" : "right";
    if (grid[player.row][player.col][wall]) {
      setMessage("¡Ese camino está cerrado! Prueba otra dirección.");
      return;
    }
    const next = { row: player.row + dr, col: player.col + dc };
    setPlayer(next);
    setSteps((value) => value + 1);
    setHint([]);
    const remaining = cookies.filter((cookie) => !same(cookie, next));
    if (remaining.length !== cookies.length) {
      setCookies(remaining);
      setMessage("¡Encontraste una galleta! 🍪");
    } else if (same(next, exit)) {
      if (remaining.length === 0) {
        setStatus("won");
        setMessage("¡Lo lograste! Snoopy llegó a la casita. 🏠");
      } else {
        setMessage(`¡Llegaste a la salida! Faltan ${remaining.length} galletas.`);
      }
    } else {
      setMessage("¡Sigue buscando las galletas!");
    }
  }, [cookies, exit, grid, player, status]);

  const showHint = () => {
    const targets = cookies.length ? cookies : [exit];
    const path = findPath(grid, player, targets);
    setHint(path);
    setMessage(path.length ? "Pista BFS: sigue las casillas resaltadas." : "No se encontró una ruta.");
  };

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
        ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
        ArrowLeft: [0, -1], a: [0, -1], A: [0, -1],
        ArrowRight: [0, 1], d: [0, 1], D: [0, 1],
      };
      const direction = keys[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction[0], direction[1]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  const time = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="maze-demo">
      <div className="maze-top">
        <div><span className="eyebrow">SNOOPY MAZE ADVENTURE</span><h3>¡Ayuda a Snoopy a encontrar la salida!</h3><p>Recoge todas las galletas 🍪 y llega a la casita 🏠.</p></div>
        <span className="maze-snoopy" aria-hidden="true">🐶</span>
      </div>
      <div className="maze-toolbar">
        <label>Nivel
          <select value={level} onChange={(event) => reset(Number(event.target.value) as Level)}>
            <option value={10}>Fácil · 10 × 10</option>
            <option value={15}>Medio · 15 × 15</option>
            <option value={21}>Difícil · 21 × 21</option>
          </select>
        </label>
        <div className="maze-stat"><small>Pasos</small><b>{steps}</b></div>
        <div className="maze-stat"><small>Tiempo</small><b>{time}</b></div>
        <div className="maze-stat"><small>Galletas</small><b>{(level === 10 ? 5 : level === 15 ? 8 : 12) - cookies.length}/{level === 10 ? 5 : level === 15 ? 8 : 12}</b></div>
      </div>
      <div className="maze-board-wrap">
        <div className="maze-board" style={{ gridTemplateColumns: `repeat(${level}, minmax(0, 1fr))` }}>
          {grid.map((row, r) => row.map((cell, c) => {
            const pos = { row: r, col: c };
            const isPlayer = same(player, pos);
            const isCookie = cookies.some((cookie) => same(cookie, pos));
            const isExit = same(exit, pos);
            const inHint = hintKeys.has(keyOf(pos)) && !isPlayer;
            return <div key={keyOf(pos)} className={`maze-cell${inHint ? " hint" : ""}`} style={{ borderTop: cell.top ? "2px solid #5b3040" : "2px solid transparent", borderRight: cell.right ? "2px solid #5b3040" : "2px solid transparent", borderBottom: cell.bottom ? "2px solid #5b3040" : "2px solid transparent", borderLeft: cell.left ? "2px solid #5b3040" : "2px solid transparent" }}>
              {isPlayer ? <span aria-label="Snoopy">🐶</span> : isCookie ? <span aria-label="Galleta">🍪</span> : isExit ? <span aria-label="Casa">🏠</span> : null}
            </div>;
          }))}
        </div>
      </div>
      <div className="maze-message" aria-live="polite">{message}</div>
      <div className="maze-actions">
        <button className="primary-button small" onClick={() => { setStatus("playing"); setMessage("¡Vamos! Recoge todas las galletas."); }}>Comenzar</button>
        <button className="maze-secondary" onClick={showHint}>Pedir pista BFS</button>
        <button className="maze-secondary" onClick={() => reset(level)}>Reiniciar</button>
      </div>
      <div className="maze-controls" aria-label="Controles táctiles">
        <span>Controles para celular</span>
        <div className="maze-pad">
          <i />
          <button onClick={() => move(-1, 0)} aria-label="Arriba">↑</button>
          <i />
          <button onClick={() => move(0, -1)} aria-label="Izquierda">←</button>
          <button onClick={() => move(1, 0)} aria-label="Abajo">↓</button>
          <button onClick={() => move(0, 1)} aria-label="Derecha">→</button>
        </div>
      </div>
      {status === "won" && <div className="maze-win">¡Misión cumplida! Snoopy llegó a casa en {steps} pasos y {time}. 🎉</div>}
      <p className="maze-note">Usa las flechas o WASD en computadora, o los botones en pantalla desde tu celular. Las pistas se calculan con búsqueda BFS.</p>
    </div>
  );
}
