import "dotenv/config";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = postgres(connectionString);

  const settings = [
    {
      key: "about_name",
      value: JSON.stringify("Shivakumar S"),
    },
    {
      key: "about_bio",
      value: JSON.stringify([
        "Digital artist and movie publicity designer based in Hyderabad, India. With over a decade of experience in the advertising, television, and film industry, I create visual narratives that command attention.",
        "From gritty movie posters for Telugu cinema to social awareness campaigns, every piece is crafted with cinematic intensity and digital precision. My work has garnered over 387,000 views and 14,000+ appreciations across platforms.",
        "Available for commissions — movie posters, album art, social media campaigns, and custom digital illustrations.",
      ]),
    },
    {
      key: "about_image",
      value: JSON.stringify("hero-portrait.jpg"),
    },
    {
      key: "about_tools",
      value: JSON.stringify(["Adobe Photoshop", "Illustrator", "After Effects"]),
    },
    {
      key: "about_experience",
      value: JSON.stringify([
        {
          icon: "Clapperboard",
          title: "Puthiya Thalaimurai TV",
          role: "Digital Artist & VFX Artist",
          period: "Present",
        },
        {
          icon: "Monitor",
          title: "Ocher Studios",
          role: "Digital Matte Artist",
          period: "Previous",
        },
        {
          icon: "Palette",
          title: "Freelance",
          role: "Movie Publicity Designer",
          period: "Ongoing",
        },
      ]),
    },
    {
      key: "social_instagram",
      value: JSON.stringify("https://www.instagram.com/shiva_vexarts"),
    },
    {
      key: "social_behance",
      value: JSON.stringify("https://www.behance.net/Sivadigitalart"),
    },
    {
      key: "social_location",
      value: JSON.stringify("Hyderabad, Telangana, India"),
    },
    {
      key: "social_email",
      value: JSON.stringify("Available on request via contact form"),
    },
  ];

  console.log("Seeding site_settings...");

  try {
    for (const setting of settings) {
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES (${setting.key}, ${setting.value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding settings:", error);
  } finally {
    await sql.end();
  }
}

main();
