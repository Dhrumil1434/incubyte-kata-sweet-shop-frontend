import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  title = 'Kata Sweet Shop';
}
