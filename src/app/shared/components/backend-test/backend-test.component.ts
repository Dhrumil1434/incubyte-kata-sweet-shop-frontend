import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-backend-test',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  template: `
    <div class="backend-test">
      <p-card header="Backend Connectivity Test">
        <div class="test-buttons">
          <p-button
            label="Test Backend Health"
            (onClick)="testBackendHealth()"
            severity="primary"
          >
          </p-button>
          <p-button
            label="Test CORS"
            (onClick)="testCors()"
            severity="secondary"
          >
          </p-button>
          <p-button
            label="Test API Endpoints"
            (onClick)="testApiEndpoints()"
            severity="help"
          >
          </p-button>
        </div>

        <div class="test-results" *ngIf="testResults.length > 0">
          <h4>Test Results:</h4>
          <div *ngFor="let result of testResults" class="result-item">
            <strong>{{ result.test }}:</strong>
            <span [class]="result.success ? 'success' : 'error'">
              {{ result.message }}
            </span>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .backend-test {
        padding: 1rem;
        margin: 1rem 0;
      }

      .test-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .test-results {
        margin-top: 1rem;
      }

      .result-item {
        margin: 0.5rem 0;
        padding: 0.5rem;
        border-radius: 4px;
        background: #f5f5f5;
      }

      .success {
        color: green;
        font-weight: bold;
      }

      .error {
        color: red;
        font-weight: bold;
      }
    `,
  ],
})
export class BackendTestComponent {
  testResults: Array<{ test: string; success: boolean; message: string }> = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  testBackendHealth(): void {
    this.http
      .get('http://localhost:5000/health', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: _response => {
          this.addTestResult('Backend Health', true, 'Backend is responding');
          this.messageService.add({
            severity: 'success',
            summary: 'Backend Test',
            detail: 'Backend is accessible and responding',
          });
        },
        error: error => {
          this.addTestResult(
            'Backend Health',
            false,
            `Error: ${error.status} - ${error.message}`
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Backend Test',
            detail: `Backend error: ${error.status} - ${error.message}`,
          });
        },
      });
  }

  testCors(): void {
    this.http
      .options('http://localhost:5000/api/sweets', {
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type,Authorization',
        },
      })
      .subscribe({
        next: _response => {
          this.addTestResult('CORS', true, 'CORS preflight request successful');
          this.messageService.add({
            severity: 'success',
            summary: 'CORS Test',
            detail: 'CORS is properly configured',
          });
        },
        error: error => {
          this.addTestResult(
            'CORS',
            false,
            `CORS error: ${error.status} - ${error.message}`
          );
          this.messageService.add({
            severity: 'error',
            summary: 'CORS Test',
            detail: `CORS error: ${error.status} - ${error.message}`,
          });
        },
      });
  }

  testApiEndpoints(): void {
    // Test sweets endpoint
    this.http
      .get('http://localhost:5000/api/sweets', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      })
      .subscribe({
        next: _response => {
          this.addTestResult(
            'API Endpoints',
            true,
            'API endpoints are accessible'
          );
          this.messageService.add({
            severity: 'success',
            summary: 'API Test',
            detail: 'API endpoints are responding',
          });
        },
        error: error => {
          if (error.status === 401) {
            this.addTestResult(
              'API Endpoints',
              true,
              'API endpoints are accessible (401 expected without valid token)'
            );
            this.messageService.add({
              severity: 'info',
              summary: 'API Test',
              detail:
                'API endpoints are accessible (401 expected without valid token)',
            });
          } else {
            this.addTestResult(
              'API Endpoints',
              false,
              `API error: ${error.status} - ${error.message}`
            );
            this.messageService.add({
              severity: 'error',
              summary: 'API Test',
              detail: `API error: ${error.status} - ${error.message}`,
            });
          }
        },
      });
  }

  private addTestResult(test: string, success: boolean, message: string): void {
    this.testResults.push({ test, success, message });
  }
}
