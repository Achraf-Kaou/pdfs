import { Routes } from '@angular/router';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { LoginComponent } from './pages/login/login.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PdfUploadComponent } from './components/pdfs/pdf-upload/pdf-upload.component';
import { PdfListComponent } from './components/pdfs/pdf-list/pdf-list.component';
import { PdfComponent } from './pages/pdf/pdf.component';
import { ViewComponent } from './pages/view/view.component';
import { PdfsComponent } from './pages/pdfs/pdfs.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'usersList', component: UserListComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'pdfUpload', component: PdfUploadComponent },
    { path: 'pdfList', component: PdfListComponent },
    { path: 'pdf/:id/:version', component: PdfComponent },
    { path: 'view/:id', component: ViewComponent },
    { path: 'pdfs', component: PdfsComponent },
    { path: 'pdfs/search/:search', component: PdfsComponent },

    
/*     { path: '**', redirectTo: '/unauthorized' },
 */    


];
