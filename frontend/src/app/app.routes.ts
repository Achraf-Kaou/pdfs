import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PdfContentComponent } from './pages/pdf-content/pdf-content.component';
import { PdfViewComponent } from './pages/pdf-view/pdf-view.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'pdf/:id/:version', component: PdfContentComponent },
    { path: 'view/:id', component: PdfViewComponent },
    { path: 'pdfs', component: HomeComponent },
    { path: 'pdfs/search/:search', component: HomeComponent }
];
