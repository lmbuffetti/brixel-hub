import { combineReducers } from 'redux';
import { formReduxer } from '@brixel-io/brixel-components/dist/form';
import translations from '@brixel-io/brixel-components/dist/Reducer/TranslationsReducer';
import common from './CommonReducer';
import companies from './CompanyReducer';
import deal from './DealReducer';
import history from './HistoryReducer';
import market from './MarketReducer';
import lead from './LeadReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import notes from './NoteReducer';
import craftCMS from './CraftCMS';
export const rootReducer = combineReducers({
    brixelForm: formReduxer,
    translations,
    common,
    companies,
    craftCMS,
    deal,
    history,
    lead,
    market,
    notes,
    property,
    user,
});
export default rootReducer;
