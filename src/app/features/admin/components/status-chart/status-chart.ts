import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { StatDataPoint } from '../../../../models/statistics.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chart.html'
})
export class StatusChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: StatDataPoint[] = [];
  @Input() colors: string[] = ['#f59e0b', '#10b981', '#ef4444'];
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private ready = false;

  ngAfterViewInit(): void {
    this.ready = true;
    this.buildChart();
  }

  ngOnChanges(): void {
    if (this.ready) this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    if (!this.data.length) return;
    this.chart?.destroy();

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.data.map((d) => d.label),
        datasets: [{
          data: this.data.map((d) => d.count ?? 0),
          backgroundColor: this.colors,
          borderWidth: 2,
          borderColor: '#fdfaf7'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } }
        }
      }
    });
  }
}
