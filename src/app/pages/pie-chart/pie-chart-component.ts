import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { OlympicModels } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
Chart.register(...registerables);
// pour pouvoir utiliser la bibliotheque de chart.js

@Component({
  selector: 'pie-chart',
  standalone: false,
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.scss',
})
// standalone false pour indiquer qu'il a besoin d'autre module et composants
export class PieChartComponent implements OnInit, OnDestroy {
  chartdata: OlympicModels[] = [];
  countrydata: string[] = [];
  medaldata: number[] = [];
  subscription: Subscription | undefined;

  // ici j'initialise mes tableaux, a un tableau vide

  constructor(private service: OlympicService, private router : Router) {}
  //j'injecte OlympicService pour récuperer les données. Il est " private " pour ne pas sortir du composant

  ngOnInit(): void {

    this.service.loadInitialData();
    //j'appelle la methode qui se trouve dans olympicservice, pour charger les données initiale
    this.subscription = this.service.getOlympics().subscribe((data) => {
      if (data) {
        // vérifie si j'ai les donnés, si elle ont était recu
        this.chartdata = data;
        // Puis je stock les donnés
        this.countrydata = this.chartdata.map(o => o.country);
        // J'utilise map pour aller chercher le nom des pays et les extraires, et les mettre dans countrydata. le "o" correspond a un élément du tableau. Remplacable, c'est juste la logique qui reste la même.
        // this.medaldata = this.chartdata.map(o => o.participations.reduce((total, p) => total + p.medalsCount, 0));
        //pareil,sauf que la on a besoin du total de medailles pour chaque pays. j'utilise donc reduce. en argument je met le total, et la representation de chaque participations. le 0 c'est pour la valeur initiale.
        for (const o of this.chartdata) {
          let totalMedals = 0;
          for (const p of o.participations) {
            totalMedals += p.medalsCount;
          }
          this.medaldata.push(totalMedals);
        }
        // push pour ajouter l'élément au tableau dynamique.
        this.RenderChart(this.countrydata, this.medaldata);
        //ensuite j'appelle ma methode pour creer le graphique, avec les labels des pays, et le nombre total de médailles
      }
    });
  }

  RenderChart(countrydata: string[], medaldata: number[]) {
    const mychart = new Chart('piechart', {
      // c'est ce qui va contenir mon graphique
      type: 'pie',
      data: {
        labels: countrydata,
        // les étuiqette du graph seront les noms des pays
        datasets: [
          {
            data: medaldata,
            // backgroundColor: backgroundColor,
            //on va afficher les nombres de médailles pour chaque pays
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              
              label: (context) => {
                const index = context.dataIndex;
                // 
                const country = countrydata[index];
                // on récupere la position au pays survolé
                const medals = medaldata[index];
                // on récupere le nombre de médailles au pays survolé
                return `${country}: ${medals} médailles`;
                // on retourne une chaine formaté pour les afficher
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
      },
      
    });
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}