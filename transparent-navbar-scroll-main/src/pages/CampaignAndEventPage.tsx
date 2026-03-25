import HeroCarousel from "@/components/HeroCarousel";
import CampaignAndEventCard from "@/components/CampaignAndEventCard";

export const campaignsAndEventsData = [
  {
    id: 1,
    title: "GEAF Global Summit for Change",
    description: "A global gathering of environmental leaders and activists to discuss sustainable change and policy impact.",
    location: "Maison Internationale de l'Environnement II - Geneva - Room I",
    start_date: "2025-11-27",
    target_volunteers: 150,
    target_amount: 10000,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Fashion Reborn Workshop: Giving Clothes a Second Life",
    description: "Learn how to upcycle your old wardrobe and contribute to a circular economy in this hands-on workshop.",
    location: "Histoire sans chute, Genève",
    start_date: "2025-10-22",
    target_volunteers: 30,
    target_amount: 500,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Eco-Futures Expo: Building a Sustainable World Through Art",
    description: "An international exhibition showcasing how art and creativity can drive ecological awareness.",
    location: "Worldwide (Online & Hybrid)",
    start_date: "2025-08-29",
    target_volunteers: 500,
    target_amount: 25000,
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=600",
    status: "ongoing"
  },
  {
    id: 4,
    title: "Protecting Our Shores: Beach Cleanup & Marine Awareness",
    description: "Join us at the shore for a morning of action. Help us keep our waters clean and protect marine life.",
    location: "La Baby Plage De Genève",
    start_date: "2025-07-30",
    target_volunteers: 80,
    target_amount: 1200,
    image: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=600",
    status: "completed"
  },
  {
    id: 5,
    title: "4.29 Green Earth Action Day",
    description: "A worldwide day of localized environmental actions. Plant a tree, clean a park, or start a compost.",
    location: "Worldwide",
    start_date: "2025-04-29",
    target_volunteers: 2000,
    target_amount: 50000,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600",
    status: "completed"
  }
];

const CampaignAndEventPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />
      
      <main className="container mx-auto px-4 py-10 pt-24 lg:px-8">
        <div className="mb-12 border-b border-border pb-6">
            <h1 className="text-4xl font-extrabold font-heading text-foreground tracking-tight">
                Our Events & Campaigns
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
                Join our global movement. Find and participate in upcoming summits, workshops, cleanups, and actions near you.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignsAndEventsData.map((item) => (
            <CampaignAndEventCard
              key={item.id} 
              campaign={item} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CampaignAndEventPage;