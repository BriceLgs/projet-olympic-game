import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { OlympicModels } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
Chart.register(...registerables);
@Component({
  selector: 'pie-chart',
  standalone: false,
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.scss',
})
export class PieChartComponent implements OnInit, OnDestroy {
  chartdata: OlympicModels[] = [];
  countrydata: string[] = [];
  medaldata: number[] = [];
  subscription: Subscription | undefined;
  totalOlympics: number = 0;
  totalCountries: number = 0;
  constructor(private service: OlympicService, private router : Router) {}

  ngOnInit(): void {

    this.service.loadInitialData();
    this.subscription = this.service.getOlympics().subscribe((data) => {
      if (data) {
        this.chartdata = data;
        this.countrydata = this.chartdata.map(o => o.country);
        for (const o of this.chartdata) {
          let totalMedals = 0;
          for (const p of o.participations) {
            totalMedals += p.medalsCount;
          }
          this.medaldata.push(totalMedals);
        }
        this.totalCountries = this.countrydata.length;
        this.totalOlympics = this.chartdata.reduce((acc, o) => acc + o.participations.length, 0);
        this.RenderChart(this.countrydata, this.medaldata);
      }
    });
  }

  RenderChart(countrydata: string[], medaldata: number[]) {
    const mychart = new Chart('piechart', {
      type: 'pie',
      data: {
        labels: countrydata,
        datasets: [
          {
            data: medaldata,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              
              label: (context) => {
                const index = context.dataIndex;
                const country = countrydata[index];
                const medals = medaldata[index];
                return `${country}: ${medals} médailles`;
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCountry = countrydata[index];
            this.router.navigate(['/line-chart', selectedCountry], );
          }
        },
      }
    },);
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}