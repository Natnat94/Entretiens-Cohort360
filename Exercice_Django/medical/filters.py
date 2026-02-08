import django_filters
from django.db.models import Q

from .models import Medication, Patient, Prescription


class PatientFilter(django_filters.FilterSet):
    nom = django_filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    prenom = django_filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    date_naissance = django_filters.DateFilter(field_name="birth_date")
    id = django_filters.CharFilter(method="filter_ids")

    def filter_ids(self, queryset, name, value):
        request = getattr(self, "request", None)
        values = []
        if request is not None:
            repeated = request.GET.getlist("id")
            for v in repeated:
                values.extend(v.split(","))
        if not values and value:
            values = value.split(",")
        ids = [int(v) for v in values if str(v).strip().isdigit()]
        return queryset.filter(id__in=ids) if ids else queryset

    class Meta:
        model = Patient
        fields = []


class MedicationFilter(django_filters.FilterSet):
    code = django_filters.CharFilter(field_name="code", lookup_expr="icontains")
    label = django_filters.CharFilter(field_name="label", lookup_expr="icontains")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = Medication
        fields = ["code", "label", "status"]


class PrescriptionFilter(django_filters.FilterSet):
    medication = django_filters.CharFilter(field_name="medication__label", lookup_expr="icontains")
    patient = django_filters.CharFilter(method="filter_patient")

    def filter_patient(self, queryset, name, value):
        return queryset.filter(Q(patient__last_name__icontains=value) | Q(patient__first_name__icontains=value))

    class Meta:
        model = Prescription
        fields = {
            "starting_date": ["exact", "lte", "gte"],
            "ending_date": ["exact", "lte", "gte"],
            "medication": ["exact"],
            "patient": ["exact"],
            "status": ["exact"],
        }
