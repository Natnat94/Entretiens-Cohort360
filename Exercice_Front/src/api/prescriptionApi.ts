import axios from "axios";

const API_URL = "api";

export interface Prescription {
  id: number;
  patient: string; 
  medication: string; 
  starting_date: string;
  ending_date: string;
  status: string;
  comment?: string | null;
}

export interface Patient {
  id: number;
  last_name: string;
  first_name: string;
  birth_date: string;
}

export interface Medicament {
  id: number;
  code: string;
  label: string;
  status: string;
}

export interface Filters {
  patient?: string;
  starting_date__gte?: string;
  ending_date__lte?: string;
  starting_date__lte?: string;
  medication?: string
  ending_date__gte?: string
}

export interface CreatePrescriptionData {
  patient: number;
  medication: number;
  starting_date: string;
  ending_date?: string;
  comment?: string | null;
}

export const fetchPrescriptions = async (filters?: Filters): Promise<Prescription[]> => {
  const response = await axios.get(`${API_URL}/Prescription`, { params: filters });
  return response.data;
};

export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await axios.get(`${API_URL}/Patient`);
  return response.data;
};

export const fetchMedicaments = async (): Promise<Medicament[]> => {
  const response = await axios.get(`${API_URL}/Medication`);
  return response.data;
};

export const createPrescription = async (prescription: CreatePrescriptionData): Promise<Prescription> => {
  const response = await axios.post(`${API_URL}/Prescription`, prescription);
  return response.data;
};