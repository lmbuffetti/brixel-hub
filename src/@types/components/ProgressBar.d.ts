import {InputType, OptionsType} from '@brixel/brixel-components/dist/@types/Form/Input';

export interface ProgressBarType {
  className?: string;
  id?: string;
  input?: InputType;
  isArrayValue?: boolean;
  lang: string;
  options: OptionsType[];
  progressState?: string;
  progressStateArray?: string[];
  readOnly: boolean;
  updateProgressBarFunc?: (val: string[]) => void;
}
