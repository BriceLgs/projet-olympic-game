import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PieChartComponent } from './pages/pie-chart/pie-chart-component';
import { LineChartComponent } from './pages/line-chart/line-chart.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'pie-chart', component: PieChartComponent },
  { path: '', redirectTo: '/pie-chart', pathMatch: 'full' },
  { path: 'line-chart/:country', component: LineChartComponent },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
