import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import projectReducer from './slices/project';
import associateReducer from './slices/associate';
import userReducer from './slices/user';
import areaReducer from './slices/area';
import subareaReducer from './slices/subarea';
import petitionReducer from './slices/petition';
import taskReducer from './slices/task';
import taskManagerReducer from './slices/taskManager';
import dashboardReducer from './slices/dashboard';
import inquestReducer from './slices/inquest';
import objectiveReducer from './slices/objective';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  project: projectReducer,
  associate: associateReducer,
  user: userReducer,
  area: areaReducer,
  subarea: subareaReducer,
  dashboard: dashboardReducer,
  petition: petitionReducer,
  task: taskReducer,
  taskManager: taskManagerReducer,
  inquest: inquestReducer,
  objective: objectiveReducer
});

export { rootPersistConfig, rootReducer };
