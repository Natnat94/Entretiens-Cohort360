from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from medical.models import Patient, Medication, Prescription


class ApiListTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Patients
        Patient.objects.create(last_name="Martin", first_name="Jeanne", birth_date="1992-03-10")
        patient_one= Patient.objects.create(last_name="Durand", first_name="Jean", birth_date="1980-05-20")
        patient_two = Patient.objects.create(last_name="Bernard", first_name="Paul")

        # Medications
        med_one = Medication.objects.create(code="PARA500", label="Paracétamol 500mg", status=Medication.STATUS_ACTIF)
        med_two= Medication.objects.create(code="IBU200", label="Ibuprofène 200mg", status=Medication.STATUS_SUPPR)

        Prescription.objects.create(patient=patient_one, medication=med_one, starting_date='2026-01-01', ending_date="2026-03-01", status=Prescription.STATUS_ACTIF)
        Prescription.objects.create(patient=patient_two, medication=med_two, starting_date='2026-04-01', ending_date="2026-09-01", status=Prescription.STATUS_PENDING)


    def test_patient_list(self):
        url = reverse("patient-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 3)

    def test_patient_filter_nom(self):
        url = reverse("patient-list")
        r = self.client.get(url, {"nom": "mart"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all("mart" in p["last_name"].lower() for p in data))

    def test_patient_filter_date(self):
        url = reverse("patient-list")
        r = self.client.get(url, {"date_naissance": "1980-05-20"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all(p["birth_date"] == "1980-05-20" for p in data))

    def test_medication_list(self):
        url = reverse("medication-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 2)

    def test_medication_filter_status(self):
        url = reverse("medication-list")
        r = self.client.get(url, {"status": "actif"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all(m["status"] == "actif" for m in data))


    def test_prescription_list(self):
        url = reverse("prescription-list")
        r = self.client.get(url)
        self.assertEqual(r.status_code, 200)
        self.assertGreaterEqual(len(r.json()), 2)

    def test_prescription_filter_status(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"status": "pending"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(all(m["status"] == "pending" for m in data))

    def test_prescription_filter_starting_date_before_date(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"starting_date__lte": "2026-01-02"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)

    def test_prescription_filter_ending_date_after_date(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"ending_date__gte": "2026-04-02"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)

    def test_prescription_filter_search_patient(self):
        url = reverse("prescription-list")
        r = self.client.get(url, {"patient": "bernar"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.json()), 1)