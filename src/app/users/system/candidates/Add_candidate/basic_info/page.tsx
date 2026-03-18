// "use client";

// import React, { useState, useRef, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAddCandidate } from "@/context/AddCandidateContext";
// import { CandidateSource, CandidateStatus } from "@/types/candidate_types";
// import { motion, AnimatePresence } from "framer-motion";

// function BasicInfoContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("id");
//   const { formData, updateStepData, syncToMaster } = useAddCandidate();
//   const [errors, setErrors] = useState<Record<string, string | undefined>>({});
//   const [isSourceOpen, setIsSourceOpen] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [showMethodPopup, setShowMethodPopup] = useState(false);
//   const [popupMode, setPopupMode] = useState<
//     "selection" | "upload" | "loading"
//   >("selection");
//   const cvFileInputRef = useRef<HTMLInputElement>(null);
//   const [hasPromptedMethod, setHasPromptedMethod] = useState(false);

//   useEffect(() => {
//     // Show popup if not editing and no first name has been entered yet.
//     if (
//       !editId &&
//       !formData.step1.firstName &&
//       !formData.step1.email &&
//       !hasPromptedMethod
//     ) {
//       setShowMethodPopup(true);
//       setHasPromptedMethod(true);
//     }
//   }, [
//     editId,
//     formData.step1.firstName,
//     formData.step1.email,
//     hasPromptedMethod,
//   ]);

//   const handleManualSelection = () => {
//     setShowMethodPopup(false);
//   };

//   const handleCvUploadClick = () => {
//     setPopupMode("upload");
//   };

//   const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPopupMode("loading");
//       // Simulate CV parsing delay
//       setTimeout(() => {
//         // Mock extracted data following AddCandidateFormData structure
//         // and matching field names used in other pages (Candidate Details etc.)
//         updateStepData("step1", {
//           firstName: "John",
//           lastName: "Doe",
//           email: "john.doe@techneura.com",
//           phone: "+1 234 567 8900",
//           country: "United States",
//           address: "123 Main St",
//           longitude: "123456",
//           latitude: "123456",
//           city: "San Francisco",
//           timezone: "GMT-8 (PST)",
//           willingToRelocate: true,
//           linkedInUrl: "https://linkedin.com/in/johndoe",
//           source: CandidateSource.Other,
//           sourceDetail: "CV Parsing System",
//         });

//         updateStepData("step2", {
//           currentJobTitle: "Senior Full Stack Engineer",
//           currentCompany: "Innovative Systems Inc.",
//           currentSalary: 145000,
//           currentSalaryCurrency: "USD",
//           availabilityStatus: "immediately",
//           earliestStartDate: "2024-05-01",
//           status: CandidateStatus.Active,
//         });

//         updateStepData("step3", {
//           skills: [
//             { skillName: "React", proficiency: "expert", yearsOfExperience: 6 },
//             {
//               skillName: "TypeScript",
//               proficiency: "advanced",
//               yearsOfExperience: 5,
//             },
//             {
//               skillName: "Node.js",
//               proficiency: "advanced",
//               yearsOfExperience: 5,
//             },
//             {
//               skillName: "Python",
//               proficiency: "intermediate",
//               yearsOfExperience: 3,
//             },
//             { skillName: "AWS", proficiency: "advanced", yearsOfExperience: 4 },
//             {
//               skillName: "Docker",
//               proficiency: "intermediate",
//               yearsOfExperience: 3,
//             },
//           ],
//         });

//         updateStepData("step4", {
//           workExperience: [
//             {
//               id: "exp-1",
//               companyName: "Innovative Systems Inc.",
//               jobTitle: "Senior Full Stack Engineer",
//               startDate: "2020-03-01",
//               endDate: null,
//               isCurrent: true,
//               location: "San Francisco, CA",
//               description:
//                 "Leading the development of a cloud-native microservices platform using React, Node.js, and AWS. Improved system performance by 40% through infrastructure optimization.",
//             },
//             {
//               id: "exp-2",
//               companyName: "Web Solutions Ltd",
//               jobTitle: "Software Developer",
//               startDate: "2017-06-15",
//               endDate: "2020-02-28",
//               isCurrent: false,
//               location: "Austin, TX",
//               description:
//                 "Developed and maintained various client-facing web applications focusing on responsive design and performance.",
//             },
//           ],
//         });

//         updateStepData("step5", {
//           education: [
//             {
//               institution: "Stanford University",
//               degree: "Master of Science",
//               fieldOfStudy: "Computer Science",
//               startDate: "2015-09-01",
//               endDate: "2017-05-20",
//               grade: "3.9/4.0",
//             },
//           ],
//         });

//         setShowMethodPopup(false);
//         // Reset popup mode for next time
//         setTimeout(() => setPopupMode("selection"), 500);
//       }, 3000); // 3 seconds mock loading
//     }
//   };

//   useEffect(() => {
//     if (editId) {
//       const rawData = localStorage.getItem("all-candidates");
//       let foundImage = null;
//       let displayIndex = 0;

//       if (rawData) {
//         try {
//           const storedCandidates = JSON.parse(rawData);
//           if (Array.isArray(storedCandidates)) {
//             const foundIndex = storedCandidates.findIndex(
//               (c: any) =>
//                 c.id && c.id.replace("#", "") === editId.replace("#", ""),
//             );
//             if (foundIndex !== -1) {
//               const candidate = storedCandidates[foundIndex];
//               displayIndex = foundIndex;
//               if (
//                 candidate.profilePhotoUrl ||
//                 candidate.step1?.profilePhotoUrl ||
//                 candidate.step1?.profilePhoto
//               ) {
//                 foundImage =
//                   candidate.profilePhotoUrl ||
//                   candidate.step1?.profilePhotoUrl ||
//                   candidate.step1?.profilePhoto;
//               }
//               // Force dynamic override if the fallback image was saved previously
//               if (foundImage === "/images/avatar-img/avatar-1.jpg") {
//                 foundImage = null;
//               }
//             }
//           }
//         } catch (e) {
//           console.error(e);
//         }
//       }

//       if (!foundImage) {
//         const avatarImages = [
//           "avt1.png",
//           "avt2.png",
//           "avt3.jpg",
//           "avt4.jpg",
//           "avt5.jpg",
//           "avt6.png",
//           "avt7.jpg",
//           "avt8.png",
//         ];
//         foundImage = `/images/avatars/${avatarImages[displayIndex % avatarImages.length]}`;
//       }

//       setProfileImage(foundImage);
//     }
//   }, [editId]);

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validate = () => {
//     const newErrors: Record<string, string | undefined> = {};
//     if (!formData.step1.firstName)
//       newErrors.firstName = "First name is required";
//     if (!formData.step1.lastName) newErrors.lastName = "Last name is required";
//     if (!formData.step1.email) {
//       newErrors.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.step1.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!formData.step1.country) newErrors.country = "Country is required";
//     if (!formData.step1.source) newErrors.source = "Source is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validate()) {
//       syncToMaster(); // Save progress to master if editing
//       const nextPath =
//         "/users/system/candidates/Add_candidate/current_role_availability";
//       router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     const val =
//       type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
//     updateStepData("step1", { [name]: val });
//   };

//   return (
//     <div className="flex flex-col h-full bg-transparent">
//       {/* ── Method Selection Popup ────────────────────────────────────────── */}
//       <AnimatePresence>
//         {showMethodPopup && (
//           <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="relative w-full max-w-md bg-(--surface) rounded-3xl border border-(--glass-border) shadow-2xl overflow-hidden p-8"
//             >
//               {popupMode === "selection" && (
//                 <div className="text-center space-y-8">
//                   <div className="space-y-2">
//                     <h2 className="text-2xl font-bold text-(--text-main)">
//                       Add Candidate
//                     </h2>
//                     <p className="text-sm text-(--text-muted) font-medium">
//                       How would you like to build this candidate's profile?
//                     </p>
//                   </div>
//                   <div className="grid grid-cols-1 gap-4">
//                     <button
//                       onClick={handleCvUploadClick}
//                       className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all gap-3"
//                     >
//                       <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">
//                         upload_file
//                       </span>
//                       <div className="space-y-1">
//                         <span className="font-bold text-(--text-main) block">
//                           Upload CV
//                         </span>
//                         <span className="text-xs text-(--text-muted) block">
//                           Auto-extract information from resume
//                         </span>
//                       </div>
//                     </button>
//                     <button
//                       onClick={handleManualSelection}
//                       className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-(--border-subtle) hover:border-primary/50 bg-(--background)/50 transition-all gap-3"
//                     >
//                       <span className="material-symbols-outlined text-4xl text-(--text-muted) group-hover:text-primary group-hover:scale-110 transition-all">
//                         edit_document
//                       </span>
//                       <div className="space-y-1">
//                         <span className="font-bold text-(--text-main) block">
//                           Enter Manually
//                         </span>
//                         <span className="text-xs text-(--text-muted) block">
//                           Type out all candidate details yourself
//                         </span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {popupMode === "upload" && (
//                 <div className="text-center space-y-8">
//                   <div className="space-y-2">
//                     <h2 className="text-2xl font-bold text-(--text-main)">
//                       Upload Resume
//                     </h2>
//                     <p className="text-sm text-(--text-muted) font-medium">
//                       Select a PDF or Word document to parse.
//                     </p>
//                   </div>
//                   <div
//                     onClick={() => cvFileInputRef.current?.click()}
//                     className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer gap-4 group"
//                   >
//                     <span className="material-symbols-outlined text-5xl text-primary/60 group-hover:text-primary transition-colors">
//                       cloud_upload
//                     </span>
//                     <span className="font-bold text-(--text-main)">
//                       Browse Files
//                     </span>
//                     <span className="text-xs text-(--text-muted)">
//                       Supports PDF, DOCX, TXT
//                     </span>
//                     <input
//                       type="file"
//                       ref={cvFileInputRef}
//                       className="hidden"
//                       accept=".pdf,.doc,.docx,.txt"
//                       onChange={handleCvFileChange}
//                     />
//                   </div>
//                   <button
//                     onClick={() => setPopupMode("selection")}
//                     className="text-sm font-bold text-(--text-muted) hover:text-(--text-main) transition-colors"
//                   >
//                     Back to selection
//                   </button>
//                 </div>
//               )}

//               {popupMode === "loading" && (
//                 <div className="text-center space-y-8 py-8">
//                   <div className="flex justify-center">
//                     <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//                   </div>
//                   <div className="space-y-2">
//                     <h2 className="text-xl font-bold text-(--text-main)">
//                       Extracting Data
//                     </h2>
//                     <p className="text-sm text-(--text-muted) font-medium animate-pulse">
//                       Parsing resume and analyzing profile details...
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* ── Main Content Area (8/4 Grid) ─────────────────────────────────── */}
//       <main className="flex-1 p-6 md:p-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//           {/* ── Form Panel (8 cols) ────────────────────────────────────────── */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="lg:col-span-8 space-y-10"
//           >
//             {/* Page Header */}
//             <div className="mb-10 pb-4 border-b border-[var(--border-subtle)]">
//               <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
//                 Basic Information
//               </h1>
//               <p className="text-sm text-(--text-muted) font-medium">
//                 Establish the candidate's core identity and contact parameters
//                 for the recruitment pipeline.
//               </p>
//             </div>

//             <div className="space-y-12">
//               {/* Identity Section */}
//               <section className="space-y-6">
//                 <div className="flex flex-col items-center justify-center mb-10">
//                   <div className="relative group">
//                     <div
//                       onClick={handleImageClick}
//                       className="w-32 h-32 rounded-full border-4 border-(--border-subtle) bg-(--surface) overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-lg flex items-center justify-center relative"
//                     >
//                       {profileImage ? (
//                         <img
//                           src={profileImage}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex flex-col items-center justify-center text-(--text-muted) opacity-60">
//                           <span className="material-symbols-outlined text-4xl">
//                             add_a_photo
//                           </span>
//                         </div>
//                       )}
//                       {/* Overlay */}
//                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                         <span className="material-symbols-outlined text-white">
//                           edit
//                         </span>
//                       </div>
//                     </div>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                     <div className="absolute -bottom-2 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-4 border-(--background)">
//                       <span className="material-symbols-outlined text-lg">
//                         camera_alt
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mt-4">
//                     Candidate Portrait
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       First Name <span className="text-red-400">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.step1.firstName}
//                       onChange={handleChange}
//                       className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.firstName ? "border-red-400/60 focus:border-red-400" : ""}`}
//                       placeholder="e.g. John"
//                     />
//                     {errors.firstName && <FieldError msg={errors.firstName} />}
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Last Name <span className="text-red-400">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.step1.lastName}
//                       onChange={handleChange}
//                       className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.lastName ? "border-red-400/60 focus:border-red-400" : ""}`}
//                       placeholder="e.g. Doe"
//                     />
//                     {errors.lastName && <FieldError msg={errors.lastName} />}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                     Email Address <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.step1.email}
//                     onChange={handleChange}
//                     className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.email ? "border-red-400/60 focus:border-red-400" : ""}`}
//                     placeholder="e.g. john.doe@techneura.com"
//                   />
//                   {errors.email && <FieldError msg={errors.email} />}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.step1.phone || ""}
//                       onChange={handleChange}
//                       className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                       placeholder="+1 234 567 890"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       WhatsApp
//                     </label>
//                     <input
//                       type="tel"
//                       name="whatsapp"
//                       value={formData.step1.whatsapp || ""}
//                       onChange={handleChange}
//                       className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                       placeholder="+1 234 567 890"
//                     />
//                   </div>
//                 </div>
//               </section>

//               {/* Location Section */}
//               <section className="space-y-6">
//                 <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
//                   Location Context
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Country <span className="text-red-400">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="country"
//                       value={formData.step1.country}
//                       onChange={handleChange}
//                       className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.country ? "border-red-400/60 focus:border-red-400" : ""}`}
//                       placeholder="e.g. United Kingdom"
//                     />
//                     {errors.country && <FieldError msg={errors.country} />}
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.step1.city || ""}
//                       onChange={handleChange}
//                       className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                       placeholder="e.g. London"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Timezone
//                     </label>
//                     <input
//                       type="text"
//                       name="timezone"
//                       value={formData.step1.timezone || ""}
//                       onChange={handleChange}
//                       className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                       placeholder="e.g. GMT+0"
//                     />
//                   </div>
//                   <div className="pt-6">
//                     <label className="flex items-center gap-4 p-5 rounded-2xl border border-(--border-subtle) bg-(--surface)/40 cursor-pointer hover:bg-primary/5 transition-all group">
//                       <div
//                         className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.step1.willingToRelocate ? "bg-primary border-primary" : "border-(--border-subtle)"}`}
//                       >
//                         {formData.step1.willingToRelocate && (
//                           <span className="material-symbols-outlined text-white text-sm">
//                             check
//                           </span>
//                         )}
//                       </div>
//                       <input
//                         type="checkbox"
//                         name="willingToRelocate"
//                         checked={!!formData.step1.willingToRelocate}
//                         onChange={handleChange}
//                         className="hidden"
//                       />
//                       <span className="text-sm font-bold text-(--text-muted) group-hover:text-primary transition-colors">
//                         Open to Relocation
//                       </span>
//                       <span className="material-symbols-outlined text-(--text-muted) opacity-40 ml-auto group-hover:text-primary group-hover:opacity-100 transition-colors">
//                         travel_explore
//                       </span>
//                     </label>
//                   </div>
//                 </div>
//               </section>

//               {/* Profile & Source Section */}
//               <section className="space-y-6">
//                 <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
//                   Profile & Origin
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       LinkedIn URL
//                     </label>
//                     <div className="relative flex items-center">
//                       <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
//                         link
//                       </span>
//                       <input
//                         type="url"
//                         name="linkedInUrl"
//                         value={formData.step1.linkedInUrl || ""}
//                         onChange={handleChange}
//                         className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                         placeholder="linkedin.com/in/username"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Portfolio / Personal Web
//                     </label>
//                     <div className="relative flex items-center">
//                       <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
//                         public
//                       </span>
//                       <input
//                         type="url"
//                         name="portfolioUrl"
//                         value={formData.step1.portfolioUrl || ""}
//                         onChange={handleChange}
//                         className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                         placeholder="portfolio.com"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                   {/* Custom Source Dropdown */}
//                   <div className="space-y-2 relative">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Candidate Source <span className="text-red-400">*</span>
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setIsSourceOpen((o) => !o)}
//                       className={`w-full premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) flex items-center justify-between hover:border-primary/50 transition-all ${errors.source ? "border-red-400/60" : ""}`}
//                     >
//                       <span className="capitalize">
//                         {formData.step1.source?.replace("_", " ")}
//                       </span>
//                       <motion.span
//                         animate={{ rotate: isSourceOpen ? 180 : 0 }}
//                         className="material-symbols-outlined text-primary"
//                       >
//                         expand_more
//                       </motion.span>
//                     </button>

//                     <AnimatePresence>
//                       {isSourceOpen && (
//                         <>
//                           <motion.div
//                             initial={{ opacity: 0, y: -8 }}
//                             animate={{ opacity: 1, y: 4 }}
//                             exit={{ opacity: 0, y: -8 }}
//                             className="absolute w-full z-110 bg-(--surface) rounded-2xl border border-(--glass-border) shadow-2xl overflow-hidden p-1 max-h-64 overflow-y-auto"
//                           >
//                             {Object.values(CandidateSource).map((src) => (
//                               <button
//                                 key={src}
//                                 type="button"
//                                 onClick={() => {
//                                   updateStepData("step1", { source: src });
//                                   setIsSourceOpen(false);
//                                   setErrors(({ source, ...p }) => p);
//                                 }}
//                                 className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors rounded-xl capitalize ${formData.step1.source === src ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
//                               >
//                                 {src.replace("_", " ")}
//                               </button>
//                             ))}
//                           </motion.div>
//                           <div
//                             className="fixed inset-0 z-100"
//                             onClick={() => setIsSourceOpen(false)}
//                           />
//                         </>
//                       )}
//                     </AnimatePresence>
//                     {errors.source && <FieldError msg={errors.source} />}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
//                       Source Detail
//                     </label>
//                     <input
//                       type="text"
//                       name="sourceDetail"
//                       value={formData.step1.sourceDetail || ""}
//                       onChange={handleChange}
//                       className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
//                       placeholder="e.g. LinkedIn Recruiter Campaign"
//                     />
//                   </div>
//                 </div>
//               </section>
//             </div>
//           </motion.div>

//           {/* ── Sidebar (4 cols) ───────────────────────────────────────────── */}
//           <motion.aside
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="lg:col-span-4 lg:sticky lg:top-10 space-y-6"
//           >
//             {/* AI Assistant Card (Matching Job Theme) */}
//             <div className="glass-panel rounded-4xl p-8 shadow-glow relative overflow-hidden border-primary/10">
//               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
//               <div className="relative z-10 space-y-8">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
//                     <span className="material-symbols-outlined text-2xl">
//                       psychology
//                     </span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
//                       AI Extraction
//                     </h3>
//                     <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
//                       Active Analysis
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-5 bg-primary/5 rounded-2xl border-primary/10 border">
//                   <p className="text-xs text-(--text-muted) italic leading-relaxed text-center font-medium">
//                     {formData.step1.email
//                       ? `Candidate "${formData.step1.firstName}" is being indexed into the Talent Pool.`
//                       : "Start typing to see real-time candidate profiling insights."}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Live Summary Card (Matching Job Theme) */}
//             <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
//               <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
//                 Profile Preview
//               </h4>
//               <div className="space-y-4">
//                 <SummaryRow
//                   label="Name"
//                   value={
//                     `${formData.step1.firstName || ""} ${formData.step1.lastName || ""}`.trim() ||
//                     "—"
//                   }
//                 />
//                 <SummaryRow label="Email" value={formData.step1.email || "—"} />
//                 <SummaryRow
//                   label="Origin"
//                   value={formData.step1.country || "—"}
//                 />
//                 <SummaryRow
//                   label="Source"
//                   value={formData.step1.source?.replace("_", " ") || "—"}
//                 />
//                 <SummaryRow
//                   label="Relocating"
//                   value={formData.step1.willingToRelocate ? "Yes" : "No"}
//                 />
//               </div>
//             </div>
//           </motion.aside>
//         </div>
//       </main>

//       {/* ── Sticky Footer (Matching Job Theme) ────────────────────────────── */}
//       <footer className="mt-auto border-t border-(--border-subtle) bg-(--background)/80 backdrop-blur-md z-90 shadow-premium">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           <button
//             disabled
//             className="flex items-center gap-2 text-(--text-muted) font-bold text-sm cursor-not-allowed group opacity-30"
//           >
//             <span className="material-symbols-outlined text-lg">
//               arrow_back
//             </span>
//             Back
//           </button>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() =>
//                 router.push("/users/system/candidates/all_candidates")
//               }
//               className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-(--border-subtle) text-(--text-muted) font-bold text-sm hover:border-primary/30 hover:text-primary transition-all"
//             >
//               <span className="material-symbols-outlined text-base">close</span>
//               Cancel
//             </button>
//             <button
//               onClick={handleNext}
//               className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:-translate-y-px transition-all shadow-premium"
//             >
//               Next: Current Role
//               <span className="material-symbols-outlined text-sm">
//                 arrow_forward
//               </span>
//             </button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default function BasicInfoStep() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex h-screen items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//         </div>
//       }
//     >
//       <BasicInfoContent />
//     </Suspense>
//   );
// }
// // ── Sub-components (Internal) ─────────────────────────────────────────────

// function FieldError({ msg }: { msg: string }) {
//   return (
//     <motion.p
//       initial={{ opacity: 0, y: -4 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="text-[11px] font-semibold text-red-500 ml-1 flex items-center gap-1"
//     >
//       <span className="material-symbols-outlined text-sm">error</span>
//       {msg}
//     </motion.p>
//   );
// }

// function SummaryRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <span className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
//         {label}
//       </span>
//       <span className="text-xs font-bold text-(--text-main) text-right truncate max-w-[60%]">
//         {value}
//       </span>
//     </div>
//   );
// }

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { CandidateSource, CandidateStatus } from "@/types/candidate_types";
import { motion, AnimatePresence } from "framer-motion";

// ── Map Modal Component ────────────────────────────────────────────────────
interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
  initialLat?: string;
  initialLng?: string;
}

function MapModal({
  isOpen,
  onClose,
  onConfirm,
  initialLat,
  initialLng,
}: MapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLat, setSelectedLat] = useState("");
  const [selectedLng, setSelectedLng] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchError, setSearchError] = useState("");

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }, []);

  const updateMarker = useCallback(
    async (map: any, L: any, lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          draggable: true,
          icon: L.divIcon({
            className: "",
            html: `<div style="width:32px;height:32px;background:var(--color-primary,#6366f1);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.35)"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).addTo(map);

        markerRef.current.on("dragend", async () => {
          const { lat: dLat, lng: dLng } = markerRef.current.getLatLng();
          const addr = await reverseGeocode(dLat, dLng);
          setSelectedLat(dLat.toFixed(6));
          setSelectedLng(dLng.toFixed(6));
          setSelectedAddress(addr);
        });
      }

      setSelectedLat(lat.toFixed(6));
      setSelectedLng(lng.toFixed(6));
      const addr = await reverseGeocode(lat, lng);
      setSelectedAddress(addr);
    },
    [reverseGeocode],
  );

  useEffect(() => {
    if (!isOpen) return;

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        // Load Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
          document.head.appendChild(link);
        }
        // Load Leaflet JS
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const defaultLat =
        initialLat && !isNaN(parseFloat(initialLat))
          ? parseFloat(initialLat)
          : 51.505;
      const defaultLng =
        initialLng && !isNaN(parseFloat(initialLng))
          ? parseFloat(initialLng)
          : -0.09;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([defaultLat, defaultLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        await updateMarker(map, L, lat, lng);
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Place initial marker if coords exist
      if (
        initialLat &&
        initialLng &&
        !isNaN(parseFloat(initialLat)) &&
        !isNaN(parseFloat(initialLng))
      ) {
        await updateMarker(
          map,
          L,
          parseFloat(initialLat),
          parseFloat(initialLng),
        );
      }
    };

    // Small delay so modal animation completes before map init
    const timer = setTimeout(loadLeaflet, 150);
    return () => clearTimeout(timer);
  }, [isOpen, initialLat, initialLng, updateMarker]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      setIsMapReady(false);
      setSelectedAddress("");
      setSelectedLat("");
      setSelectedLng("");
      setSearchQuery("");
      setSearchError("");
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsGeocoding(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const results = await res.json();
      if (results.length === 0) {
        setSearchError("No results found. Try a different address.");
        return;
      }
      const { lat, lon } = results[0];
      const L = (window as any).L;
      mapInstanceRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);
      await updateMarker(
        mapInstanceRef.current,
        L,
        parseFloat(lat),
        parseFloat(lon),
      );
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const L = (window as any).L;
      mapInstanceRef.current?.setView([latitude, longitude], 15);
      await updateMarker(mapInstanceRef.current, L, latitude, longitude);
    });
  };

  const handleConfirm = () => {
    if (!selectedLat || !selectedLng) return;
    onConfirm({
      address: selectedAddress,
      latitude: selectedLat,
      longitude: selectedLng,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-(--surface) rounded-3xl border border-(--glass-border) shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-(--border-subtle) flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-(--text-main)">
              Select Location
            </h2>
            <p className="text-xs text-(--text-muted) font-medium mt-0.5">
              Click on the map or search to pin the candidate's location
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-(--border-subtle) flex items-center justify-center text-(--text-muted) hover:text-primary hover:border-primary/40 transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-3 shrink-0 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="relative flex-1">
              {/* <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) text-lg opacity-60">
                search
              </span> */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search address, city, or landmark..."
                className="premium-input w-full rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-(--text-main) placeholder:font-medium placeholder:opacity-40"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isGeocoding}
              className="px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60 shrink-0"
            >
              {isGeocoding ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-base">
                  search
                </span>
              )}
              Search
            </button>
            <button
              onClick={handleUseMyLocation}
              title="Use my location"
              className="px-3 py-3 rounded-xl border border-(--border-subtle) text-(--text-muted) hover:text-primary hover:border-primary/40 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-base">
                my_location
              </span>
            </button>
          </div>
          {searchError && (
            <p className="text-xs text-red-500 font-semibold flex items-center gap-1 ml-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {searchError}
            </p>
          )}
        </div>

        {/* Map */}
        <div
          className="relative mx-6 rounded-2xl overflow-hidden shrink-0 border border-(--border-subtle)"
          style={{ height: "340px" }}
        >
          <div ref={mapContainerRef} className="w-full h-full" />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-(--surface)">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-(--text-muted) font-medium">
                  Loading map...
                </p>
              </div>
            </div>
          )}
          {isMapReady && !selectedLat && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-(--surface)/90 backdrop-blur-sm rounded-2xl px-5 py-3 border border-(--border-subtle) shadow-lg">
                <p className="text-xs font-bold text-(--text-muted) flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">
                    touch_app
                  </span>
                  Click anywhere on the map to drop a pin
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Info */}
        <div className="px-6 py-4 shrink-0">
          {selectedLat && selectedLng ? (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">
                  location_on
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-(--text-main) leading-relaxed line-clamp-2">
                    {selectedAddress || "Address resolving..."}
                  </p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                      Lat:{" "}
                      <span className="text-primary font-mono">
                        {selectedLat}
                      </span>
                    </span>
                    <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                      Lng:{" "}
                      <span className="text-primary font-mono">
                        {selectedLng}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-(--background)/50 border border-(--border-subtle) text-center">
              <p className="text-xs text-(--text-muted) font-medium">
                No location selected yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-(--border-subtle) text-(--text-muted) font-bold text-sm hover:border-primary/30 hover:text-primary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLat || !selectedLng}
            className="active-tab-gradient px-6 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:-translate-y-px transition-all shadow-premium disabled:opacity-40 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-base">
              check_circle
            </span>
            Confirm Location
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────

function BasicInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showMethodPopup, setShowMethodPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<
    "selection" | "upload" | "loading"
  >("selection");
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const [hasPromptedMethod, setHasPromptedMethod] = useState(false);

  // Map modal state
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (
      !editId &&
      !formData.step1.firstName &&
      !formData.step1.email &&
      !hasPromptedMethod
    ) {
      setShowMethodPopup(true);
      setHasPromptedMethod(true);
    }
  }, [
    editId,
    formData.step1.firstName,
    formData.step1.email,
    hasPromptedMethod,
  ]);

  const handleManualSelection = () => {
    setShowMethodPopup(false);
  };

  const handleCvUploadClick = () => {
    setPopupMode("upload");
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPopupMode("loading");
      setTimeout(() => {
        updateStepData("step1", {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@techneura.com",
          phone: "+1 234 567 8900",
          country: "United States",
          address: "123 Main St",
          longitude: "-122.4194",
          latitude: "37.7749",
          city: "San Francisco",
          timezone: "GMT-8 (PST)",
          willingToRelocate: true,
          linkedInUrl: "https://linkedin.com/in/johndoe",
          source: CandidateSource.Other,
          sourceDetail: "CV Parsing System",
        });

        updateStepData("step2", {
          currentJobTitle: "Senior Full Stack Engineer",
          currentCompany: "Innovative Systems Inc.",
          currentSalary: 145000,
          currentSalaryCurrency: "USD",
          availabilityStatus: "immediately",
          earliestStartDate: "2024-05-01",
          status: CandidateStatus.Active,
        });

        updateStepData("step3", {
          skills: [
            { skillName: "React", proficiency: "expert", yearsOfExperience: 6 },
            {
              skillName: "TypeScript",
              proficiency: "advanced",
              yearsOfExperience: 5,
            },
            {
              skillName: "Node.js",
              proficiency: "advanced",
              yearsOfExperience: 5,
            },
            {
              skillName: "Python",
              proficiency: "intermediate",
              yearsOfExperience: 3,
            },
            { skillName: "AWS", proficiency: "advanced", yearsOfExperience: 4 },
            {
              skillName: "Docker",
              proficiency: "intermediate",
              yearsOfExperience: 3,
            },
          ],
        });

        updateStepData("step4", {
          workExperience: [
            {
              id: "exp-1",
              companyName: "Innovative Systems Inc.",
              jobTitle: "Senior Full Stack Engineer",
              startDate: "2020-03-01",
              endDate: null,
              isCurrent: true,
              location: "San Francisco, CA",
              description:
                "Leading the development of a cloud-native microservices platform using React, Node.js, and AWS. Improved system performance by 40% through infrastructure optimization.",
            },
            {
              id: "exp-2",
              companyName: "Web Solutions Ltd",
              jobTitle: "Software Developer",
              startDate: "2017-06-15",
              endDate: "2020-02-28",
              isCurrent: false,
              location: "Austin, TX",
              description:
                "Developed and maintained various client-facing web applications focusing on responsive design and performance.",
            },
          ],
        });

        updateStepData("step5", {
          education: [
            {
              institution: "Stanford University",
              degree: "Master of Science",
              fieldOfStudy: "Computer Science",
              startDate: "2015-09-01",
              endDate: "2017-05-20",
              grade: "3.9/4.0",
            },
          ],
        });

        setShowMethodPopup(false);
        setTimeout(() => setPopupMode("selection"), 500);
      }, 3000);
    }
  };

  useEffect(() => {
    if (editId) {
      const rawData = localStorage.getItem("all-candidates");
      let foundImage = null;
      let displayIndex = 0;

      if (rawData) {
        try {
          const storedCandidates = JSON.parse(rawData);
          if (Array.isArray(storedCandidates)) {
            const foundIndex = storedCandidates.findIndex(
              (c: any) =>
                c.id && c.id.replace("#", "") === editId.replace("#", ""),
            );
            if (foundIndex !== -1) {
              const candidate = storedCandidates[foundIndex];
              displayIndex = foundIndex;
              if (
                candidate.profilePhotoUrl ||
                candidate.step1?.profilePhotoUrl ||
                candidate.step1?.profilePhoto
              ) {
                foundImage =
                  candidate.profilePhotoUrl ||
                  candidate.step1?.profilePhotoUrl ||
                  candidate.step1?.profilePhoto;
              }
              if (foundImage === "/images/avatar-img/avatar-1.jpg") {
                foundImage = null;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (!foundImage) {
        const avatarImages = [
          "avt1.png",
          "avt2.png",
          "avt3.jpg",
          "avt4.jpg",
          "avt5.jpg",
          "avt6.png",
          "avt7.jpg",
          "avt8.png",
        ];
        foundImage = `/images/avatars/${avatarImages[displayIndex % avatarImages.length]}`;
      }

      setProfileImage(foundImage);
    }
  }, [editId]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle map confirmation — populate address, lat, lng
  const handleMapConfirm = ({
    address,
    latitude,
    longitude,
  }: {
    address: string;
    latitude: string;
    longitude: string;
  }) => {
    updateStepData("step1", { address, latitude, longitude });
    setIsMapOpen(false);
  };

  const validate = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!formData.step1.firstName)
      newErrors.firstName = "First name is required";
    if (!formData.step1.lastName) newErrors.lastName = "Last name is required";
    if (!formData.step1.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.step1.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.step1.country) newErrors.country = "Country is required";
    if (!formData.step1.source) newErrors.source = "Source is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      syncToMaster();
      const nextPath =
        "/users/system/candidates/Add_candidate/current_role_availability";
      router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    updateStepData("step1", { [name]: val });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* ── Method Selection Popup ────────────────────────────────────────── */}
      <AnimatePresence>
        {showMethodPopup && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-(--surface) rounded-3xl border border-(--glass-border) shadow-2xl overflow-hidden p-8"
            >
              {popupMode === "selection" && (
                <div className="text-center space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-(--text-main)">
                      Add Candidate
                    </h2>
                    <p className="text-sm text-(--text-muted) font-medium">
                      How would you like to build this candidate's profile?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={handleCvUploadClick}
                      className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all gap-3"
                    >
                      <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">
                        upload_file
                      </span>
                      <div className="space-y-1">
                        <span className="font-bold text-(--text-main) block">
                          Upload CV
                        </span>
                        <span className="text-xs text-(--text-muted) block">
                          Auto-extract information from resume
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={handleManualSelection}
                      className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-(--border-subtle) hover:border-primary/50 bg-(--background)/50 transition-all gap-3"
                    >
                      <span className="material-symbols-outlined text-4xl text-(--text-muted) group-hover:text-primary group-hover:scale-110 transition-all">
                        edit_document
                      </span>
                      <div className="space-y-1">
                        <span className="font-bold text-(--text-main) block">
                          Enter Manually
                        </span>
                        <span className="text-xs text-(--text-muted) block">
                          Type out all candidate details yourself
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {popupMode === "upload" && (
                <div className="text-center space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-(--text-main)">
                      Upload Resume
                    </h2>
                    <p className="text-sm text-(--text-muted) font-medium">
                      Select a PDF or Word document to parse.
                    </p>
                  </div>
                  <div
                    onClick={() => cvFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all cursor-pointer gap-4 group"
                  >
                    <span className="material-symbols-outlined text-5xl text-primary/60 group-hover:text-primary transition-colors">
                      cloud_upload
                    </span>
                    <span className="font-bold text-(--text-main)">
                      Browse Files
                    </span>
                    <span className="text-xs text-(--text-muted)">
                      Supports PDF, DOCX, TXT
                    </span>
                    <input
                      type="file"
                      ref={cvFileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleCvFileChange}
                    />
                  </div>
                  <button
                    onClick={() => setPopupMode("selection")}
                    className="text-sm font-bold text-(--text-muted) hover:text-(--text-main) transition-colors"
                  >
                    Back to selection
                  </button>
                </div>
              )}

              {popupMode === "loading" && (
                <div className="text-center space-y-8 py-8">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-(--text-main)">
                      Extracting Data
                    </h2>
                    <p className="text-sm text-(--text-muted) font-medium animate-pulse">
                      Parsing resume and analyzing profile details...
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Map Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMapOpen && (
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onConfirm={handleMapConfirm}
            initialLat={formData.step1.latitude}
            initialLng={formData.step1.longitude}
          />
        )}
      </AnimatePresence>

      {/* ── Main Content Area (8/4 Grid) ─────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Form Panel (8 cols) ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            {/* Page Header */}
            <div className="mb-10 pb-4 border-b border-[var(--border-subtle)]">
              <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
                Basic Information
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Establish the candidate's core identity and contact parameters
                for the recruitment pipeline.
              </p>
            </div>

            <div className="space-y-12">
              {/* Identity Section */}
              <section className="space-y-6">
                <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative group">
                    <div
                      onClick={handleImageClick}
                      className="w-32 h-32 rounded-full border-4 border-(--border-subtle) bg-(--surface) overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-lg flex items-center justify-center relative"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-(--text-muted) opacity-60">
                          <span className="material-symbols-outlined text-4xl">
                            add_a_photo
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">
                          edit
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="absolute -bottom-2 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-4 border-(--background)">
                      <span className="material-symbols-outlined text-lg">
                        camera_alt
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mt-4">
                    Candidate Portrait
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.step1.firstName}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.firstName ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. John"
                    />
                    {errors.firstName && <FieldError msg={errors.firstName} />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.step1.lastName}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.lastName ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. Doe"
                    />
                    {errors.lastName && <FieldError msg={errors.lastName} />}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.step1.email}
                    onChange={handleChange}
                    className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.email ? "border-red-400/60 focus:border-red-400" : ""}`}
                    placeholder="e.g. john.doe@techneura.com"
                  />
                  {errors.email && <FieldError msg={errors.email} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.step1.phone || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.step1.whatsapp || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </section>

              {/* ── Location Section ──────────────────────────────────────── */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Location Context
                </h3>

                {/* Address field with map trigger */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                    Address
                  </label>
                  <div className="flex gap-3 items-stretch">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50 text-lg pointer-events-none">
                        location_on
                      </span>
                      <input
                        type="text"
                        name="address"
                        value={formData.step1.address || ""}
                        onChange={handleChange}
                        className="premium-input w-full rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                        placeholder="e.g. 123 Main Street, London"
                      />
                    </div>
                    {/* Open map button */}
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      title="Select on map"
                      className="shrink-0 flex items-center gap-2 px-5 rounded-2xl border border-(--border-subtle) text-(--text-muted) font-bold text-sm hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        map
                      </span>
                      <span className="hidden sm:inline text-xs font-bold">
                        Pick on Map
                      </span>
                    </button>
                  </div>

                  {/* Coordinates display — shown only when filled */}
                  {formData.step1.latitude && formData.step1.longitude && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 mt-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15"
                    >
                      <span className="material-symbols-outlined text-primary text-base shrink-0">
                        pin_drop
                      </span>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                          Lat:{" "}
                          <span className="text-primary font-mono text-xs">
                            {formData.step1.latitude}
                          </span>
                        </span>
                        <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                          Lng:{" "}
                          <span className="text-primary font-mono text-xs">
                            {formData.step1.longitude}
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="ml-auto text-[10px] font-bold text-primary hover:underline transition-all"
                      >
                        Change
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.step1.country}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.country ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. United Kingdom"
                    />
                    {errors.country && <FieldError msg={errors.country} />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.step1.city || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Timezone
                    </label>
                    <input
                      type="text"
                      name="timezone"
                      value={formData.step1.timezone || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. GMT+0"
                    />
                  </div>
                  <div className="pt-6">
                    <label className="flex items-center gap-4 p-5 rounded-2xl border border-(--border-subtle) bg-(--surface)/40 cursor-pointer hover:bg-primary/5 transition-all group">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.step1.willingToRelocate ? "bg-primary border-primary" : "border-(--border-subtle)"}`}
                      >
                        {formData.step1.willingToRelocate && (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        name="willingToRelocate"
                        checked={!!formData.step1.willingToRelocate}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-sm font-bold text-(--text-muted) group-hover:text-primary transition-colors">
                        Open to Relocation
                      </span>
                      <span className="material-symbols-outlined text-(--text-muted) opacity-40 ml-auto group-hover:text-primary group-hover:opacity-100 transition-colors">
                        travel_explore
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Profile & Source Section */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Profile & Origin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      LinkedIn URL
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
                        link
                      </span>
                      <input
                        type="url"
                        name="linkedInUrl"
                        value={formData.step1.linkedInUrl || ""}
                        onChange={handleChange}
                        className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Portfolio / Personal Web
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
                        public
                      </span>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={formData.step1.portfolioUrl || ""}
                        onChange={handleChange}
                        className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                        placeholder="portfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Custom Source Dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Candidate Source <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSourceOpen((o) => !o)}
                      className={`w-full premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) flex items-center justify-between hover:border-primary/50 transition-all ${errors.source ? "border-red-400/60" : ""}`}
                    >
                      <span className="capitalize">
                        {formData.step1.source?.replace("_", " ")}
                      </span>
                      <motion.span
                        animate={{ rotate: isSourceOpen ? 180 : 0 }}
                        className="material-symbols-outlined text-primary"
                      >
                        expand_more
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isSourceOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 4 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute w-full z-110 bg-(--surface) rounded-2xl border border-(--glass-border) shadow-2xl overflow-hidden p-1 max-h-64 overflow-y-auto"
                          >
                            {Object.values(CandidateSource).map((src) => (
                              <button
                                key={src}
                                type="button"
                                onClick={() => {
                                  updateStepData("step1", { source: src });
                                  setIsSourceOpen(false);
                                  setErrors(({ source, ...p }) => p);
                                }}
                                className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors rounded-xl capitalize ${formData.step1.source === src ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
                              >
                                {src.replace("_", " ")}
                              </button>
                            ))}
                          </motion.div>
                          <div
                            className="fixed inset-0 z-100"
                            onClick={() => setIsSourceOpen(false)}
                          />
                        </>
                      )}
                    </AnimatePresence>
                    {errors.source && <FieldError msg={errors.source} />}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Source Detail
                    </label>
                    <input
                      type="text"
                      name="sourceDetail"
                      value={formData.step1.sourceDetail || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. LinkedIn Recruiter Campaign"
                    />
                  </div>
                </div>
              </section>
            </div>
          </motion.div>

          {/* ── Sidebar (4 cols) ───────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-10 space-y-6"
          >
            {/* AI Assistant Card */}
            <div className="glass-panel rounded-4xl p-8 shadow-glow relative overflow-hidden border-primary/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      AI Extraction
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Active Analysis
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 rounded-2xl border-primary/10 border">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed text-center font-medium">
                    {formData.step1.email
                      ? `Candidate "${formData.step1.firstName}" is being indexed into the Talent Pool.`
                      : "Start typing to see real-time candidate profiling insights."}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Summary Card */}
            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Profile Preview
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Name"
                  value={
                    `${formData.step1.firstName || ""} ${formData.step1.lastName || ""}`.trim() ||
                    "—"
                  }
                />
                <SummaryRow label="Email" value={formData.step1.email || "—"} />
                <SummaryRow
                  label="Origin"
                  value={formData.step1.country || "—"}
                />
                <SummaryRow
                  label="Source"
                  value={formData.step1.source?.replace("_", " ") || "—"}
                />
                <SummaryRow
                  label="Relocating"
                  value={formData.step1.willingToRelocate ? "Yes" : "No"}
                />
                {/* Show location pin indicator when coords are available */}
                {formData.step1.latitude && formData.step1.longitude && (
                  <div className="pt-2 border-t border-(--border-subtle)">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                      <span className="material-symbols-outlined text-primary text-sm">
                        pin_drop
                      </span>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-(--text-muted)">
                          Location Pinned
                        </p>
                        <p className="text-[10px] font-bold text-primary font-mono mt-0.5">
                          {parseFloat(formData.step1.latitude!).toFixed(4)},{" "}
                          {parseFloat(formData.step1.longitude!).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* ── Sticky Footer ────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-(--border-subtle) bg-(--background)/80 backdrop-blur-md z-90 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            disabled
            className="flex items-center gap-2 text-(--text-muted) font-bold text-sm cursor-not-allowed group opacity-30"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push("/users/system/candidates/all_candidates")
              }
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-(--border-subtle) text-(--text-muted) font-bold text-sm hover:border-primary/30 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-base">close</span>
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:-translate-y-px transition-all shadow-premium"
            >
              Next: Current Role
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function BasicInfoStep() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <BasicInfoContent />
    </Suspense>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[11px] font-semibold text-red-500 ml-1 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-sm">error</span>
      {msg}
    </motion.p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
        {label}
      </span>
      <span className="text-xs font-bold text-(--text-main) text-right truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
