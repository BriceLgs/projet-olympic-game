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

  // initialisation

  constructor(
    private route: ActivatedRoute,
    private service: OlympicService,
    private router: Router
  ) {}

  // j'insère également mon router pour la navigation

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country') || '';
    // je recupere les pays 
    this.service.getOlympics().subscribe((data) => {
      const countryData = data!.find((o) => o.country === this.country);
      // je cherche les données du pays correspondant

      if (countryData) {
        this.participations = countryData.participations;
        this.totalEntries = this.participations.length;
      //  this.totalMedals = this.participations.reduce((sum, p) => sum + p.medalsCount,0);
      //  this.totalAthletes = this.participations.reduce((sum, p) => sum + p.athleteCount,0);
        // ici, je combine le reduce utilisé précédemment, avec un accumulateur, sa permet de garder en mémoire la somme accumulé a chaque itération.
        // le P correspond a l'élément courant du tableau ,donc le " this participations " a chaque itération
        // Exemple : Itération 1 : sum = 0 (valeur initiale), p.medalsCount = 5 → sum = 0 + 5 = 5.
                    //Itération 2 : sum = 5, p.medalsCount = 10 → sum = 5 + 10 = 15.
                    //Itération 3 : sum = 15, p.medalsCount = 8 → sum = 15 + 8 = 23.
                    //etc..
                    //Une fois fini, reduce retourne la valeur final de l'accumulateur affecté a totalmedals / et toalatheltes
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
