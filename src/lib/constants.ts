export const COLLECTIONS = [
  { id: "movie_posters", label: "Movie Posters" },
  { id: "digital_illustrations", label: "Digital Illustrations" },
  { id: "social_awareness", label: "Social Awareness" },
  { id: "portraits", label: "Celebrity Portraits" },
  { id: "fan_art", label: "Superheroes & Fan Art" },
  { id: "devotional", label: "Devotional Art" },
  { id: "client_works", label: "Client Commissions" },
] as const;

export const CATEGORIES = [
  "Action",
  "Artistic",
  "Bollywood",
  "Conceptual",
  "Cricketer",
  "DC Comics",
  "Devotional",
  "Hollywood",
  "Illustration",
  "Marvel",
  "Musician",
  "Personalized Art",
  "Scenery",
  "Tollywood",
  "Portrait",
  "Conceptual",
] as const;

export const COLLECTION_METADATA: Record<string, { title: string; description: string }> = {
  movie_posters: {
    title: "MOVIE POSTERS",
    description: "Cinematic posters that tell a story. High-impact designs inspired by the biggest blockbusters, perfect for any movie lover's collection.",
  },
  digital_illustrations: {
    title: "CONCEPTUAL ILLUSTRATIONS",
    description: "Original conceptual pieces and digital illustrations exploring themes of scenery, emotion, and surrealism.",
  },
  social_awareness: {
    title: "SOCIAL AWARENESS",
    description: "Powerful visual messages advocating for social change, equality, and human rights through artistic expression.",
  },
  portraits: {
    title: "CELEBRITY PORTRAITS",
    description: "Precision vector portraits of iconic figures from cinema, sports, and music. Every detail is meticulously crafted to capture the essence of the legend.",
  },
  fan_art: {
    title: "SUPERHEROES & FAN ART",
    description: "A tribute to the characters we love. From the gritty streets of Gotham to the vibrant Marvel universe, explore our unique take on legendary heroes.",
  },
  Superheros: {
    title: "SUPERHEROES & FAN ART",
    description: "A tribute to the characters we love. From the gritty streets of Gotham to the vibrant Marvel universe, explore our unique take on legendary heroes.",
  },
  devotional: {
    title: "DEVOTIONAL ART",
    description: "Divine and spiritual digital paintings that bring peace and energy to your space. A modern approach to traditional deities.",
  },
  "Client Works": {
    title: "CLIENT COMMISSIONS",
    description: "Custom artworks and professional projects created for clients across various industries.",
  },
  client_works: {
    title: "CLIENT COMMISSIONS",
    description: "Custom artworks and professional projects created for clients across various industries.",
  },
};
