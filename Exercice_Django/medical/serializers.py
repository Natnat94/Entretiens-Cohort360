from os import defpath
from rest_framework import serializers
from .models import Patient, Medication, Prescription


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "last_name", "first_name", "birth_date"]


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ["id", "code", "label", "status"]


class CustomRelatedField(serializers.PrimaryKeyRelatedField):

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, instance):
        return str(instance)

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            # Ensure that field.choices returns something sensible
            # even when accessed with a read-only field.
            return {}

        if cutoff is not None:
            queryset = queryset[:cutoff]

        return {item.id: self.display_value(item) for item in queryset}


class PrescriptionSerializer(serializers.ModelSerializer):

    patient = CustomRelatedField(queryset=Patient.objects.all())
    medication = CustomRelatedField(queryset=Medication.objects.all())

    class Meta:
        model = Prescription
        fields = "__all__"

    def validate(self, attrs):
        ending_date = attrs.get("ending_date")
        starting_date = attrs.get("starting_date")
        if ending_date and ending_date <= starting_date:
            raise serializers.ValidationError(
                {"ending_date": "La date de fin doit être postérieure à la date de début"}
            )
        return super().validate(attrs)
