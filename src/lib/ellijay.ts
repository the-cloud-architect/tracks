export type EllijayActivity = {
  name: string;
  category: string;
  description: string;
  imagePath: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const ellijayActivities: EllijayActivity[] = [
  {
    name: "Explore Downtown Ellijay Square",
    category: "Town & Shopping",
    description:
      "Browse local boutiques, antique shops, and local dining around the historic square for a relaxed afternoon between wedding events.",
    imagePath: "/images/things-to-do/downtown.jpg",
    sourceLabel: "City of Ellijay",
    sourceUrl: "https://www.ellijay-ga.gov/",
  },
  {
    name: "Tour Apple Orchard Alley (GA-52)",
    category: "Scenic Drive",
    description:
      "Drive the orchard corridor and stop for seasonal farm stands, apple houses, and mountain views that define Ellijay’s fall charm.",
    imagePath: "/images/things-to-do/scenic-drive.jpg",
    sourceLabel: "Explore Georgia",
    sourceUrl: "https://exploregeorgia.org/ellijay/outdoors-nature/scenic-byways-trails/apple-orchard-alley",
  },
  {
    name: "Visit an Ellijay Apple Orchard",
    category: "Family Experience",
    description:
      "Plan an orchard stop for apple picking, cider donuts, and farm market treats—perfect for welcome-day outings with guests.",
    imagePath: "/images/things-to-do/orchard.jpg",
    sourceLabel: "Pick Ellijay",
    sourceUrl: "https://pickellijay.com/",
  },
  {
    name: "Wine Tasting in North Georgia Wine Country",
    category: "Wineries & Vineyards",
    description:
      "Host a laid-back pre-wedding tasting with mountain views at one of Ellijay’s nearby vineyards.",
    imagePath: "/images/things-to-do/vineyard.jpg",
    sourceLabel: "Downtown Ellijay",
    sourceUrl: "https://downtownellijay.com/",
  },
  {
    name: "Ride, Tube, or Relax Along the Cartecay River",
    category: "Outdoors",
    description:
      "Recommend river adventures for adventurous guests or a scenic riverside picnic for a slower mountain day.",
    imagePath: "/images/things-to-do/river.jpg",
    sourceLabel: "Ellijay Apple Festival Guide",
    sourceUrl: "https://ellijayapplefestival.org/",
  },
  {
    name: "Hike Nearby Mountain Trails",
    category: "Hiking",
    description:
      "Send guests toward local trailheads and nearby state-park routes for sunrise hikes and panoramic North Georgia views.",
    imagePath: "/images/things-to-do/hiking.jpg",
    sourceLabel: "City of Ellijay",
    sourceUrl: "https://www.ellijay-ga.gov/",
  },
];
