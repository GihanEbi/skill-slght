import {
  Department,
  JobTemplate,
  Benefit,
  ExternalPublisher,
} from "../../types/job_types";
import { UUID } from "../../types/common_types";

// In-memory mock data based on UI dummy data
let departmentsData: Department[] = [
  {
    id: "D-101",
    name: "Engineering",
    description: "Software development team.",
    is_active: true,
  } as Department,
  {
    id: "D-102",
    name: "Marketing",
    description: "Brand & outreach.",
    is_active: true,
  } as Department,
];

let jobTemplatesData: JobTemplate[] = [
  { id: "JT-201", name: "Software Engineer", is_active: true } as JobTemplate,
  { id: "JT-202", name: "Product Manager", is_active: true } as JobTemplate,
];

let benefitsData: Benefit[] = [
  {
    id: "B-301",
    name: "Health Insurance",
    description: "Comprehensive health coverage.",
    icon_url: "health_and_safety",
  } as Benefit,
  {
    id: "B-302",
    name: "Remote Work",
    description: "Flexible work from anywhere.",
    icon_url: "home_work",
  } as Benefit,
];

let externalPublishersData: ExternalPublisher[] = [
  {
    id: "EP-401",
    name: "LinkedIn",
    description: "Post jobs directly to LinkedIn.",
    is_active: true,
  } as ExternalPublisher,
  {
    id: "EP-402",
    name: "Indeed",
    description: "Indeed integration.",
    is_active: true,
  } as ExternalPublisher,
];

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 300));
const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// ==========================================
// Departments CRUD
// ==========================================

export const fetchDepartments = async (): Promise<Department[]> => {
  await simulateDelay();
  return [...departmentsData];
};

export const createDepartment = async (
  deptData: Omit<Department, "id" | "created_at" | "updated_at">,
): Promise<Department> => {
  await simulateDelay();
  const newDepartment = {
    ...deptData,
    id: generateId("D"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Department;
  departmentsData = [...departmentsData, newDepartment];
  return newDepartment;
};

export const updateDepartment = async (
  id: UUID,
  deptData: Partial<Department>,
): Promise<Department> => {
  await simulateDelay();
  const index = departmentsData.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Not found");

  const updatedDepartment = {
    ...departmentsData[index],
    ...deptData,
    updated_at: new Date().toISOString(),
  } as Department;

  departmentsData[index] = updatedDepartment;
  return updatedDepartment;
};

export const deleteDepartment = async (id: UUID): Promise<void> => {
  await simulateDelay();
  departmentsData = departmentsData.filter((d) => d.id !== id);
};

// ==========================================
// Job Templates CRUD
// ==========================================

export const fetchJobTemplates = async (): Promise<JobTemplate[]> => {
  await simulateDelay();
  return [...jobTemplatesData];
};

export const createJobTemplate = async (
  templateData: Omit<JobTemplate, "id" | "created_at" | "updated_at">,
): Promise<JobTemplate> => {
  await simulateDelay();
  const newTemplate = {
    ...templateData,
    id: generateId("JT"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as JobTemplate;
  jobTemplatesData = [...jobTemplatesData, newTemplate];
  return newTemplate;
};

export const updateJobTemplate = async (
  id: UUID,
  templateData: Partial<JobTemplate>,
): Promise<JobTemplate> => {
  await simulateDelay();
  const index = jobTemplatesData.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Not found");

  const updatedTemplate = {
    ...jobTemplatesData[index],
    ...templateData,
    updated_at: new Date().toISOString(),
  } as JobTemplate;

  jobTemplatesData[index] = updatedTemplate;
  return updatedTemplate;
};

export const deleteJobTemplate = async (id: UUID): Promise<void> => {
  await simulateDelay();
  jobTemplatesData = jobTemplatesData.filter((t) => t.id !== id);
};

// ==========================================
// Benefits CRUD
// ==========================================

export const fetchBenefits = async (): Promise<Benefit[]> => {
  await simulateDelay();
  return [...benefitsData];
};

export const createBenefit = async (
  benefitData: Omit<Benefit, "id" | "created_at" | "updated_at">,
): Promise<Benefit> => {
  await simulateDelay();
  const newBenefit = {
    ...benefitData,
    id: generateId("B"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Benefit;
  benefitsData = [...benefitsData, newBenefit];
  return newBenefit;
};

export const updateBenefit = async (
  id: UUID,
  benefitData: Partial<Benefit>,
): Promise<Benefit> => {
  await simulateDelay();
  const index = benefitsData.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Not found");

  const updatedBenefit = {
    ...benefitsData[index],
    ...benefitData,
    updated_at: new Date().toISOString(),
  } as Benefit;

  benefitsData[index] = updatedBenefit;
  return updatedBenefit;
};

export const deleteBenefit = async (id: UUID): Promise<void> => {
  await simulateDelay();
  benefitsData = benefitsData.filter((b) => b.id !== id);
};

// ==========================================
// External Publishers CRUD
// ==========================================

export const fetchExternalPublishers = async (): Promise<
  ExternalPublisher[]
> => {
  await simulateDelay();
  return [...externalPublishersData];
};

export const createExternalPublisher = async (
  publisherData: Omit<ExternalPublisher, "id" | "created_at" | "updated_at">,
): Promise<ExternalPublisher> => {
  await simulateDelay();
  const newPublisher = {
    ...publisherData,
    id: generateId("EP"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as ExternalPublisher;
  externalPublishersData = [...externalPublishersData, newPublisher];
  return newPublisher;
};

export const updateExternalPublisher = async (
  id: UUID,
  publisherData: Partial<ExternalPublisher>,
): Promise<ExternalPublisher> => {
  await simulateDelay();
  const index = externalPublishersData.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Not found");

  const updatedPublisher = {
    ...externalPublishersData[index],
    ...publisherData,
    updated_at: new Date().toISOString(),
  } as ExternalPublisher;

  externalPublishersData[index] = updatedPublisher;
  return updatedPublisher;
};

export const deleteExternalPublisher = async (id: UUID): Promise<void> => {
  await simulateDelay();
  externalPublishersData = externalPublishersData.filter((p) => p.id !== id);
};
