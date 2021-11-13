from rest_framework import viewsets

from .models import Category, Location
from .serializers import CategorySerializer, LocationSerializer


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(published=True, geographic_entity=True)
    serializer_class = LocationSerializer
    filterset_fields = ("category",)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("label_plural")
    serializer_class = CategorySerializer
