import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js';
import { StatDataPoint } from '../../../../models/statistics.model';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  template: `<canvas #canvas></canvas>`
})
export class RevenueChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() revenusParMois: StatDataPoint[] = [];
  @Input() chargesParMois: StatDataPoint[] = [];
  @Input() beneficesParMois: StatDataPoint[] = [];
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
    if (!this.revenusParMois.length) return;
    this.chart?.destroy();

    const labels = this.revenusParMois.map((d) => d.label);
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenus',
            data: this.revenusParMois.map((d) => d.value ?? 0),
            borderColor: '#c03f0c',
            backgroundColor: 'rgba(192,63,12,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3
          },
          {
            label: 'Charges',
            data: this.chargesParMois.map((d) => d.value ?? 0),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3
          },
          {
            label: 'Bénéfices',
            data: this.beneficesParMois.map((d) => d.value ?? 0),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { mode: 'index', intersect: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }
}
