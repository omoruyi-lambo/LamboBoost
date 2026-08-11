import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faYoutube,
  faTelegram,
  faTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const platformIcons = {
  instagram: faInstagram,
  tiktok: faTiktok,
  youtube: faYoutube,
  facebook: faFacebookF,
  telegram: faTelegram,
  x: faXTwitter,
  twitter: faTwitter,
  other: faGlobe,
} as const;

type BrandIconName = keyof typeof platformIcons;

export function BrandIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const key = name.toLowerCase() as BrandIconName;
  const icon = platformIcons[key] ?? faGlobe;

  return <FontAwesomeIcon icon={icon} className={className} aria-hidden="true" />;
}
