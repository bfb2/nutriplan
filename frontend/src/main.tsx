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
import NotFound from './components/Routes/NotFound.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <div>error</div>,
    children:[
      {
        path: "/nutriplan/dashboard",
        element: <Dashboard/>
      },
      
      {
        path: "/nutriplan/diary",
        element: <Diary/>
      },
      {
        path: "/nutriplan/report",
        element: <Report/>
      },
      {
        path:'/nutriplan/meal',
        element:<Meal/>
      },
      {
        path:'/nutriplan/recipe',
        element:<Recipes/>
      },
      {
        path:'nutriplan/food',
        element:<Food/>
      },
      { 
        path:'nutriplan/settings',
        element:<Settings/>
      }
    ],
  },
   {
    path:'nutriplan/signup',
    element: <SignUp/>,
  },
  {
    path:'nutriplan/login',
    element:<Login/>,
  },
  {
    path:'/*',
    element:<NotFound/>
  } 
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
