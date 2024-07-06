import { Component } from '@angular/core';
import { BfsService } from '../services/bfs.service';
import { DfsService } from '../services/dfs.service';
import { DijkstraService } from '../services/dijkstra.service';
import { AstarService } from '../services/astar.service';
@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css']
})
export class VisualiserComponent {
  grid: any[][] = [];
  source: { row: number; col: number } | null = null;
  destination: { row: number; col: number } | null = null;
  obstacles: Set<string> = new Set();
  visited: Set<string> = new Set();
  path: Set<string> = new Set();
  selectionMode: 'source' | 'destination' | 'obstacle' = 'source';
  selectedAlgorithm: string = 'bfs';

  constructor(private bfsService:BfsService , private dfsService:DfsService , private dijkstraService:DijkstraService , private aStarService:AstarService) {
    this.initializeGrid(60, 50);
  }

  initializeGrid(rows: number, cols: number) {
    for (let i = 0; i < rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < cols; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  selectCell(row: number, col: number) {
    const cellKey = `${row}-${col}`;
    
    switch (this.selectionMode) {
      case 'source':
        this.source = { row, col };
        this.selectionMode = 'destination';
        break;
      case 'destination':
        if (!this.isSource(row, col)) {
          this.destination = { row, col };
          this.selectionMode = 'obstacle';
        }
        break;
      case 'obstacle':
        if (!this.isSource(row, col) && !this.isDestination(row, col)) {
          if (this.obstacles.has(cellKey)) {
            this.obstacles.delete(cellKey);
          } else {
            this.obstacles.add(cellKey);
          }
        }
        break;
      default:
        break;
    }
  }

  isSource(row: number, col: number): boolean {
    return this.source?.row === row && this.source?.col === col;
  }

  isDestination(row: number, col: number): boolean {
    return this.destination?.row === row && this.destination?.col === col;
  }

  isObstacle(row: number, col: number): boolean {
    return this.obstacles.has(`${row}-${col}`);
  }

  isVisited(row: number, col: number): boolean {
    return this.visited.has(`${row}-${col}`);
  }

  isPath(row: number, col: number): boolean {
    return this.path.has(`${row}-${col}`);
  }

  async startPathfinding(algorithm: string) {
    if (!this.source || !this.destination) {
      console.error('Source and Destination must be set');
      return;
    }
    this.visited.clear();
    this.path.clear();
    switch (algorithm) {
      case 'bfs':
        await this.bfsService.bfs(this.grid, this.source, this.destination, this.obstacles, this.visited, this.path);
        break;
      case 'dfs':
        await this.dfsService.dfs(this.grid, this.source, this.destination, this.obstacles, this.visited, this.path);
        break;
      case 'dijkstra':
        await this.dijkstraService.dijkstra(this.grid, this.source, this.destination, this.obstacles, this.visited, this.path);
        break;
      case 'a-star':
        await this.aStarService.aStar(this.grid, this.source, this.destination, this.obstacles, this.visited, this.path);
        break;
      default:
        console.error('Unsupported algorithm');
        return;
    }
  }
}
