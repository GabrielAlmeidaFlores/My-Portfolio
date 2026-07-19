import type { Certification } from "@/types/certification";

export const certifications: Certification[] = [
  {
    id: "aws-developer",
    name: "AWS Certified Developer — Associate",
    year: 2025,
    brand: "aws",
  },
  {
    id: "aws-solutions-architect",
    name: "AWS Certified Solutions Architect — Associate",
    year: 2023,
    brand: "aws",
  },
  {
    id: "aws-cloud-practitioner",
    name: "AWS Certified Cloud Practitioner",
    year: 2023,
    brand: "aws",
  },
  {
    id: "gcp-digital-leader",
    name: "Google Cloud Digital Leader",
    year: 2024,
    brand: "google-cloud",
  },
  {
    id: "lpi-linux",
    name: "LPI Linux Essentials",
    year: 2022,
    brand: "linux",
  },
];

export const awsCertifications = certifications.filter((cert) => cert.brand === "aws");
export const otherCertifications = certifications.filter((cert) => cert.brand !== "aws");
