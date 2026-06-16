import { getSetting } from "@/app/actions";
import HeaderContent from "./HeaderContent";

export default async function Header() {
  const socials = await getSetting("socials_cms");

  return <HeaderContent socials={socials || {}} />;
}
