import { getHeroSlides } from "@/app/actions";
import HeroSliderClient from "./HeroSliderClient";

export default async function HeroSlider() {
  const slides = await getHeroSlides();

  return <HeroSliderClient slides={slides} />;
}
