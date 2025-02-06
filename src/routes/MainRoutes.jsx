import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const CrearNumero = Loadable(lazy(() => import('views/Proyectos/CrearNumero')));
const Cronograma = Loadable(lazy(() => import('views/Proyectos/Cronograma')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const DescripcionMaterial = Loadable(lazy(() => import('views/Proyectos/DescripcionMaterial')));
const CPC = Loadable(lazy(() => import('views/Proyectos/CPC')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
   
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'proyectos',
      children: [
        {
          path: 'crear-numero',
          element: <CrearNumero />
        },
        {
          path: 'cronograma',
          element: <Cronograma />
        },
        {
          path: 'DescripcionMaterial',
          element : <DescripcionMaterial />
        },
        {
          path: 'CPC',
          element : <CPC />
        }
      ]
    }
  ]
};

export default MainRoutes;
