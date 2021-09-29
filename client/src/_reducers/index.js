import { combineReducers } from 'redux';
import user from './user_reducer';

// combineReducers(user, 등) --> rootReducer로 합친다.
const rootReducer = combineReducers({
    user
})

export default rootReducer;