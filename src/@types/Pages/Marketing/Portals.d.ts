interface SinglePortal {
  name: string,
  displayName: string,
  exportPossible: boolean,
  canHavePropertyUrl: boolean,
  portal: SinglePortal
  url: string
}
export interface PortalsType {
  portal: SinglePortal,
  exportEnabled: boolean,
  url: string,
  children: SinglePortal[]
}

export interface StatusType {
  text: string,
  color: string,
  state: string,
}
