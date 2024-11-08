import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { OlympicService } from 'src/app/core/services/olympic.service';

Chart.register(...registerables);
Chart.defaults.font.size = 18;

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  country: string = '';
  participations: any[] = [];
  totalMedals: number = 0;
  totalAthletes: number = 0;
  totalEntries: number = 0;

  constructor(
    private route: ActivatedRoute,
    private service: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country') || '';
    this.service.getOlympics().subscribe((data) => {
      const countryData = data!.find((o) => o.country === this.country);

      if (countryData) {
        this.participations = countryData.participations;
        this.totalEntries = this.participations.length;
                    let totalMedals = 0;
                    let totalAthletes = 0;
                    for (const p of this.participations) {
                      totalMedals += p.medalsCount;
                      totalAthletes += p.athleteCount;}
                    this.totalMedals = totalMedals;
                    this.totalAthletes = totalAthletes;

                    const years = this.participations.map((p) => p.year);
        const medals = this.participations.map((p) => p.medalsCount);
        this.renderLineChart(years, medals);
      }
    });
  }

  renderLineChart(years: number[], medals: number[]): void {
    new Chart('linechart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            data: medals,
            label:  'Médailles par année',
            borderColor: '#3e95cd',
            fill: false,
          },
        ],
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
