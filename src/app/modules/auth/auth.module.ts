import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: 'login', component: LoginComponent }]),
  ],
  providers: [AuthService],
})
export class AuthModule {}
