import type { Medicament, Patient } from "@serviceApi/prescriptionApi";
import {
  createPrescription,
  fetchMedicaments,
  fetchPatients,
} from "@serviceApi/prescriptionApi";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";


interface CreatePrescriptionFormProps {
  onSuccess: () => void;
}

interface FormValues {
  patient: number;
  medication: number;
  starting_date: dayjs.Dayjs;
  ending_date: dayjs.Dayjs;
  comment?: string;
}

const CreatePrescriptionForm: React.FC<CreatePrescriptionFormProps> = ({
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, medicamentsData] = await Promise.all([
          fetchPatients(),
          fetchMedicaments(),
        ]);
        setPatients(patientsData);
        setMedicaments(medicamentsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    loadData();
  }, []);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const prescription = {
        patient: values.patient,
        medication: values.medication,
        starting_date: values.starting_date.format("YYYY-MM-DD"),
        ending_date: values.ending_date.format("YYYY-MM-DD"),
        comment: values.comment,
      };

      await createPrescription(prescription);
      message.success("Prescription créée avec succès !");
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création de la prescription :", error);

      if (
        error instanceof AxiosError &&
        "response" in error &&
        error.response &&
        error.response.data
      ) {
        const apiErrors = error.response.data;

        Object.keys(apiErrors).forEach((field) => {
          const errorMessage = apiErrors[field][0];
          form.setFields([
            {
              name: field,
              errors: [errorMessage],
            },
          ]);
        });
      } else {
        message.error("Erreur lors de la création de la prescription.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="patient"
        label="Patient"
        rules={[
          { required: true, message: "Veuillez sélectionner un patient" },
        ]}
      >
        <Select
          placeholder="Sélectionner un patient"
          options={patients.map((i) => ({
            value: i.id,
            label: `${i.first_name} ${i.last_name}`,
          }))}
          showSearch={{
            optionFilterProp: "label",
            filterSort: (optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase()),
          }}
        />
      </Form.Item>

      <Form.Item
        name="medication"
        label="Médicament"
        rules={[
          { required: true, message: "Veuillez sélectionner un médicament" },
        ]}
      >
        <Select
          placeholder="Sélectionner un médicament"
          options={medicaments.map((m) => ({
            value: m.id,
            label: `(${m.code}) ${m.label}`,
          }))}
          showSearch={{
            optionFilterProp: "label",
            filterSort: (optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase()),
          }}
        />
      </Form.Item>

      <Form.Item
        name="starting_date"
        label="Date de début"
        rules={[
          {
            required: true,
            message: "Veuillez sélectionner une date de début",
          },
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="ending_date"
        label="Date de fin"
        rules={[
          {
            required: true,
            message: "Veuillez sélectionner une date de fin",
          },
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="comment" label="Commentaire">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Créer la prescription
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePrescriptionForm;
