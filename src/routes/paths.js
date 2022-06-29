// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/main';
const ROOTS_PROJECT = '/project';
const ROOTS_ASSOCIATE = '/associate';
const ROOTS_CATALOGUE = '/catalogue';
const ROOTS_AREA = '/area';
const ROOTS_SUBAREA = '/subarea';
const ROOTS_PETITION = '/petition';
const ROOTS_REQUEST = '/request';
const ROOTS_TASK = '/task';
const ROOTS_ACTIVITY = '/activity';
const ROOTS_INQUEST = '/inquest';
const ROOTS_OBJECTIVES = '/objective';
const ROOTS_CALENDAR = '/calendar';
const ROOTS_OBJECTIVES_MANAGER = '/objectives';

// ----------------------------------------------------------------------
export const MAILTO_OMS = 'mailto:soporteoms@agarcia.com.mx';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  profile: path('', '/profile'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  }
};

export const PATH_APP = {
  dashboard: ROOTS_DASHBOARD,
  project: ROOTS_PROJECT,
  catalogue: ROOTS_CATALOGUE,
  area: ROOTS_AREA,
  subarea: ROOTS_SUBAREA,
  associate: ROOTS_ASSOCIATE,
  petition: ROOTS_PETITION,
  request: ROOTS_REQUEST,
  task: ROOTS_TASK,
  activities: ROOTS_ACTIVITY,
  inquest: ROOTS_INQUEST,
  objectives: ROOTS_OBJECTIVES,
  calendar: ROOTS_CALENDAR,
  objectivesManager: ROOTS_OBJECTIVES_MANAGER
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
