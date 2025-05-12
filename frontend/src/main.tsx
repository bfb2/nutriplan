import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import './index.css'
import Dashboard from './components/Routes/Dashboard.tsx'
import Report from './components/Routes/Report.tsx'
import Meal from './components/Routes/Meal.tsx'
import Root from './components/Routes/Root.tsx'
import Diary from './components/Routes/Diary.tsx'
import Recipes from './components/Routes/Recipes.tsx'
import Food from './components/Routes/Food.tsx'
import Settings from './components/Routes/Settings.tsx'
import SignUp from './components/Routes/SignUp.tsx'
import Login from './components/Routes/Login.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <div>error</div>,
    action: ()=>redirect('/dashboard'),
    children:[
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      
      {
        path: "/diary",
        element: <Diary/>
      },
      {
        path: "/report",
        element: <Report/>
      },
      {
        path:'/meal',
        element:<Meal/>
      },
      {
        path:'/recipe',
        element:<Recipes/>
      },
      {
        path:'food',
        element:<Food/>
      },
      { 
        path:'settings',
        element:<Settings/>
      },
      
      {
        path:'/*',
        element:<div>404</div>
      }
    ],
  },
   {
    path:'signup',
    element: <SignUp/>,
  },
  {
    path:'login',
    element:<Login/>,
  } 
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
