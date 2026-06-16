import { getSetting } from "@/app/actions";
import SettingsClient from "./SettingsClient";

export const revalidate = 0; // Ensure settings are loaded fresh

export default async function AdminSettingsPage() {
  const aboutCMS = await getSetting("about_cms");
  const socialsCMS = await getSetting("socials_cms");
  const contactsCMS = await getSetting("contacts_cms");

  return (
    <SettingsClient
      aboutCMS={aboutCMS}
      socialsCMS={socialsCMS}
      contactsCMS={contactsCMS}
    />
  );
}
