import {
  AssignmentOutlined,
  SupervisedUserCircle,
  MenuBookOutlined,
  Task,
  TaskAlt,
  PlaylistAddCheckCircleOutlined,
  BookmarkAddedOutlined
} from '@mui/icons-material';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
// routes
// eslint-disable-next-line import/named
import { PATH_APP } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  calendar: getIcon('ic_calendar'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_APP.dashboard, icon: ICONS.analytics },
      { title: 'calendario', path: PATH_APP.calendar, icon: ICONS.calendar }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'administración',
    items: [
      // MANAGEMENT
      { title: 'actividades', path: PATH_APP.activities, icon: <TaskAlt /> },
      { title: 'objetivos', path: PATH_APP.objectivesManager, icon: <BookmarkAddedOutlined /> },
      { title: 'proyectos', path: PATH_APP.project, icon: <AssignmentOutlined /> },
      { title: 'solicitudes', path: PATH_APP.request, icon: <EventNoteOutlinedIcon /> },
      { title: 'colaboradores', path: PATH_APP.associate, icon: <SupervisedUserCircle /> },
      { title: 'encuestas', path: PATH_APP.inquest, icon: <QuizOutlinedIcon /> },
      {
        title: 'catalogos',
        path: PATH_APP.catalogue,
        icon: <MenuBookOutlined />,
        children: [
          { title: 'areas', path: PATH_APP.area },
          { title: 'roles', path: PATH_APP.subarea }
        ]
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      { title: 'peticiones', path: PATH_APP.petition, icon: <TopicOutlinedIcon /> },
      { title: 'actividades', path: PATH_APP.task, icon: <Task /> },
      { title: 'objetivos', path: PATH_APP.objectives, icon: <PlaylistAddCheckCircleOutlined /> }
    ]
  }
];

export default navConfig;
