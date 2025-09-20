import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-backend-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backend-test">
      <h2>Backend API Test</h2>

      <div class="test-section">
        <h3>Test Categories API</h3>
        <button (click)="testCategories()" [disabled]="loading">
          Test Categories
        </button>
        <button (click)="testActiveCategories()" [disabled]="loading">
          Test Active Categories
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <p>Loading...</p>
      </div>

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
      .backend-test {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .test-section {
        margin-bottom: 2rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
      }

      .test-section button {
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
      }

      .test-section button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .loading {
        color: #007bff;
        font-weight: bold;
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
export class BackendTestComponent implements OnInit {
  loading = false;
  result: any = null;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  testCategories(): void {
    this.loading = true;
    this.result = null;
    this.error = '';

    this.http.get(`${environment.apiUrl}/sweet/category`).subscribe({
      next: response => {
        this.loading = false;
        this.result = response;
        console.log('Categories API Response:', response);
      },
      error: error => {
        this.loading = false;
        this.error = JSON.stringify(error, null, 2);
        console.error('Categories API Error:', error);
      },
    });
  }

  testActiveCategories(): void {
    this.loading = true;
    this.result = null;
    this.error = '';

    this.http
      .get(`${environment.apiUrl}/sweet/category/active/list`)
      .subscribe({
        next: response => {
          this.loading = false;
          this.result = response;
          console.log('Active Categories API Response:', response);
        },
        error: error => {
          this.loading = false;
          this.error = JSON.stringify(error, null, 2);
          console.error('Active Categories API Error:', error);
        },
      });
  }
}
