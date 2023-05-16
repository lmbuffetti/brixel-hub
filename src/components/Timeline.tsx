/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {
  BrixelAvatar,
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelDropdownMini,
  BrixelIcon,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import BrixelTextEditor from '@brixel/brixel-components/dist/components/Form/BrixelTextEditor';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import flatten from 'lodash/flatten';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import {DateTime} from 'luxon';
import {createNote, saveActiveSingleNote} from '../actions/NoteActions';
import Loading from './Loading';
import {createTimelineEntry} from '../resources/Deals/createTimelineEntry';
import {Truncate} from '../utils/helpers';
import type {TimelineType} from '../@types/components/Timeline';

const Timeline = (props: TimelineType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const [chronologicalData, setChronologicalData] = useState<object[]>([]);
  const [noteOptionsOpen, setNoteOptionsOpen] = useState<{id: number | null, active: boolean}>({
    id: null,
    active: false,
  });
  const [editNote, setEditNote] = useState<{id: number | null, active: boolean}>({
    id: null,
    active: false,
  });
  const [showFullNote, setShowFullNote] = useState<{id: number | null, active: boolean}>({
    id: null,
    active: false,
  });
  const [editNoteText, setEditNoteText] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [currentInitialValue, setCurrentInitialValue] = useState('');

  const {
    activeDeal,
    activeDealHistoryList,
    activeDealNotes,
    activeDealOwnerHistoryList,
    activeProperty,
    activePropertyHistoryList,
    activePropertyNotes,
    activePropertyOwnerHistoryList,
    activeSingleCompany,
    className = '',
    handleCreateNote,
    handleSaveNote,
    isDeal = false,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;

  const noteRef = useRef() as React.RefObject<HTMLInputElement>;
  const noteBtnRef = useRef() as React.RefObject<HTMLDivElement> | undefined;
  const noteWrapperRef = useRef() as React.RefObject<HTMLDivElement> | undefined;

  // DOM
  const notBtnEl = noteBtnRef ? noteBtnRef.current : null;

  const contentClickHandler = (e) => {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;
    e.preventDefault();
    const newPath = last(targetLink.href.split('/'));

    if (newPath && typeof newPath === 'string' && newPath.includes('rewardDetail')) {
      const path = get(history, 'location.pathname', '').replace(/\/$/, '');
      history.push(`${path}/${newPath}`);
    } else if (targetLink.href.includes('#')) {
      history.push('#');
    } else {
      window.open(targetLink.href, '_blank');
    }
  };

  useEffect(() => {
    let array: object[] = [];
    if (isDeal === true && has(activeDeal, 'user.id')) {
      if (activeDealOwnerHistoryList.total > 0 && activeDealOwnerHistoryList.data.length > 0) {
        forEach(activeDealOwnerHistoryList.data, (item) => {
          array.push(createTimelineEntry(item, lang));
        });
      }

      if (activeDealHistoryList.total > 0 && activeDealHistoryList.data.length > 0) {
        // eslint-disable-next-line consistent-return
        forEach(activeDealHistoryList.data, (item) => {
          // We need to call this stub on the history api to process
          // the visit feedback on the deal but we don't need it on the timeline
          if (item.actionStub !== 'deal-feedback-visit') array.push(createTimelineEntry(item, lang));
        });
      }

      forEach(activeDealNotes, (note) => {
        set(note, 'timestamp', note.createdAt);
        if (note.type === 'page') set(note, 'parent', note.page);
        if (note.type === 'user') set(note, 'parent', note.user);
        if (note.type === 'deal') set(note, 'parent', note.deal);
        array.push(note);
      });
    } else {
      if (activePropertyHistoryList.total > 0 && activePropertyHistoryList.data.length > 0) {
        forEach(activePropertyHistoryList.data, (item) => {
          // We ignore page object updates (besides the price), document updates, favorites, schedules and adding packages
          array.push(createTimelineEntry(item, lang));
        });
      }

      if (activePropertyOwnerHistoryList.total > 0 && activePropertyOwnerHistoryList.data.length > 0) {
        forEach(activePropertyOwnerHistoryList.data, (item) => {
          // We want to get the user recovery and welcome to Brixel messages
          array.push(createTimelineEntry(item, lang));
        });
      }

      forEach(activePropertyNotes, (note) => {
        set(note, 'timestamp', note.createdAt);
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
    activePropertyNotes, activePropertyHistoryList, activePropertyOwnerHistoryList]);

  const addNewNote = (content) => {
    const data = {
      type: isDeal === true ? 'deal' : 'page',
      content: {
        company: activeSingleCompany.id,
        parent: isDeal === true ? activeDeal.id : activeProperty.id,
        content: content.replace(/\n$/, ''),
        private: false,
      },
      smallLoader: 'saveNote',
    };
    handleCreateNote(data);
    if (notBtnEl) notBtnEl.classList.remove('clicked');
  };

  const deleteNote = (e, event) => {
    if (e) e.preventDefault();
    const payload = {
      id: get(event, 'id', ''),
      type: isDeal === true ? 'deal' : 'page',
      object: isDeal === true ? activeDeal.id : activeProperty.id,
      data: {
        active: false,
      },
    };
    handleSaveNote(payload);
  };

  useEffect(() => {
    if (isSmallLoading.saveNote === false) {
      setNewNote('');
      setEditNoteText('');
      setCurrentInitialValue('');
    }
  }, [isSmallLoading]);

  const handlePinNote = (e, event) => {
    if (e) e.preventDefault();
    const payload = {
      id: get(event, 'id', ''),
      type: isDeal === true ? 'deal' : 'page',
      object: isDeal === true ? activeDeal.id : activeProperty.id,
      data: {
        pinned: !get(event, 'pinned', ''),
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
        content: editNoteText ? editNoteText.replace(/\n$/, '') : '',
      },
      isSmallLoading: 'saveNote',
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
    document.getElementsByClassName('rdw-editor-toolbar')[0].classList.remove('hide');
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
      <span className="title overline tt-up mb-3">{translateTo('History', lang)}</span>
      <div className="events-container w-perc-100 dis-fl-col a-c">
        <div ref={noteWrapperRef} className="add-note-container p-2 bgWhite brdRadius brdSmall brdText100 w-perc-100 dis-fl-col pb-2 mb-2 md-lg-4">
          <div className="text-container dis-fl-row">
            <BrixelAvatar
              avatarImg={loggedInUser.avatarUrl}
              name={get(loggedInUser, 'name', loggedInUser.email)}
              profileId={get(loggedInUser, 'id', '')}
            />
            <BrixelTextEditor
              editorClassName="new-note"
              wrapperClassName="ml-2 dis-fl-col"
              toolbarClassName="hide"
              placeholder={translateTo('Add your notes here', lang)}
              input={{
                name: 'newNote',
                onChange: (val) => setNewNote(val),
                value: newNote,
              }}
              currentInitialValue={currentInitialValue}
              onFocus={() => collapseNote()}
            />
          </div>
          <div
            ref={noteBtnRef}
            className="addBtn dis-f jc-fe mt-1"
          >
            <BrixelButtonPrimary
              small
              rounded
              label={translateTo('Add', lang)}
              disabled={!newNote}
              onClick={() => addNewNote(newNote)}
              isLoading={isSmallLoading.saveNote}
            />
          </div>
        </div>
        {
          chronologicalData && chronologicalData.map((event, i) => (
            <div
              className={`single-event brdSmall brdText100 p-small-12 w-perc-100 dis-fl-row a-t bgWhite mb-2 brdRadius ${has(event, 'parent') ? 'note' : ''} ${has(event, 'parent') && get(event, 'pinned', null) ? 'pinned' : ''}`}
              id={`note-${i}`}
              key={`chrLog_${i.toString()}`}
            >
              {
                !has(event, 'parent') ? (
                  <>
                    <BrixelIcon
                      icon={get(event, 'icon', '')}
                      background={getEventColor(get(event, 'icon', ''))}
                      saturation={100}
                      color={get(event, 'icon', null) === 'mail' ? 'text' : getEventColor(get(event, 'icon', ''))}
                      saturationTxt={700}
                      className="mr-2 historyIcons"
                    />
                    <div className="dis-fl-col">
                      <p
                        className="description fsize-300"
                        onClick={(e) => contentClickHandler(e)}
                        dangerouslySetInnerHTML={{
                          __html: translateTo(get(event, 'description', ''), lang),
                        }}
                      />
                      <div className="dis-fl-row">
                        {
                          has(event, 'user') && (
                            <>
                              <span className="fsize-100 txtText600">{get(event, 'user', '')}</span>&nbsp;
                            </>
                          )
                        }
                        <span className="fsize-100 txtText600">{get(event, 'formattedDate', '')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`w-perc-100 jc-b ${editNote.id === get(event, 'id', null) && editNote.active ? 'dis-fl-col' : 'dis-fl-row'}`}>
                    <div className="dis-fl-col jc-b w-perc-100">
                      {
                        (editNote.id === get(event, 'id', null) && editNote.active) ? (
                          <div className="dis-f">
                            <BrixelAvatar
                              avatarImg={get(event, 'history.author.avatarUrl')}
                              name={get(find(get(event, 'history', ''), (el) => (get(el, 'type', null) === 'create')), 'author.name', '')}
                              profileId={get(find(get(event, 'history', ''), (el) => (get(el, 'type', null) === 'create')), 'author.user_id', '')}
                            />
                            <BrixelTextEditor
                              wrapperClassName="ml-2 dis-fl-col"
                              editorClassName="bgWhite"
                              currentInitialValue={currentInitialValue}
                              input={{
                                name: 'editNoteText',
                                onChange: (val) => setEditNoteText(val),
                                value: editNoteText || '',
                              }}
                            />
                          </div>
                        ) :
                          (
                            <span
                              className="description"
                              dangerouslySetInnerHTML={{
                                __html: (Truncate(get(event, 'content', ''), 62, (showFullNote.id === i && showFullNote.active)).replace(/(?:\r\n|\r|\n)/g, '<br>')),
                              }}
                            />
                          )
                      }
                      {
                        (editNote.id !== get(event, 'id', null)) && (
                          <div className="dis-fl-row mt-1">
                            <span className="fsize-100 txtText900 mr-2">
                              { get(find(get(event, 'history', ''), (el) => (get(el, 'type', null) === 'create')), 'author.name', 'BOT') }
                            </span>
                            <span className="fsize-100 txtText600">
                              {DateTime.fromMillis(get(event, 'createdAt', 0), { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                            </span>
                          </div>
                        )
                      }
                    </div>
                    <div className={`actions dis-fl-col jc-b pos-r ${editNote.id === get(event, 'id', null) && editNote.active ? '' : ''}`}>
                      {
                        get(event, 'content', '') && get(event, 'content', '').length > 62 && !editNote.active && (
                          <BrixelButtonIcon
                            className="as-fe"
                            bgTransparent
                            theme="text"
                            icon={`${showFullNote.id === i && showFullNote.active ? 'arrow-simple-up' : 'arrow-simple-down'}`}
                            onClick={(e) => {
                              if (showFullNote.id !== i && !showFullNote.active) {
                                openTruncatedText(e, i);
                              } else if (showFullNote.id === i && !showFullNote.active) {
                                openTruncatedText(e, i);
                              } else if (showFullNote.id === i && showFullNote.active) {
                                truncateText(e);
                              } else {
                                openTruncatedText(e, i);
                              }
                            }}
                          />
                        )
                      }
                      <div className="dis-fl-row h-perc-100 jc-b a-c">
                        {
                          (editNote.id === get(event, 'id', null) && editNote.active) ? (
                            <div className="dis-fl-row w-perc-100 jc-fe pt-2">
                              <BrixelButtonSecondary
                                rounded
                                small
                                label={translateTo('Cancel', lang)}
                                onClick={() => {
                                  setEditNoteText(null);
                                  setCurrentInitialValue('');
                                  setEditNote({
                                    id: null,
                                    active: false,
                                  });
                                }}
                                className="mr-1"
                              />
                              <BrixelButtonPrimary
                                label={translateTo('Save', lang)}
                                rounded
                                small
                                onClick={(e) => {
                                  updateNote(e, get(event, 'id', ''));
                                  setEditNote({
                                    id: null,
                                    active: false,
                                  });
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="as-fe dis-f a-c pos-r">
                                {
                                  get(event, 'pinned', null) && (
                                    <BrixelButtonIcon
                                      small
                                      bgTransparent
                                      icon="pin-filled"
                                      theme="red"
                                      className="mr-1"
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
                                {
                                  !isDeal && (
                                    <BrixelButtonIcon
                                      small
                                      theme="text"
                                      bgTransparent
                                      icon="options-vertical"
                                      onClick={() => {
                                        setEditNote({
                                          id: null,
                                          active: false,
                                        });
                                        setNoteOptionsOpen({
                                          id: get(event, 'id', null),
                                          active: !noteOptionsOpen.active,
                                        });
                                      }}
                                    />
                                  )
                                }
                                {
                                  (noteOptionsOpen.id === get(event, 'id', null) && noteOptionsOpen.active) && (
                                    <>
                                      <BrixelDropdownMini
                                        topOffset={40}
                                        rightAligned
                                        ref={noteRef}
                                        links={
                                          [
                                            {
                                              label: translateTo(`${get(event, 'pinned', '') ? 'Remove pin' : 'Pin to top'}`, lang),
                                              clickFunc: () => {
                                                handlePinNote(null, event);
                                                setNoteOptionsOpen({
                                                  id: null,
                                                  active: false,
                                                });
                                              },
                                            },
                                            {
                                              label: translateTo('Edit', lang),
                                              clickFunc: () => {
                                                setEditNoteText(get(event, 'content', ''));
                                                setCurrentInitialValue(get(event, 'content', ''));
                                                setEditNote({
                                                  id: get(event, 'id', 0),
                                                  active: !editNote.active,
                                                });
                                                setNoteOptionsOpen({
                                                  id: null,
                                                  active: false,
                                                });
                                              },
                                            },
                                            {
                                              label: translateTo('Delete', lang),
                                              className: 'txtRed400',
                                              clickFunc: () => {
                                                deleteNote(null, event);
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

const mapStateToProps = (state) => ({
  activeDeal: get(state, 'deal.activeSingleDeal', {}),
  activeDealHistoryList: get(state, 'deal.activeSingleDealHistory', {}),
  activeDealNotes: get(state, 'deal.activeSingleDealNotes', []),
  activeDealOwnerHistoryList: get(state, 'deal.activeSingleDealOwnerHistory', {}),
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  activePropertyHistoryList: get(state, 'property.activeSinglePropertyHistory', {}),
  activePropertyNotes: get(state, 'property.activeSinglePropertyNotes', []),
  activePropertyOwnerHistoryList: get(state, 'property.activeSinglePropertyOwnerHistory', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreateNote: bindActionCreators(createNote, dispatch),
  handleSaveNote: bindActionCreators(saveActiveSingleNote, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Timeline);
