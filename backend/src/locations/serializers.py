from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Location, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("pk", "name_slug", "label_singular", "label_plural")


class LocationSerializer(GeoFeatureModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Location
        geo_field = "point"
        fields = [
            "pk",
            "name",
            "address",
            "website",
            "email",
            "description",
            "category",
        ]
