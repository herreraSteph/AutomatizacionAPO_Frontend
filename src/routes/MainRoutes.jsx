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
const CrearNumero = Loadable(lazy(() => import('views/Proyectos/CrearNumero')));
const Cronograma = Loadable(lazy(() => import('views/Proyectos/Cronograma')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const DescripcionMaterial = Loadable(lazy(() => import('views/Proyectos/DescripcionMaterial')));
const ManoObra = Loadable(lazy(() => import('views/Proyectos/AsignacionManoObra')));
const MaterialesGantt = Loadable(lazy(() => import('views/Proyectos/MaterialesGantt')));
import RedirectComponent from "./RedirectComponent";
const CPC = Loadable(lazy(() => import('views/Proyectos/CPC')));
const TablaCompleta = Loadable(lazy(() => import('views/Proyectos/TablaCompleta')));
const PreciosUnitarios = Loadable(lazy(() => import('views/Proyectos/PreciosUnitarios')));
const DescargaCPC = Loadable(lazy(() => import('views/Proyectos/DescargaCPC')));
const Editar = Loadable(lazy(() => import('views/Proyectos/Editar')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <RedirectComponent />
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
          element: <DescripcionMaterial />
        },
        {
          path: 'AsignacionManoObra',
          element: <ManoObra />
        },
        {
          path: 'Equipo',
          element: <MaterialesGantt />
        },
        {
          path: 'CPC',
          element: <CPC />
        },
        {
          path: 'TablaCompleta',
          element: <TablaCompleta />
        },
        {
          path: 'PreciosUnitarios',
          element: <PreciosUnitarios />
        },
        {
          path: 'DescargaCPC',
          element: <DescargaCPC />
        },
        {
          path: 'Editar',
          element: <Editar />
        }
       
      ]
    }
  ]
};

export default MainRoutes;