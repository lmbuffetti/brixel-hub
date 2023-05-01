import translateTo from '../../utils/translation';
import {BrixelTextArea} from '@brixel/brixel-components/dist/form';
import ScheduleVisitComponent from '../../Pages/Dashboard/Buyer/ScheduleVisit/ScheduleVisiitComponent';
import scheduleSvg from '../../images/dashboard/scehdule.svg';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import ClipboardImg from '../../images/scanTrial/clipboard.png';
import {configureStore} from '../../store';
import get from 'lodash/get';

export const QuestionsList: (lang: string) => QuestionsListType[] = (lang) => {
  const formValue = get(configureStore.getState(), 'brixelForm.ScheduleVisit.values', []);
  const dataQuest: QuestionsListType[] = [
    {
      titleIcon: scheduleSvg,
      title: translateTo('Request a visit to your future home', lang),
      history: 'visitDates',
      classNameWrapper: 'max-w-fix-600 ml-a mr-a p-2 p-sm-5',
      component: ScheduleVisitComponent,
      cardType: 'loadComponent',
      hideFooter: true,
    },
  ];
  if (formValue?.scheduleVisit && formValue?.scheduleVisit.length > 0) {
    dataQuest.push({
      title: translateTo('How can we reach you?', lang),
      history: 'contactInfo',
      className: 'bgWhite max-w-fix-600 ml-a mr-a p-2 p-sm-5',
      inputs: [
        {
          component: BrixelTextArea,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: translateTo('Message', lang),
          name: 'message',
          pdClass: 'py-3 py-md-5',
        },
      ],
    },
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: translateTo('Thank you for your request', lang),
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: translateTo('', lang),
      history: 'success',
      vCentered: true,
      toSave: true,
    });
  }
  return dataQuest;
}
