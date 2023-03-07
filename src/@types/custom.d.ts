declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    deleteOffer(): Chainable<any>;
    getBuyerDeal(): Chainable<any>;
    loginViaApi(): Chainable<any>;
    propertyListings(): Chainable<any>;
    reduxValue(state: string, field: string): Chainable<any>;
  }
}
