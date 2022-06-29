import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';
// config
import useAuth from '../hooks/useAuth';
// components
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const { user } = useAuth();
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'login/:token',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify/:token', element: <ChangePassword /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      // eslint-disable-next-line no-nested-ternary
      element: user ? (
        user.permissions.filter((obj) => obj.name === 'manager').length > 0 ? (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ) : (
          <AuthGuard>
            <Calendar />
          </AuthGuard>
        )
      ) : (
        <Page403 />
      ),
      children: [{ element: <Navigate to="/dashboard/app" replace /> }, { path: 'app', element: <GeneralAnalytics /> }]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/main" replace /> },
        {
          path: 'main',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Calendar />
            ) : (
              <GeneralAnalytics />
            )
          ) : (
            <Page403 />
          )
        },
        { path: 'calendar', element: <Calendar /> },
        {
          path: 'activity',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <Activity />
            )
          ) : (
            <Activity />
          )
        },
        {
          path: 'objectives',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <Objectives />
            )
          ) : (
            <Objectives />
          )
        },
        {
          path: 'project',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <ProjectPage />
            )
          ) : (
            <ProjectPage />
          )
        },
        {
          path: 'request',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <RequestPage />
            )
          ) : (
            <RequestPage />
          )
        },
        {
          path: 'associate',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <AssociatePage />
            )
          ) : (
            <AssociatePage />
          )
        },
        {
          path: 'area',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <AreaPage />
            )
          ) : (
            <AreaPage />
          )
        },
        {
          path: 'subarea',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'associate').length > 0 ? (
              <Page403 />
            ) : (
              <SubareaPage />
            )
          ) : (
            <SubareaPage />
          )
        },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        { path: 'profile', element: <Profile /> },
        { path: 'petition', element: <PetitionPage /> },
        { path: 'task', element: <Task /> },
        { path: 'activity', element: <Activity /> },
        { path: 'inquest', element: <Inquest /> },
        { path: 'objective', element: <Objective /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    { path: 'inquest/recipient/verify/:uuid', element: <InquestVerify /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const ChangePassword = Loadable(lazy(() => import('../pages/auth/ChangePassword')));
// Dashboard
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
// Main
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
// const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// APP
const ProjectPage = Loadable(lazy(() => import('../pages/project/Project')));
const AssociatePage = Loadable(lazy(() => import('../pages/associate/Associate')));
const AreaPage = Loadable(lazy(() => import('../pages/area/Area')));
const SubareaPage = Loadable(lazy(() => import('../pages/subarea/Subarea')));
const Profile = Loadable(lazy(() => import('../pages/user/Profile')));
const PetitionPage = Loadable(lazy(() => import('../pages/petition/Petition')));
const RequestPage = Loadable(lazy(() => import('../pages/request/Request')));
const Task = Loadable(lazy(() => import('../pages/task/associate/Task')));
const Activity = Loadable(lazy(() => import('../pages/task/manager/Activity')));
const Inquest = Loadable(lazy(() => import('../pages/inquest/Inquest')));
const InquestVerify = Loadable(lazy(() => import('../pages/inquest/InquestVerify')));
const Objective = Loadable(lazy(() => import('../pages/objective/associate/Objective')));
const Objectives = Loadable(lazy(() => import('../pages/objective/manager/Objective')));
const Calendar = Loadable(lazy(() => import('../pages/calendar/Calendar')));
