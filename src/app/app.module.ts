import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PieChartComponent } from './pages/pie-chart/pie-chart-component';
import { LineChartComponent } from './pages/line-chart/line-chart.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, PieChartComponent, LineChartComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
