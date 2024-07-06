import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AstarService {

  constructor() { }

  async aStar(grid: any[][], source: { row: number; col: number }, destination: { row: number; col: number }, obstacles: Set<string>, visited: Set<string>, path: Set<string>) {
    const gScores: number[][] = [];
    const fScores: number[][] = [];
    const pq: MinHeap = new MinHeap();

    for (let i = 0; i < grid.length; i++) {
      gScores[i] = [];
      fScores[i] = [];
      for (let j = 0; j < grid[0].length; j++) {
        gScores[i][j] = Infinity;
        fScores[i][j] = Infinity;
      }
    }

    gScores[source.row][source.col] = 0;
    fScores[source.row][source.col] = this.heuristic(source, destination);
    pq.insert({ row: source.row, col: source.col, g: 0, f: fScores[source.row][source.col], path: [] });

    while (!pq.isEmpty()) {
      const { row, col, g, path: currentPath } = pq.extractMin();

      if (row === destination.row && col === destination.col) {
        for (const cell of currentPath) {
          path.add(`${cell.row}-${cell.col}`);
        }
        console.log('Path found:', currentPath);
        return;
      }

      visited.add(`${row}-${col}`);

      const neighbors = this.getNeighbors(grid, row, col, obstacles);

      for (const neighbor of neighbors) {
        const { newRow, newCol } = neighbor;
        const tentativeGScore = g + 1;

        if (tentativeGScore < gScores[newRow][newCol]) {
          gScores[newRow][newCol] = tentativeGScore;
          const fScore = tentativeGScore + this.heuristic({ row: newRow, col: newCol }, destination);
          fScores[newRow][newCol] = fScore;
          const newPath = [...currentPath, { row, col }];
          pq.insert({ row: newRow, col: newCol, g: tentativeGScore, f: fScore, path: newPath });
        }
      }

      await this.delay(50); 
    }

    console.log('No path found');
  }

  heuristic(node: { row: number; col: number }, goal: { row: number; col: number }): number {
    return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
  }

  getNeighbors(grid: any[][], row: number, col: number, obstacles: Set<string>): { newRow: number, newCol: number }[] {
    const neighbors = [];
    const directions = [
      { row: -1, col: 0 }, 
      { row: 1, col: 0 },  
      { row: 0, col: -1 }, 
      { row: 0, col: 1 }   
    ];

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;
      if (this.isValidCell(grid, newRow, newCol, obstacles)) {
        neighbors.push({ newRow, newCol });
      }
    }

    return neighbors;
  }

  isValidCell(grid: any[][], row: number, col: number, obstacles: Set<string>): boolean {
    return (
      row >= 0 &&
      row < grid.length &&
      col >= 0 &&
      col < grid[0].length &&
      !obstacles.has(`${row}-${col}`)
    );
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class MinHeap {
  heap: { row: number, col: number, g: number, f: number, path: { row: number, col: number }[] }[];

  constructor() {
    this.heap = [];
  }

  insert(node: { row: number, col: number, g: number, f: number, path: { row: number, col: number }[] }) {
    this.heap.push(node);
    this.bubbleUp();
  }

  extractMin() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.bubbleDown();
    }
    return min;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.f >= parent.f) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  bubbleDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.f < element.f) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.f < element.f) ||
          (swap !== null && rightChild.f < leftChild!.f)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}
