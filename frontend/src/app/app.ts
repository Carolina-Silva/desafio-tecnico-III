import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink  } from '@angular/router';
import { LoadingService } from './shared/loading';
import { Spinner } from './shared/spinner/spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Spinner, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public loadingService = inject(LoadingService);
  protected readonly title = signal('frontend');
}
