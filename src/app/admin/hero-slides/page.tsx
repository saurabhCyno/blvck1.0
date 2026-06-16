import { adminGetHeroSlides } from "@/app/actions";
import HeroSlidesClient from "./HeroSlidesClient";

export const revalidate = 0;

export default async function AdminHeroSlidesPage() {
  const slides = await adminGetHeroSlides();

  return <HeroSlidesClient initialSlides={slides} />;
}
