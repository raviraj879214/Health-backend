// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  const modules = [
    { name: 'Manage Patient', description: 'Description for Manage Patient' },
    { name: 'Manage Activies', description: 'Description for Manage Activies' },
    { name: 'Manage Admin User', description: 'Description for Manage Admin User' },
    { name: 'Manage Blog', description: 'Description for Manage Blog' },
    { name: 'Manage Email', description: 'Description for Manage Email' },
    { name: 'Manage Category', description: 'Description for Manage Category' },
    { name: 'Manage Specialty', description: 'Description for Manage Specialty' },
    { name: 'Manage Notification', description: 'Description for Manage Notification' },
    { name: 'Manage Seo', description: 'Description for Manage Seo' },
    { name: 'Manage Clinic', description: 'Description for Manage Clinic' },
    { name: 'Manage Doctor Details', description: 'Description for Manage Doctor Details' },
    { name: 'Manage Payout', description: 'Description for Manage Doctor Details' },
  ];

  console.log("⏳ Seeding modules...");
  // for (const moduleData of modules) {
  //   await prisma.module.create({
  //     data: moduleData,
  //   });
  // }
  console.log("✅ Modules seeded!");





   const roleId = 1;
    console.log("⏳ Seeding RoleModule entries...");

  // for (let moduleId = 1; moduleId <= 9; moduleId++) {
  //   await prisma.roleModule.upsert({
  //     where: {
  //       roleId_moduleId: {
  //         roleId,
  //         moduleId,
  //       },
  //     },
  //     update: {}, // nothing to update
  //     create: {
  //       roleId,
  //       moduleId,
  //       canCreate: true,
  //       canDelete: true,
  //       canRead: true,
  //       canUpdate: true,
  //       status: false,
  //     },
  //   });
  // }

  console.log("✅ RoleModule seeding completed!");



  const accreditations = [
  {
    image: 'https://example.com/accreditations/nabh.png',
    name: 'NABH Accreditation',
    description:
      'National Accreditation Board for Hospitals & Healthcare Providers ensures quality and patient safety.',
  },
  {
    image: 'https://example.com/accreditations/jci.png',
    name: 'JCI Accreditation',
    description:
      'Joint Commission International accreditation ensuring global hospital standards.',
  },
  {
    image: 'https://example.com/accreditations/iso9001.png',
    name: 'ISO 9001 Certification',
    description:
      'International standard for quality management systems in healthcare.',
  },
  {
    image: 'https://example.com/accreditations/iso27001.png',
    name: 'ISO 27001 Certification',
    description:
      'Certification for information security and patient data protection.',
  },
  {
    image: 'https://example.com/accreditations/cap.png',
    name: 'CAP Accreditation',
    description:
      'College of American Pathologists accreditation for high-quality labs.',
  },
  {
    image: 'https://example.com/accreditations/naac.png',
    name: 'NAAC Accreditation',
    description:
      'Accreditation for institutions offering medical & healthcare education.',
  },
  {
    image: 'https://example.com/accreditations/cara.png',
    name: 'CARA Accreditation',
    description:
      'Central Adoption Resource Authority certification for child & maternal care facilities.',
  },
  {
    image: 'https://example.com/accreditations/who-gmp.png',
    name: 'WHO GMP Certification',
    description:
      'World Health Organization GMP certification for safe medical manufacturing.',
  },
  {
    image: 'https://example.com/accreditations/ayush.png',
    name: 'AYUSH Certification',
    description:
      'Certification by Ministry of AYUSH for traditional medicine practices.',
  },
  {
    image: 'https://example.com/accreditations/esi.png',
    name: 'ESI Registered',
    description:
      'Employee State Insurance registration for social and medical security.',
  },
];

console.log("⏳ Seeding accreditations...");

// for (const acc of accreditations) {
//   await prisma.accreditation.create({
//     data: {
//       ...acc,
//       uuid: crypto.randomUUID(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   });
// }

console.log("✅ Accreditation seeded successfully!");










const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Gastroenterology",
    "Pulmonology", "Nephrology", "Endocrinology", "Hematology", "Psychiatry",
    "Rheumatology", "Urology", "Ophthalmology", "ENT", "General Surgery",
    "Pediatrics", "Oncology", "Radiology", "Anesthesiology", "Critical Care",
    "Internal Medicine", "Family Medicine", "Sports Medicine", "Pain Medicine",
    "Allergy & Immunology", "Infectious Disease", "Geriatrics", "Pathology",
    "Plastic Surgery", "Vascular Surgery", "Neurosurgery", "Thoracic Surgery",
    "Colorectal Surgery", "Bariatric Surgery", "Emergency Medicine",
    "Medical Genetics", "Sleep Medicine", "Occupational Medicine",
    "Nuclear Medicine", "Reproductive Endocrinology", "Fetal Medicine",
    "Neonatology", "Palliative Care", "Transplant Medicine",
    "Clinical Pharmacology", "Forensic Medicine", "Rehabilitation Medicine",
    "Andrology", "Hepatology", "Immunohematology", "Interventional Radiology",
    "Pediatric Surgery", "Pediatric Cardiology", "Pediatric Neurology",
    "Pediatric Oncology", "Pediatric Orthopedics", "Pediatric ENT",
    "Pediatric Nephrology", "Pediatric Gastroenterology",
    "Pediatric Endocrinology", "Pediatric Pulmonology", "Pediatric Urology",
    "Maternal Medicine", "High-risk Obstetrics", "Obstetrics", "Gynecology",
    "Fertility Specialist", "Embryology", "Laparoscopic Surgery",
    "Hand Surgery", "Foot & Ankle Surgery", "Spine Surgery",
    "Joint Replacement", "Interventional Cardiology", "Electrophysiology",
    "Cardiac Surgery", "Cardiac Anesthesia", "Neuro Anesthesia",
    "Pain Specialist", "Diabetology", "Clinical Nutrition",
    "Public Health", "Tropical Medicine", "Community Medicine",
    "Health Informatics", "Biomedical Engineering", "Medical Microbiology",
    "Virology", "Parasitology", "Dermatopathology", "Cytopathology",
    "Endodontics", "Periodontics", "Prosthodontics", "Oral Surgery",
    "Oral Medicine", "Dentistry", "Radiation Oncology"
  ];

  console.log("⏳ Seeding Specializations...");
  // for (const name of specializations) {
  //   await prisma.specialization.upsert({
  //     where: { name },
  //     update: {},
  //     create: { name, description: `${name} specialization` },
  //   });
  // }
  console.log("✅ Specializations seeded!");


  /**
   * ------------------------------------------------------
   * SPECIALTIES (100)
   * ------------------------------------------------------
   */
  const specialties = [
    "Heart Failure Specialist", "Stroke Specialist", "Joint Pain Specialist",
    "Skin Allergy Specialist", "Liver Specialist", "Lung Specialist",
    "Kidney Specialist", "Diabetes Specialist", "Blood Disorder Specialist",
    "Mental Health Specialist", "Arthritis Specialist", "Male Health Specialist",
    "Eye Specialist", "Hearing & Voice Specialist", "General Physician",
    "Child Specialist", "Cancer Specialist", "Imaging Specialist",
    "Critical Care Specialist", "Pain Management Specialist",
    "Women's Health Specialist", "Sports Injury Specialist",
    "Respiratory Specialist", "Thyroid Specialist", "Hormone Specialist",
    "Brain & Spine Specialist", "Sleep Disorder Specialist",
    "Obesity Specialist", "Emergency Care Specialist", "Trauma Specialist",
    "Spine Correction Specialist", "Hip Replacement Specialist",
    "Knee Replacement Specialist", "Fertility Specialist",
    "Pregnancy Care Specialist", "IVF Specialist", "ENT Surgeon",
    "Glaucoma Specialist", "Retina Specialist", "Cornea Specialist",
    "Cardiac Electrophysiologist", "Interventional Pulmonologist",
    "Endoscopic Surgeon", "Robotic Surgeon", "Headache Specialist",
    "Migraine Specialist", "Epilepsy Specialist", "Parkinson’s Specialist",
    "Movement Disorder Specialist", "Multiple Sclerosis Specialist",
    "Scoliosis Specialist", "Shoulder Specialist", "Hand Specialist",
    "Foot Specialist", "Ankle Specialist", "Wound Care Specialist",
    "Bariatric Specialist", "Colorectal Specialist", "Anal Fissure Specialist",
    "Neonatal Specialist", "Newborn Specialist", "Development Specialist",
    "Autism Specialist", "Speech Disorder Specialist",
    "Hearing Disorder Specialist", "Breast Specialist",
    "Cosmetic Surgeon", "Reconstructive Surgeon", "Hair Transplant Specialist",
    "Skin Laser Specialist", "Sexual Health Specialist", "HIV Specialist",
    "Infection Specialist", "Allergy Specialist", "Immunology Specialist",
    "Vaccination Specialist", "Physiotherapy Specialist", "Rehab Specialist",
    "Spine Rehab Specialist", "Heart Rhythm Specialist", "Vein Specialist",
    "Artery Specialist", "Transplant Specialist", "Bone Marrow Specialist",
    "Gastro Surgeon", "Pediatric Heart Specialist", "Pediatric Brain Specialist",
    "Pediatric Lung Specialist", "Pediatric Skin Specialist",
    "Pediatric Dental Specialist", "Oral Implant Specialist",
    "Root Canal Specialist", "Braces Specialist", "Dental Surgeon",
    "Prosthetic Dentist", "Cancer Radiologist", "Radiation Specialist"
  ];

  console.log("⏳ Seeding Specialties...");
  // for (const name of specialties) {
  //   await prisma.specialty.upsert({
  //     where: { name },
  //     update: {},
  //     create: { name, description: `${name} specialty` },
  //   });
  // }
  console.log("✅ Specialties seeded!");


  /**
   * ------------------------------------------------------
   * TREATMENTS (100)
   * ------------------------------------------------------
   */
  const treatments = [
    "Appendectomy", "Angioplasty", "Arthroscopy", "Bypass Surgery",
    "Cataract Surgery", "Chemotherapy", "Dialysis", "Endoscopy",
    "Gallbladder Removal", "Heart Transplant", "Hip Replacement",
    "Knee Replacement", "Liver Transplant", "Spine Surgery",
    "Tonsillectomy", "Appendix Removal", "Kidney Stone Removal",
    "Cesarean Delivery", "Normal Delivery", "LASIK Surgery",
    "Root Canal Treatment", "Dental Implant", "Braces Treatment",
    "Cosmetic Surgery", "Hair Transplant", "Skin Laser Treatment",
    "Pacemaker Implant", "Angiography", "Bronchoscopy", "Colonoscopy",
    "IVF Treatment", "IUI Treatment", "Fistula Repair",
    "Hernia Repair", "Fracture Fixation", "ACL Reconstruction",
    "Piles Laser Treatment", "Varicose Vein Treatment", "Shoulder Arthroscopy",
    "Cyst Removal", "Tumor Removal", "Brain Surgery", "Spine Fusion",
    "Hip Arthroscopy", "PRP Therapy", "Physiotherapy", "Speech Therapy",
    "Cleft Lip Surgery", "Gastric Bypass", "Gastric Sleeve",
    "Weight Loss Surgery", "Thyroid Surgery", "Prostate Surgery",
    "Lung Surgery", "Eye Laser Surgery", "Glaucoma Treatment",
    "Retina Treatment", "Ear Surgery", "Sinus Surgery", "Nasal Endoscopy",
    "Fertility Preservation", "Embryo Freezing", "Test Tube Baby Treatment",
    "Breast Biopsy", "Breast Reduction", "Breast Lift",
    "Caesarean Section", "Newborn Care", "Vaccination",
    "Pain Injection Therapy", "Spine Alignment Therapy",
    "Hand Surgery", "Ankle Surgery", "Foot Surgery", "Shoulder Replacement",
    "Laparoscopic Surgery", "Robotic Surgery", "Fibroid Removal",
    "Ovarian Cyst Removal", "Prostate Enlargement Treatment",
    "Kidney Transplant", "Bone Marrow Transplant", "Cancer Radiation",
    "Radiotherapy", "Immunotherapy", "Targeted Cancer Therapy",
    "Blood Transfusion", "IV Fluids Therapy", "Cholecystectomy",
    "Gastric Endoscopy", "Eye Implant Surgery", "Jaw Surgery",
    "Gum Surgery", "Mouth Ulcer Treatment", "Skin Allergy Treatment",
    "Psoriasis Treatment"
  ];

  console.log("⏳ Seeding Treatments...");
  // for (const name of treatments) {
  //   await prisma.treatment.upsert({
  //     where: { name },
  //     update: {},
  //     create: { name, description: `${name} procedure` },
  //   });
  // }
  console.log("✅ Treatments seeded!");




  const emailTemplates = [
    {
      name: 'welcome_email',
      subject: 'Welcome to Our Platform!',
      body: `<h1>Welcome!</h1><p>Thank you for signing up.</p>`,
    },
    {
      name: 'password_reset',
      subject: 'Reset Your Password',
      body: `<p>Click the link below to reset your password.</p>`,
    },
    {
      name: 'booking_confirmation',
      subject: 'Your Booking is Confirmed',
      body: `<p>Your booking has been successfully confirmed.</p>`,
    },
    {
      name: 'otp_verification',
      subject: 'Your One-Time Password',
      body: `
        <h2>OTP Verification</h2>
        <h1 style="letter-spacing: 4px;">{{OTP}}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    }
  ];



  // for (const template of emailTemplates) {
  //   await prisma.emailTemplate.upsert({
  //     where: { name: template.name },
  //     update: {}, 
  //     create: template,
  //   });
  // }

  console.log('✅ Email templates seeded successfully.');























}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
