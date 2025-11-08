// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Seed Patients ---
  const patients = [
    { code: "PAT0001", first: "John", last: "Doe", gender: "Male", city: "Bangalore" },
    { code: "PAT0002", first: "Alice", last: "Smith", gender: "Female", city: "Mumbai" },
    { code: "PAT0003", first: "Ravi", last: "Kumar", gender: "Male", city: "Pune" },
    { code: "PAT0004", first: "Priya", last: "Nair", gender: "Female", city: "Delhi" },
    { code: "PAT0005", first: "Amit", last: "Sharma", gender: "Male", city: "Hyderabad" },
    { code: "PAT0006", first: "Sneha", last: "Patil", gender: "Female", city: "Chennai" },
    { code: "PAT0007", first: "Rohan", last: "Shetty", gender: "Male", city: "Bangalore" },
    { code: "PAT0008", first: "Neha", last: "Singh", gender: "Female", city: "Kolkata" },
    { code: "PAT0009", first: "Kiran", last: "Raj", gender: "Male", city: "Mumbai" },
    { code: "PAT0010", first: "Divya", last: "Kapoor", gender: "Female", city: "Delhi" },
    { code: "PAT0011", first: "Arjun", last: "Gupta", gender: "Male", city: "Pune" },
    { code: "PAT0012", first: "Meera", last: "Joshi", gender: "Female", city: "Bangalore" },
    { code: "PAT0013", first: "Vikas", last: "Yadav", gender: "Male", city: "Hyderabad" },
    { code: "PAT0014", first: "Pooja", last: "Rao", gender: "Female", city: "Mumbai" },
    { code: "PAT0015", first: "Suresh", last: "Naik", gender: "Male", city: "Delhi" },
    { code: "PAT0016", first: "Asha", last: "Menon", gender: "Female", city: "Chennai" },
    { code: "PAT0017", first: "Manoj", last: "Bhat", gender: "Male", city: "Kolkata" },
    { code: "PAT0018", first: "Kavya", last: "Murthy", gender: "Female", city: "Bangalore" },
    { code: "PAT0019", first: "Yogesh", last: "Pai", gender: "Male", city: "Hyderabad" },
    { code: "PAT0020", first: "Anita", last: "Kulkarni", gender: "Female", city: "Pune" },
    { code: "PAT0021", first: "Shiva", last: "Verma", gender: "Male", city: "Chennai" },
    { code: "PAT0022", first: "Latha", last: "Dev", gender: "Female", city: "Mumbai" },
    { code: "PAT0023", first: "Rakesh", last: "Jain", gender: "Male", city: "Delhi" },
    { code: "PAT0024", first: "Geeta", last: "Gill", gender: "Female", city: "Bangalore" },
    { code: "PAT0025", first: "Nitin", last: "Desai", gender: "Male", city: "Pune" },
  ];

  console.log("⏳ Seeding patients...");
  for (const p of patients) {
    const hashedPassword = await bcrypt.hash("Test@123", 10);
    await prisma.patients.create({
      data: {
        patient_code: p.code,
        first_name: p.first,
        last_name: p.last,
        gender: p.gender,
        dob: new Date("1990-01-01"),
        phone: "98765" + Math.floor(10000 + Math.random() * 90000),
        email: `${p.first.toLowerCase()}.${p.last.toLowerCase()}@example.com`,
        password: hashedPassword,
        address: "Sample Address",
        city: p.city,
        state: "Karnataka",
        pincode: "560001",
        notes: "",
      },
    });
  }
  console.log("✅ Patients seeded!");

  // --- Seed Modules ---
  const modules = [
    { name: 'Manage Patient', description: 'Description for Manage Patient' },
    { name: 'Manage Activies', description: 'Description for Manage Activies' },
    { name: 'Manage Admin User', description: 'Description for Manage Admin User' },
    { name: 'Manage Blog', description: 'Description for Manage Blog' },
    { name: 'Manage Email', description: 'Description for Manage Email' },
    { name: 'Manage Category', description: 'Description for Manage Category' },
    { name: 'Manage Specialty', description: 'Description for Manage Specialty' },
    { name: 'Manage Specialty', description: 'Description for Manage Specialty' },
    { name: 'Manage Notification', description: 'Description for Manage Notification' },
    { name: 'Manage Seo', description: 'Description for Manage Seo' },
  ];

  console.log("⏳ Seeding modules...");
  for (const moduleData of modules) {
    await prisma.module.create({
      data: moduleData,
    });
  }
  console.log("✅ Modules seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
