import React from 'react';

export interface BrixelModalFullScreenType {
  children: React.ReactElement;
  lang: string;
  onClose: () => void;
  title: string;
}
