import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { REQUEST_DONE, SEND_MESSAGE, SEND_MESSAGE_CONTACT, SEND_SLACK_NOTIFICATION, SEND_SUPPORT_MESSAGE, SET_NOTIFICATION, SET_SAVED_SCREEN, SET_SCREEN_NOTIFICATION, SPINNER_OFF, SPINNER_ON, SPINNER_SMALL, SEND_RATE, } from '../actions/types/CommonTypes';
import api from '../controllers/api/config';
const checkCommon = (store) => (next) => (action) => {
    switch (action.type) {
        // DISPATCH TO SEND EMAIL
        case SEND_MESSAGE: {
            next(action);
            const data = cloneDeep(action.payload);
            const { smallLoader } = data;
            delete data.smallLoader;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            api.common.sendMessage(data)
                .then(() => {
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: 'sentMessage',
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_OFF,
                    });
                }
            });
            break;
        }
        // DISPATCH TO SUPPORT EMAIL
        case SEND_SUPPORT_MESSAGE: {
            next(action);
            const data = cloneDeep(action.payload);
            const { smallLoader } = data;
            delete data.smallLoader;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
                store.dispatch({
                    type: REQUEST_DONE,
                    payload: true,
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            api.common.sendSupportMessage(data)
                .then(() => {
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_OFF,
                    });
                }
            });
            break;
        }
        // DISPATCH SEND MESSAGE CONTACT
        case SEND_MESSAGE_CONTACT: {
            next(action);
            const data = cloneDeep(action.payload);
            const { smallLoader } = data;
            delete data.smallLoader;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            api.common.sendMessageContact(data)
                .then(() => {
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            sendData: true,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_OFF,
                    });
                }
            });
            break;
        }
        // DISPATCH TO SHOW NOTIFICATION SAVED
        case SET_SAVED_SCREEN: {
            next(action);
            const { notification } = store.getState().common;
            notification.actions = [
                {
                    type: 'primary',
                    label: '',
                    func: () => '',
                    leftIcon: 'check',
                    isLoading: null,
                },
            ];
            notification.label = 'Saved!';
            notification.className = 'saved';
            setTimeout(() => {
                store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: notification });
            }, 100);
            setTimeout(() => {
                store.dispatch({
                    type: SET_SCREEN_NOTIFICATION,
                    payload: {
                        ...notification,
                        state: false,
                    },
                });
            }, 1500);
            break;
        }
        // DISPATCH NOTIFICATION
        case SET_SCREEN_NOTIFICATION: {
            next(action);
            let notification = cloneDeep(get(store.getState(), 'common.notification', []));
            const errorExist = notification.filter((item) => item.type === action.payload.type && item.label === action.payload.label);
            let delaySetState = 0;
            if (action.payload.type === 'resetAll') {
                // notification = [];
            }
            else if (errorExist.length === 0 && action.payload.state) {
                const checkAlert = notification.filter((item) => item.type === 'alert');
                if (action.payload.type === 'save' && checkAlert.length > 0)
                    notification = [action.payload];
                else
                    notification.push(action.payload);
            }
            else if (action.payload.type === 'save') {
                const getIndex = notification.findIndex((item) => item.type === action.payload.type);
                if (notification[getIndex])
                    notification[getIndex].state = action.payload.state;
                if (action.payload.action !== notification[getIndex].action && getIndex >= 0) {
                    notification[getIndex].action = action.payload.action;
                }
                else if (!action.payload.state) {
                    store.dispatch({ type: SET_NOTIFICATION, payload: cloneDeep(notification) });
                    delaySetState = 4000;
                }
            }
            else if (!action.payload.state) {
                const getIndex = notification.findIndex((item) => item.type === action.payload.type && item.label === action.payload.label);
                const getIndexSaveData = notification.findIndex((item) => item.action === 'saveData');
                if (notification[getIndex])
                    notification[getIndex].state = action.payload.state;
                if (notification[getIndexSaveData]) {
                    delete notification[getIndexSaveData].action;
                }
                store.dispatch({ type: SET_NOTIFICATION, payload: cloneDeep(notification) });
                delaySetState = 1000;
            }
            if (delaySetState === 0) {
                store.dispatch({ type: SET_NOTIFICATION, payload: notification });
            }
            else {
                setTimeout(() => {
                    notification = cloneDeep(get(store.getState(), 'common.notification', []));
                    const getIndex = notification.findIndex((item) => item.type === action.payload.type && item.label === action.payload.label);
                    if (getIndex >= 0)
                        notification.splice(getIndex, 1);
                    store.dispatch({ type: SET_NOTIFICATION, payload: notification });
                }, delaySetState);
            }
            break;
        }
        // SEND SLACK NOTIFICATION
        case SEND_SLACK_NOTIFICATION: {
            next(action);
            const { data, channel, } = action.payload;
            api.common.sendSlackNotification(data, channel)
                .then((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
            });
            break;
        }
        // SEND RATE
        case SEND_RATE: {
            next(action);
            const data = cloneDeep(action.payload);
            const { smallLoader } = data;
            delete data.smallLoader;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            api.common.sendRate(data)
                .then(() => {
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
            });
            break;
        }
        default:
            next(action);
    }
};
export default checkCommon;
