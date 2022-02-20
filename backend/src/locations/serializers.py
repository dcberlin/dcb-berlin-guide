from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Location, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "pk",
            "name_slug",
            "label_singular",
            "label_plural",
        ]


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
            "phone",
            "geographic_entity",
            "inexact_location",
            "published",
        ]


class LocationProposalSerializer(GeoFeatureModelSerializer):
    """
    This serializer is used only when new location proposals are submitted.
    It covers a restricted set of fields. The rest of the fields have to be
    filled in by content reviewers.
    """

    user_submitted = serializers.HiddenField(default=True)

    class Meta:
        model = Location
        geo_field = "point"
        fields = [
            "name",
            "address",
            "website",
            "email",
            "description",
            "phone",
            "user_submitted",
        ]
        extra_kwargs = {
            field: {"required": True} for field in ["name", "address", "description"]
        }
