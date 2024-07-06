import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {

  constructor() { }

  async dijkstra(grid: any[][], source: { row: number; col: number }, destination: { row: number; col: number }, obstacles: Set<string>, visited: Set<string>, path: Set<string>) {
    const distances: number[][] = [];
    const pq: MinHeap = new MinHeap();

    for (let i = 0; i < grid.length; i++) {
      distances[i] = [];
      for (let j = 0; j < grid[0].length; j++) {
        distances[i][j] = Infinity;
      }
    }

    distances[source.row][source.col] = 0;
    pq.insert({ row: source.row, col: source.col, dist: 0, path: [] });

    while (!pq.isEmpty()) {
      const { row, col, dist, path: currentPath } = pq.extractMin();

      if (distances[row][col] < dist) continue;

      visited.add(`${row}-${col}`);

      if (row === destination.row && col === destination.col) {
        for (const cell of currentPath) {
          path.add(`${cell.row}-${cell.col}`);
        }
        console.log('Path found:', currentPath);
        return;
      }

      const neighbors = this.getNeighbors(grid, row, col, obstacles);

      for (const neighbor of neighbors) {
        const { newRow, newCol } = neighbor;
        const cost = dist + 1;

        if (cost < distances[newRow][newCol]) {
          distances[newRow][newCol] = cost;
          const newPath = [...currentPath, { row, col }];
          pq.insert({ row: newRow, col: newCol, dist: cost, path: newPath });
        }
      }

      await this.delay(50); 
    }

    console.log('No path found');
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
  heap: { row: number, col: number, dist: number, path: { row: number, col: number }[] }[];

  constructor() {
    this.heap = [];
  }

  insert(node: { row: number, col: number, dist: number, path: { row: number, col: number }[] }) {
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
      if (element.dist >= parent.dist) break;
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
        if (leftChild.dist < element.dist) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.dist < element.dist) ||
          (swap !== null && rightChild.dist < leftChild!.dist)
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
