import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-cors-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cors-test">
      <h2>CORS Test</h2>
      <button (click)="testCors()">Test CORS</button>
      <div *ngIf="result" class="result">
        <h3>Result:</h3>
        <pre>{{ result | json }}</pre>
      </div>
      <div *ngIf="error" class="error">
        <h3>Error:</h3>
        <pre>{{ error }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .cors-test {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }
      .result,
      .error {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
      }
      .result {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
      }
      .error {
        background: #fef2f2;
        border: 1px solid #ef4444;
      }
      pre {
        white-space: pre-wrap;
        word-break: break-all;
      }
    `,
  ],
})
export class CorsTestComponent implements OnInit {
  result: any = null;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  testCors(): void {
    this.result = null;
    this.error = '';

    // Test 1: Simple GET request
    this.http.get(`${environment.apiUrl}/sweet/category`).subscribe({
      next: response => {
        this.result = response;
        console.log('CORS Test Success:', response);
      },
      error: error => {
        this.error = JSON.stringify(error, null, 2);
        console.error('CORS Test Error:', error);
      },
    });
  }
}
