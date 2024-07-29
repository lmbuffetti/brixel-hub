declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.pdf' {
  const value: any;
  export default value;
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
    compareSnapshot(name: string, cover: number): Chainable<any>;
    deleteOffer(dealID: string): Chainable<any>;
    getBuyerDeal(pageID: string): Chainable<any>;
    loginViaApi(type?: 'seller' | 'buyer' | 'estimation'): Chainable<any>;
    propertyListings(comapny: null | string): Chainable<any>;
    reduxValue(state: string, field: string): Chainable<any>;
    register(data: Cookie | null, company: string): Chainable<any>;
  }
}
