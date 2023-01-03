export interface calcPercentageProEstimationType {
  inputs: {
    name: string
    condition: {
      name: string
      value?: string;
      noValue?: string;
    };
    isProEstimation?: boolean
    proEstimationConditions: {
      name: string
      value?: string;
      noValue?: string;
    }[];
  }[];
}
