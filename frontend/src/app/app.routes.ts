import { Routes } from '@angular/router';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { LoginComponent } from './pages/login/login.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PdfUploadComponent } from './components/pdfs/pdf-upload/pdf-upload.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PdfListComponent } from './components/pdfs/pdf-list/pdf-list.component';
import { HomeComponent } from './pages/home/home.component';
import { PdfViewComponent } from './components/pdfs/pdf-view/pdf-view.component';
import { PdfComponent } from './pages/pdf/pdf.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'usersList', component: UserListComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'pdfUpload', component: PdfUploadComponent },
    { path: 'pdfList', component: PdfListComponent },
    { path: 'home', component: HomeComponent },
    { path: 'pdf/:id', component: PdfComponent },
    { path: '**', redirectTo: '/unauthorized' }

];
