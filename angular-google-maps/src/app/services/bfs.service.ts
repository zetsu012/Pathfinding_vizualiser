import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BfsService {
  constructor() {}

  async bfs(grid: any[][], source: { row: number; col: number }, destination: { row: number; col: number }, obstacles: Set<string>, visited: Set<string>, path: Set<string>) {
    const queue: { row: number, col: number, path: { row: number, col: number }[] }[] = [];
    
    queue.push({ row: source.row, col: source.col, path: [] });
    visited.add(`${source.row}-${source.col}`);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      const { row, col, path: currentPath } = current;

      if (row === destination.row && col === destination.col) {
        for (const cell of currentPath) {
          path.add(`${cell.row}-${cell.col}`);
        }
        console.log('Path found:', currentPath);
        return;
      }

      const neighbors = this.getNeighbors(grid, row, col, obstacles);

      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push({ row: neighbor.row, col: neighbor.col, path: [...currentPath, { row, col }] });
        }
      }

    
      await this.delay(50); 
    }

    console.log('No path found');
  }

  getNeighbors(grid: any[][], row: number, col: number, obstacles: Set<string>): { row: number, col: number }[] {
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
        neighbors.push({ row: newRow, col: newCol });
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
