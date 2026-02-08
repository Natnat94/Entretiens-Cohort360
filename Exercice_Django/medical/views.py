from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets

from .filters import MedicationFilter, PatientFilter, PrescriptionFilter
from .models import Medication, Patient, Prescription
from .serializers import (MedicationSerializer, PatientSerializer,
                          PrescriptionSerializer)


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des patients avec filtrage via query params."""

    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientFilter


class MedicationViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des médicaments avec filtrage via query params."""

    serializer_class = MedicationSerializer
    queryset = Medication.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = MedicationFilter


class PrescriptionViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """ Creation, modification et lecture des préscritions avec filtrage via query params. """
    serializer_class = PrescriptionSerializer
    queryset = Prescription.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionFilter

