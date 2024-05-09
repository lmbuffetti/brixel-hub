export interface DealsCardProps {
  archOnClick?: () => void;
  archived?: boolean;
  avatarImg?: string;
  className?: string;
  date?: string;
  id?: string;
  isNew?: boolean;
  isWinner?: boolean;
  name?: string;
  offer?: string | {offer: {amount: number}};
  parentOnClick?: () => void;
  profileId?: string;
  stage?: string;
  lang: string;
}
