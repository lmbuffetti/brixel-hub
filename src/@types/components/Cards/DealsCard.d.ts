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
  avatarUrl?: string;
  stage?: string;
  visit?: number;
}
