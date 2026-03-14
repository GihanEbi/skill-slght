"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  AddCandidateFormData,
  CandidateStatus,
  CandidateSource,
} from "@/types/candidate_types";

interface AddCandidateContextType {
  formData: AddCandidateFormData;
  updateStepData: (step: keyof AddCandidateFormData, data: any) => void;
  setAllFormData: (data: AddCandidateFormData) => void;
  setCandidateId: (id: string | undefined) => void;
  resetForm: () => void;
  syncToMaster: () => void;
  isParsing: boolean;
  setIsParsing: (val: boolean) => void;
}

const initialData: AddCandidateFormData = {
  step1: {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    source: CandidateSource.Other,
  },
  step2: {
    availabilityStatus: "immediately",
    status: CandidateStatus.Active,
  },
  step3: {
    skills: [],
  },
  step4: {
    workExperience: [],
  },
  step5: {
    education: [],
  },
  step6: {
    certifications: [],
    portfolioFiles: [],
  },
  step7: {
    internalNotes: "",
    gdprConsent: false,
    gdprConsentDate: new Date().toISOString(),
    tags: [],
  },
};

const AddCandidateContext = createContext<AddCandidateContextType | undefined>(
  undefined,
);

export const AddCandidateProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<AddCandidateFormData>(initialData);
  const [isParsing, setIsParsing] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Multi-format mapper helper
  const mapToFormData = useCallback((candidate: any): AddCandidateFormData => {
    if (candidate.step1 && candidate.step2) {
      return {
        ...candidate,
        id: candidate.id,
      };
    }

    // Map flat structure to step structure
    return {
      id: candidate.id,
      step1: {
        firstName: candidate.firstName || "",
        lastName: candidate.lastName || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        whatsapp: candidate.whatsapp || "",
        country: candidate.country || "",
        city: candidate.city || "",
        timezone: candidate.timezone || "",
        willingToRelocate: candidate.willingToRelocate || false,
        linkedInUrl: candidate.linkedInUrl || "",
        portfolioUrl: candidate.portfolioUrl || "",
        source: candidate.source || CandidateSource.Other,
        sourceDetail: candidate.sourceDetail || "",
      },
      step2: {
        currentJobTitle: candidate.currentJobTitle || "",
        currentCompany: candidate.currentCompany || "",
        currentSalary: candidate.currentSalary || 0,
        currentSalaryCurrency: candidate.currentSalaryCurrency || "USD",
        availabilityStatus: candidate.availabilityStatus || "immediately",
        status: candidate.status || CandidateStatus.Active,
      },
      step3: { skills: candidate.skills || [] },
      step4: { workExperience: candidate.workExperience || [] },
      step5: { education: candidate.education || [] },
      step6: { certifications: [], portfolioFiles: [] },
      step7: {
        internalNotes: candidate.internalNotes || "",
        gdprConsent: candidate.gdprConsent || false,
        gdprConsentDate: candidate.gdprConsentDate || new Date().toISOString(),
        tags: candidate.tags || [],
      },
    };
  }, []);

  // Sync with Master Database (all-candidates)
  const syncToMaster = useCallback(() => {
    if (!formData.id) return;

    const raw = localStorage.getItem("all-candidates");
    if (!raw) return;

    try {
      let all = JSON.parse(raw);
      if (!Array.isArray(all)) return;

      const index = all.findIndex((c: any) => c.id === formData.id);
      if (index !== -1) {
        // Create full profile for storage
        const updatedProfile = {
          ...all[index],
          firstName: formData.step1.firstName,
          lastName: formData.step1.lastName,
          email: formData.step1.email,
          phone: formData.step1.phone,
          country: formData.step1.country,
          status: formData.step2.status,
          skills: formData.step3.skills,
          workExperience: formData.step4.workExperience,
          education: formData.step5.education,
          updatedAt: new Date().toISOString(),
          // Preserve custom structures if they were using steps
          ...(all[index].step1 ? formData : {}),
        };
        all[index] = updatedProfile;
        localStorage.setItem("all-candidates", JSON.stringify(all));
      }
    } catch (e) {
      console.error("Master Sync Error", e);
    }
  }, [formData]);

  // Load from master database if ID is in URL
  useEffect(() => {
    if (editId && formData.id !== editId) {
      const raw = localStorage.getItem("all-candidates");
      if (raw) {
        try {
          const all = JSON.parse(raw);
          const found = all.find((c: any) => c.id === editId);
          if (found) {
            setFormData(mapToFormData(found));
          }
        } catch (e) {
          console.error("Failed to load candidate from master", e);
        }
      }
    } else if (!editId && formData.id) {
      // If no ID in URL but we have one in state, it means we might want to reset or keep it?
      // User says: "if not have the id in url, then we can concider this is new candidate"
      // To prevent losing work, we'll only reset if explicitly told or if entering fresh.
    }
  }, [editId, formData.id, mapToFormData]);

  // Load from draft if NEW candidate
  useEffect(() => {
    if (!editId) {
      const savedData = localStorage.getItem("add-candidate-draft");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (!parsed.id) {
            // Only load draft if it's NOT an edit session
            setFormData(parsed);
          }
        } catch (e) {
          console.error("Draft Load Error", e);
        }
      }
    }
  }, [editId]);

  // Save to draft
  useEffect(() => {
    localStorage.setItem("add-candidate-draft", JSON.stringify(formData));
  }, [formData]);

  const updateStepData = (step: keyof AddCandidateFormData, data: any) => {
    if (step === "id") return;
    setFormData((prev) => ({
      ...prev,
      [step]: { ...(prev[step] as object), ...data },
    }));
  };

  const setAllFormData = (data: AddCandidateFormData) => {
    setFormData(data);
  };

  const setCandidateId = (id: string | undefined) => {
    setFormData((prev) => ({ ...prev, id }));
  };

  const resetForm = () => {
    setFormData(initialData);
    localStorage.removeItem("add-candidate-draft");
  };

  return (
    <AddCandidateContext.Provider
      value={{
        formData,
        updateStepData,
        setAllFormData,
        setCandidateId,
        resetForm,
        syncToMaster,
        isParsing,
        setIsParsing,
      }}
    >
      {children}
    </AddCandidateContext.Provider>
  );
};

export const useAddCandidate = () => {
  const context = useContext(AddCandidateContext);
  if (context === undefined) {
    throw new Error(
      "useAddCandidate must be used within an AddCandidateProvider",
    );
  }
  return context;
};
