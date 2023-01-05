export interface DealsCardProps {
  archOnClick?: () => void;
  archived?: boolean;
  className?: string;
  date?: string;
  feedback?: {
    isInterested: boolean;
  };
  isNew?: boolean;
  isWinner?: boolean;
  lang?: string;
  name?: string;
  offer?: {
    offer: {
      status: string;
    }
  };
  parentOnClick?: () => void;
  profileId?: string;
  stage?: string;
  visit?: number;
}

export interface HistoryType {
  actionStub?: string;
  meta?: {
    message: string;
    portal: string;
  }
}
