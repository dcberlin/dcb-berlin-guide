from django.contrib.postgres.search import SearchQuery, SearchVector
from rest_framework import generics, viewsets
from rest_framework.throttling import AnonRateThrottle

from .models import Category, Location
from .serializers import (
    CategorySerializer,
    LocationProposalSerializer,
    LocationSerializer,
)


"""
ViewSets
"""


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(published=True, geographic_entity=True)
    serializer_class = LocationSerializer
    filterset_fields = ("category",)
    throttle_scope = "read-only"


    def get_queryset(self):
        """
        Optionally restricts the returned POIs by filtering against a `search`
        query parameter in the URL.
        """
        queryset = self.queryset
        if search_phrase := self.request.query_params.get("search"):
            return queryset.annotate(
                search=SearchVector(
                    "name",
                    "description",
                    "category__label_singular",
                    "category__label_plural",
                    config="romanian",
                )
            ).filter(search=str(search_phrase))
        return queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("label_plural")
    serializer_class = CategorySerializer
    throttle_scope = "read-only"


"""
Generic views
"""


class LocationProposalView(generics.CreateAPIView):
    serializer_class = LocationProposalSerializer
    throttle_scope = "location-proposal"
