export interface DealsCardProps {
  archOnClick?: () => void;
  archived?: boolean;
  avatarImg?: string;
  className?: string;
  date?: string;
  id?: string;
  isNew?: boolean;
  isWinner?: boolean;
  feedback?: object;
  name?: string;
  offer?: string;
  parentOnClick?: () => void;
  profileId?: string;
  stage?: string;
  lang: string;
}
