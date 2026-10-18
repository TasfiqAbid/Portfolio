export type Project = {
  slug: string;
  title: string;
  year: string;
  client: string;
  image: string;
  rotation: number;
  width: string;
  zIndex: number;
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "next-crumb",
    title: "Next Crumb",
    year: "2024",
    client: "Brand Identity & Packaging",
    image: "/next-crumb.jpg",
    rotation: -6,
    width: "w-[42%]",
    zIndex: 3,
    url: "https://www.behance.net/gallery/256830053/Next-Crumb-Brand-Identity-Packaging",
  },
  {
    slug: "street-photography",
    title: "Unscripted | Street & Documentary Photography",
    year: "",
    client: "Photography",
    image: "/work/unscripted-cover.webp",
    rotation: 3,
    width: "w-[38%]",
    zIndex: 3,
    url: "https://www.behance.net/gallery/145883667/Street-Photography",
  },
  {
    slug: "80-winters",
    title: "80 Winters",
    year: "2025",
    client: "Auclair",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    rotation: 4,
    width: "w-[38%]",
    zIndex: 2,
  },
  {
    slug: "milimani",
    title: "Milimani",
    year: "2025",
    client: "Salomon",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    rotation: -3,
    width: "w-[40%]",
    zIndex: 4,
  },
  {
    slug: "not-quite-gone",
    title: "Not Quite Gone",
    year: "2026",
    client: "Le Braquet Cycling Club",
    image: "https://images.unsplash.com/photo-1485965120180-ef29e04bb598?w=800&q=80",
    rotation: 5,
    width: "w-[36%]",
    zIndex: 1,
  },
  {
    slug: "western-states",
    title: "Western States",
    year: "2025",
    client: "Salomon",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb08f457a?w=800&q=80",
    rotation: -4,
    width: "w-[44%]",
    zIndex: 5,
  },
  {
    slug: "life-edition",
    title: "Life Edition (LE)",
    year: "2025",
    client: "Ciele",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8ecc8?w=800&q=80",
    rotation: 3,
    width: "w-[38%]",
    zIndex: 2,
  },
  {
    slug: "summer-nights",
    title: "Summer Nights",
    year: "2025",
    client: "Ciele",
    image: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&q=80",
    rotation: -5,
    width: "w-[40%]",
    zIndex: 3,
  },
  {
    slug: "jay-du-temple",
    title: "Jay Du Temple",
    year: "2026",
    client: "Jay Du Temple",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    rotation: 6,
    width: "w-[42%]",
    zIndex: 4,
  },
];

export type Award = {
  id: string;
  title: string;
  year: string;
  category: string;
  images: [string | null, string | null];
};

export const awards: Award[] = [
  {
    id: "award-1",
    title: "2nd Prize - Financial Literacy Short Video Competition",
    year: "2026",
    category: "Bangladesh Securities and Exchange Commission (BSEC)",
    images: ["/certificates/bsec.webp", "/certificates/bsec-award-photo-2.webp"],
  },
  {
    id: "award-6",
    title: "Top 50 - Frames of Freedom Photography Competition",
    year: "2025",
    category: "BRAC University Marketing Association",
    images: ["/certificates/maces.webp", "/certificates/maces-award-photo.webp"],
  },
  {
    id: "award-2",
    title: "Bronze Standard - Duke of Edinburgh's International Award",
    year: "2024",
    category: "BRAC University",
    images: ["/certificates/duke-of-edinburgh.webp", null],
  },
  {
    id: "award-3",
    title: "2nd Runner-Up - Aperture F/2 Film and Photography",
    year: "2020",
    category: "Sponsored by Samsung Fair Electronics",
    images: ["/certificates/ndc.webp", "/certificates/aperture-crest.webp"],
  },
  {
    id: "award-4",
    title: "Winner - Bangladesh Through Your Lens Photo Exhibition",
    year: "2019",
    category: "Plan For You Events",
    images: ["/certificates/plan-for-you.webp", "/certificates/plan-for-you-enhanced.webp"],
  },
  {
    id: "award-5",
    title: "Winner - BIOSCOPE 3 Photography Festival",
    year: "2019",
    category: "Shishuder Jonno Foundation",
    images: ["/certificates/bioscope-trimmed.webp", "/certificates/bioscope-award-photo.webp"],
  },
];

export const services = [
  "Creative Direction",
  "Visual Storytelling (Photography & Film)",
  "UI/UX & Web Design",
  "Custom Software Solutions",
  "Mobile Application",
  "Frontend Development",
  "Graphic & Brand Design",
  "Post-Production & Video Editing",
];

export const clients = [
  "Salomon",
  "ON Running",
  "Puma",
  "Nike",
  "The North Face",
  "Saucony",
  "Garmin",
  "Ciele",
  "Shokz",
  "Auclair",
  "Altitude Sports",
  "Le Braquet",
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Works", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];
