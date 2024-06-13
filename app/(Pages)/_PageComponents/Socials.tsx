import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const Socials = () => {
  const socialClassname =
    "hover:text-app-main dark:text-muted-foreground transition-colors duration-300 ease-linear";
  const iconClassname = "size-6";
  return (
    <div className="flex items-center gap-x-6 sm:gap-x-8">
      <Link
        href={"https://www.facebook.com/QwikSavings"}
        target="_blank"
        className={socialClassname}
      >
        <FaFacebook className={iconClassname} />
      </Link>
      <Link
        href={"https://www.instagram.com/qwiksavings"}
        target="_blank"
        className={socialClassname}
      >
        <FaInstagram className={iconClassname} />
      </Link>
      <Link
        href={"https://twitter.com/QwikSavings"}
        target="_blank"
        className={socialClassname}
      >
        <FaXTwitter className={iconClassname} />
      </Link>
      <Link
        href={"https://www.pinterest.com/qwiksavings/"}
        target="_blank"
        className={socialClassname}
      >
        <FaPinterest className={iconClassname} />
      </Link>
      <Link
        href={"https://www.linkedin.com/company/qwik-savings/"}
        target="_blank"
        className={socialClassname}
      >
        <FaLinkedin className={iconClassname} />
      </Link>
      <Link
        href={"https://www.youtube.com/QwikSavings"}
        target="_blank"
        className={socialClassname}
      >
        <FaYoutube className={iconClassname} />
      </Link>
    </div>
  );
};

export default Socials;
