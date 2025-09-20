import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  title = 'Kata Sweet Shop';
  loaderService = inject(LoaderService);

  get globalLoader() {
    return this.loaderService.globalLoader;
  }
}
