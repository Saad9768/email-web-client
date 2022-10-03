import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service/auth-guard.service';
import { EmailClientComponent } from './email-client/email-client.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [{
    path: '', redirectTo: 'login', pathMatch: 'full',

}, {
    path: 'login', component: LoginComponent
}, {
    path: 'register', component: RegisterComponent
}, {
    path: 'email-client', component: EmailClientComponent,canActivate:[AuthGuardService]
}];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ], exports: [RouterModule]
})
export class AppRoutingModule {

}