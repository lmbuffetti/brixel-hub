/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, useRef,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  compose, bindActionCreators,
} from 'redux';
import {
  BrixelIcon, BrixelTextArea, BrixelButtonPrimary, BrixelDropdownMini,
  BrixelButtonIcon, useOutsideAlerter, BrixelAvatar,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import flatten from 'lodash/flatten';
import moment from 'moment';
import 'moment/locale/de-ch';
import 'moment/locale/pt';
import 'moment/locale/nl';
import 'moment/locale/se';
import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/de-at';
import 'moment/locale/en-gb';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import {
  createNote, saveActiveSingleNote,
} from '../actions/NoteActions';
import Loading from './Loading';
import {
  createTimelineEntry,
} from '../resources/createTimelineEntry';
import {
  Truncate,
} from '../utils/helpers';

const Timeline = (props) => {
  const [chronologicalData, setChronologicalData] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteOptionsOpen, setNoteOptionsOpen] = useState({
    id: null,
    active: false,
  });
  const [editNote, setEditNote] = useState({
    id: null,
    active: false,
  });
  const [showFullNote, setShowFullNote] = useState({
    id: null,
    active: false,
  });
  const [editNoteText, setEditNoteText] = useState();

  const {
    className, activeProperty, activePropertyGameHistory,
    history, match, isDeal, activePropertyNotes,
    loggedInUser, handleCreateNote, handleSaveNote,
    activeDealNotes, activeDeal, activePropertyHistoryList,
    activePropertyOwnerHistoryList, activeDealHistoryList,
    activeDealOwnerHistoryList,
  } = props;

  const noteRef = useRef(null);
  const noteBtnRef = useRef(null);
  const noteWrapperRef = useRef(null);

  // DOM
  const notBtnEl = noteBtnRef.current;

  const contentClickHandler = (e) => {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;
    e.preventDefault();
    const newPath = last(targetLink.href.split('/'));

    if (newPath.includes('rewardDetail')) {
      history.push(`${match.url}/${newPath}`);
    } else if (targetLink.href.includes('#')) {
      history.push('#');
    } else {
      window.open(targetLink.href, '_blank');
    }
  };

  useEffect(() => {
    let array = [];

    if (isDeal === true && has(activeDeal, 'user.id')) {
      if (activeDealOwnerHistoryList.total > 0 && activeDealOwnerHistoryList.data.length > 0) {
        forEach(activeDealOwnerHistoryList.data, (item) => {
          // For deal timeline we only want user register
          if (item.actionStub === 'user-register' ||
              item.actionStub === 'user-phone-call') {
            array.push(createTimelineEntry(item));
          }
        });
      }

      if (activeDealHistoryList.total > 0 && activeDealHistoryList.data.length > 0) {
        forEach(activeDealHistoryList.data, (item) => {
          if (item.actionStub !== 'create-deal' &&
          (get(item, 'meta.name', '') === 'winner' || get(item, 'meta.name', '') === 'active' || item.actionStub === 'user-phone-call')) {
            array.push(createTimelineEntry(item));
          }
        });
      }

      forEach(activeDealNotes, (note) => {
        set(note, 'timestamp', moment(note.createdAt).valueOf());
        if (note.type === 'page') set(note, 'parent', note.page);
        if (note.type === 'user') set(note, 'parent', note.user);
        if (note.type === 'deal') set(note, 'parent', note.deal);
        array.push(note);
      });
    } else {
      if (activePropertyHistoryList.total > 0 && activePropertyHistoryList.data.length > 0) {
        forEach(activePropertyHistoryList.data, (item) => {
          // We ignore page object updates (besides the price), document updates, favorites, schedules and adding packages
          if (item.actionStub !== 'page-update' &&
              item.actionStub !== 'page-game-achievement' &&
              item.actionStub !== 'page-update-documents' &&
              item.actionStub !== 'page-update-facts' &&
              item.actionStub !== 'page-update-photos' &&
              item.actionStub !== 'page-schedule' &&
              item.actionStub !== 'page-add-favorite' &&
              item.actionStub !== 'page-add-package' &&
              item.actionStub !== 'page-remove-package' &&
              item.actionStub !== 'page-get-document' &&
              item.actionStub !== 'page-receive-message') {
            array.push(createTimelineEntry(item));
          }
        });
      }

      if (activePropertyOwnerHistoryList.total > 0 && activePropertyOwnerHistoryList.data.length > 0) {
        forEach(activePropertyOwnerHistoryList.data, (item) => {
          // We want to get the user recovery and welcome to Brixel messages
          if (item.actionStub === 'user-recover-password' ||
              item.actionStub === 'user-register') {
            array.push(createTimelineEntry(item));
          }
        });
      }

      forEach(activePropertyGameHistory, (reward) => {
        // We don't consider the Homebase and Brixel Page published rewards for creating a property
        if (reward.title !== 'Homebase' &&
            reward.title !== 'Brixel Page') {
          array.push(createTimelineEntry(reward));
        }
      });

      forEach(activePropertyNotes, (note) => {
        set(note, 'timestamp', moment(note.createdAt).valueOf());
        if (note.type === 'page') set(note, 'parent', note.page);
        if (note.type === 'user') set(note, 'parent', note.user);
        if (note.type === 'deal') set(note, 'parent', note.deal);
        array.push(note);
      });
    }

    // Using lodash to order the object by timestamp, with the most recent on top
    array = orderBy(flatten(array), ['pinned', 'timestamp'], ['desc', 'desc']);

    // Sets the processed data to be shown
    setChronologicalData(array);
  }, [activeDeal, activeDealNotes, activeDealHistoryList, activeDealOwnerHistoryList,
    activePropertyNotes, activePropertyHistoryList, activePropertyOwnerHistoryList,
    activePropertyGameHistory]);

  const addNewNote = (content) => {
    const data = {
      type: isDeal === true ? 'deal' : 'page',
      content: {
        parent: isDeal === true ? activeDeal.id : activeProperty.id,
        content,
      },
    };
    setNewNote('');
    handleCreateNote(data);
    if (notBtnEl) notBtnEl.classList.remove('clicked');
  };

  const deleteNote = (e, event) => {
    if (e) e.preventDefault();
    const payload = {
      id: event.id,
      type: isDeal === true ? 'deal' : 'page',
      object: isDeal === true ? activeDeal.id : activeProperty.id,
      data: {
        active: false,
      },
    };
    handleSaveNote(payload);
  };

  const handlePinNote = (e, event) => {
    if (e) e.preventDefault();
    const payload = {
      id: event.id,
      type: isDeal === true ? 'deal' : 'page',
      object: isDeal === true ? activeDeal.id : activeProperty.id,
      data: {
        pinned: !event.pinned,
      },
    };
    handleSaveNote(payload);
  };

  const updateNote = (e, id) => {
    e.preventDefault();
    const payload = {
      id,
      type: isDeal === true ? 'deal' : 'page',
      object: isDeal === true ? activeDeal.id : activeProperty.id,
      data: {
        content: editNoteText,
      },
    };
    handleSaveNote(payload);
  };

  const openTruncatedText = (event, index) => {
    event.preventDefault();
    setShowFullNote({
      id: index,
      active: true,
    });
  };

  const truncateText = (event) => {
    event.preventDefault();
    setShowFullNote({
      id: null,
      active: false,
    });
  };

  // Function to close the small menus when we click outside
  useOutsideAlerter(noteRef, {
    action: 'function',
    func: () => {
      setNoteOptionsOpen({
        id: null,
        active: false,
      });
    },
  });

  const collapseNote = () => {
    if (notBtnEl) notBtnEl.classList.add('clicked');
  };

  const getEventColor = (icon) => {
    if (icon === 'question') return 'red';
    if (icon === 'check') return 'primary';
    if (icon === 'info') return 'primary';
    if (icon === 'account') return 'primary';
    if (icon === 'shopping-cart') return 'green';
    if (icon === 'mail') return 'light';
    return 'primary';
  };

  useOutsideAlerter(noteWrapperRef, {
    action: 'function',
    func: () => {
      if (notBtnEl) notBtnEl.classList.remove('clicked');
    },
  });

  if (!activeProperty) {
    return (
      <Loading />
    );
  }

  return (
    <div className={`timeline dis-fl-col ${className}`}>
      <span className="title overline tt-up mb-3">History</span>
      <div className="events-container w-perc-100 dis-fl-col a-c">
        <div ref={noteWrapperRef} className="add-note-container w-perc-100 dis-fl-col p-2 mb-1 md-md-4">
          <div className="text-container dis-fl-row">
            <BrixelAvatar
              avatarImg={get(loggedInUser, 'user.avatar[0]', '') ? getConfigEnv.shortPath + get(loggedInUser, 'user.avatar[0]', '').thumbnailPath : null}
              name={get(loggedInUser, 'user.name', loggedInUser.user.email)}
              profileId={get(loggedInUser, 'user.id', '')}
            />
            <BrixelTextArea
              isSmall
              className="w-perc-100 ml-2"
              input={{
                onChange: (val) => setNewNote(val),
                onFocus: () => collapseNote(),
                // onBlur: (val) => setNewNote(val),
                value: newNote,
              }}
              type="text"
              placeholder="Add a note..."
            />
          </div>
          <div
            ref={noteBtnRef}
            className="addBtn dis-f jc-fe mt-1"
          >
            <BrixelButtonPrimary
              small
              rounded
              label="Add"
              disabled={!newNote}
              onClick={() => addNewNote(newNote)}
            />
          </div>
        </div>
        {
          chronologicalData && chronologicalData.map((event, i) => (
            <div
              className={`single-event p-small-12 w-perc-100 dis-fl-row a-t bgWhite mb-2 brdRadius ${has(event, 'parent') ? 'note' : ''} ${has(event, 'parent') && event.pinned ? 'pinned' : ''}`}
              id={`note-${i}`}
              key={i.toString()}
            >
              {
                !has(event, 'parent') ? (
                  <>
                    <BrixelIcon
                      icon={event.icon}
                      noBorder
                      background={getEventColor(event.icon)}
                      saturation={100}
                      color={event.icon === 'mail' ? 'Dark' : getEventColor(event.icon)}
                      saturationTxt={700}
                      className="mr-2 historyIcons"
                    />
                    <div className="dis-fl-col">
                      <p
                        className="description fsize-300"
                        onClick={(e) => contentClickHandler(e)}
                        dangerouslySetInnerHTML={{
                          __html: event.description,
                        }}
                      />
                      <div className="dis-fl-row">
                        <span className="fsize-100 txtDark200">{event.formattedDate}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`w-perc-100 jc-b ${editNote.id === event.id && editNote.active ? 'dis-fl-col' : 'dis-fl-row'}`}>
                    <div className="dis-fl-col jc-b w-perc-100">
                      {
                        (editNote.id === event.id && editNote.active) ? (
                          <div className="dis-f">
                            <BrixelAvatar
                              name={get(find(event.history, (el) => (el.type === 'create')), 'author.name', '')}
                              profileId={get(find(event.history, (el) => (el.type === 'create')), 'author.user_id', '')}
                              /* avatarImg={get(find(event.history, (el) => (el.type === 'create')), 'author.avatar[0]', '') ? getConfigEnv.shortPath + get(find(event.history, (el) => (el.type === 'create')), 'author.avatar[0]', '').thumbnailPath : null} */
                            />
                            <BrixelTextArea
                              className="zIndex1 ml-2 w-perc-100"
                              input={{
                                onChange: (val) => setEditNoteText(val),
                                onFocus: () => '',
                                value: editNoteText,
                              }}
                              type="text"
                              placeholder="Edit this note"
                            />
                          </div>
                        ) :
                          (
                            <span
                              className="description"
                              dangerouslySetInnerHTML={{
                                __html: (Truncate(event.content, 62, (showFullNote.id === i && showFullNote.active)).replace(/(?:\r\n|\r|\n)/g, '<br>')),
                              }}
                            />
                          )
                      }
                      {
                        (editNote.id !== event.id) && (
                          <div className="dis-fl-row mt-1">
                            <span className="fsize-100 txtDark700 mr-2">
                              { get(find(event.history, (el) => (el.type === 'create')), 'author.name', 'BOT') }
                            </span>
                            <span className="fsize-100 txtDark200">
                              {moment(event.createdAt).format('D MMM YYYY, H:mm')}
                            </span>
                          </div>
                        )
                      }
                    </div>
                    <div className={`actions dis-fl-col jc-b pos-r ${editNote.id === event.id && editNote.active ? '' : 'mr-1-neg mt-1-neg'}`}>
                      {
                        get(event, 'content', '') && event.content.length > 62 && !editNote.active && (
                          <BrixelButtonIcon
                            className="as-fe"
                            bgTransparent
                            noBorder
                            color="dark"
                            saturationTxt={400}
                            fontSize={16}
                            icon={`${showFullNote.id === i && showFullNote.active ? 'arrow-simple-up' : 'arrow-simple-down'}`}
                            onClick={(e) => {
                              if (showFullNote.id !== i && !showFullNote.active) {
                                openTruncatedText(e, i);
                              } else if (showFullNote.id === i && !showFullNote.active) {
                                openTruncatedText(e, i);
                              } else if (showFullNote.id === i && showFullNote.active) {
                                truncateText(e, i);
                              } else {
                                openTruncatedText(e, i);
                              }
                            }}
                          />
                        )
                      }
                      <div className="dis-fl-row h-perc-100 jc-b a-c">
                        {
                          (editNote.id === event.id && editNote.active) ? (
                            <div className="dis-fl-row w-perc-100 jc-fe pt-2">
                              <BrixelButtonSecondary
                                saturationTxt={400}
                                rounded
                                small
                                label="Cancel"
                                onClick={() => {
                                  setEditNoteText();
                                  setEditNote({
                                    id: null,
                                    active: false,
                                  });
                                }}
                                className="mr-1"
                              />
                              <BrixelButtonPrimary
                                label="Save"
                                rounded
                                small
                                onClick={(e) => {
                                  updateNote(e, event.id);
                                  // set(event, 'content', editNoteText);
                                  setEditNote({
                                    id: null,
                                    active: false,
                                  });
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="as-fe dis-f a-c mb-1-neg pos-r">
                                {
                                  event.pinned && (
                                    <BrixelButtonIcon
                                      brdOnHover
                                      className="mr-1"
                                      icon="pin-filled"
                                      color="red"
                                      background="Light"
                                      saturation={200}
                                      saturationTxt={300}
                                      fontSize={14}
                                      onClick={(e) => {
                                        handlePinNote(e, event);
                                        setNoteOptionsOpen({
                                          id: null,
                                          active: false,
                                        });
                                      }}
                                    />
                                  )
                                }
                                <BrixelButtonIcon
                                  brdOnHover
                                  background="Light"
                                  color="dark"
                                  saturationTxt={400}
                                  saturation={200}
                                  fontSize={14}
                                  icon="options-vertical"
                                  onClick={() => {
                                    setEditNote({
                                      id: null,
                                      active: false,
                                    });
                                    setNoteOptionsOpen({
                                      id: event.id,
                                      active: !noteOptionsOpen.active,
                                    });
                                  }}
                                />
                                {
                                  (noteOptionsOpen.id === event.id && noteOptionsOpen.active) && (
                                    <>
                                      <BrixelDropdownMini
                                        topOffset={40}
                                        rightAligned
                                        ref={noteRef}
                                        links={
                                          [
                                            {
                                              label: `${event.pinned ? 'Remove pin' : 'Pin to top'}`,
                                              clickFunc: (e) => {
                                                handlePinNote(e, event);
                                                setNoteOptionsOpen({
                                                  id: null,
                                                  active: false,
                                                });
                                              },
                                            },
                                            {
                                              label: 'Edit',
                                              clickFunc: () => {
                                                setEditNoteText(event.content);
                                                setEditNote({
                                                  id: event.id,
                                                  active: !editNote.active,
                                                });
                                                setNoteOptionsOpen({
                                                  id: null,
                                                  active: false,
                                                });
                                              },
                                            },
                                            {
                                              label: 'Delete',
                                              className: 'txtRed400',
                                              clickFunc: (e) => {
                                                deleteNote(e, event);
                                                setNoteOptionsOpen({
                                                  id: null,
                                                  active: false,
                                                });
                                              },
                                            },
                                          ]
                                        }
                                      />
                                    </>
                                  )
                                }
                              </div>
                            </>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

Timeline.propTypes = {
  activeProperty: PropTypes.object.isRequired,
  activeDeal: PropTypes.object.isRequired,
  activePropertyGameHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  isDeal: PropTypes.bool,
  loggedInUser: PropTypes.object.isRequired,
  activePropertyNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDealNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCreateNote: PropTypes.func.isRequired,
  handleSaveNote: PropTypes.func.isRequired,
  activePropertyHistoryList: PropTypes.object.isRequired,
  activeDealHistoryList: PropTypes.object.isRequired,
  activePropertyOwnerHistoryList: PropTypes.object.isRequired,
  activeDealOwnerHistoryList: PropTypes.object.isRequired,
};

Timeline.defaultProps = {
  className: '',
  isDeal: false,
};

const mapStateToProps = (state) => ({
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  activeDeal: get(state, 'deal.activeSingleDeal', {}),
  activePropertyGameHistory: get(state, 'property.activePropertyGameHistory', []),
  activePropertyHistoryList: get(state, 'property.activeSinglePropertyHistory', {}),
  activeDealHistoryList: get(state, 'deal.activeSingleDealHistory', {}),
  activePropertyOwnerHistoryList: get(state, 'property.activeSinglePropertyOwnerHistory', {}),
  activeDealOwnerHistoryList: get(state, 'deal.activeSingleDealOwnerHistory', {}),
  activePropertyNotes: get(state, 'property.activeSinglePropertyNotes', []),
  activeDealNotes: get(state, 'deal.activeSingleDealNotes', []),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreateNote: bindActionCreators(createNote, dispatch),
  handleSaveNote: bindActionCreators(saveActiveSingleNote, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Timeline);
