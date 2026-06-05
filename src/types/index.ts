export type Medication = {
  id: string;
  drugName: string;
  dosage: string;
  schedule: string[];
  startDate: string;
  endDate?: string;
  remainingDoses?: number;
};

export type Reminder = {
  id: string;
  type: "medication" | "checkup" | "vaccine";
  title: string;
  scheduleAt: string;
};

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  isOpen: boolean;
  rating: number;
  hasStock: boolean;
};

export type DrugSearchResult = {
  id: string;
  name: string;
  inn: string;
  description: string;
  prescriptionRequired: boolean;
  uses: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
};
