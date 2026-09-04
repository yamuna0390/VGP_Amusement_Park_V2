import HomeClient from "@/components/home/HomeClient";

export const metadata = {
  title: "VGP Universal Kingdom — Best Water Park & Amusement Park in Chennai",
  description: "Experience 22 thrilling rides, water park & pet zoo at VGP Universal Kingdom, Chennai's best family amusement park. Book tickets online today!",
  keywords: "water park Chennai, amusement park Chennai, family outing Chennai, VGP Universal Kingdom",
  openGraph: {
    title: "VGP Universal Kingdom — Best Water Park & Amusement Park in Chennai",
    description: "22 rides, 11 water attractions, pet zoo — one Fun Pass covers it all!",
    url: "https://vgpuniversalkingdom.in",
  },
};

export default function Home() {
  return <HomeClient />;
}

