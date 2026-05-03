import { Routes } from '@angular/router'; 
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Tokens } from './components/tokens/tokens';
import { Services } from './components/service/services';


export const routes: Routes = [
    {path:'', component:Login}, 
    {path:'dashboard', 
    component: Dashboard, 
    children: [
    { path: 'users', component: Users },
    { path: 'tokens', component: Tokens },
    { path: 'services', component: Services },
    
    ]
    }
];
