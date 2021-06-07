import geocoder
import httpx
import logging

from django.contrib.gis import admin
from django.contrib.gis.geos import Point

from .models import Location, Category


logger = logging.getLogger(__name__)


@admin.register(Location)
class LocationAdmin(admin.OSMGeoAdmin):
    list_display = ("name", "category")

    default_lon = 1489458
    default_lat = 6894156
    default_zoom = 10

    @staticmethod
    def _get_coordinates(address):
        """
        Get the coordinates for an address by using the geocoder.
        """
        g = geocoder.osm(address)
        if not g.ok:
            logger.warning("Geocoder could not find result for '%s'", g.json)
            return None
        logger.info("Geocoding successful for: '%s'", address)
        lat, lng = g.latlng
        return lng, lat

    def save_model(self, request, obj, form, change):
        """
        Try to geocode any provided address while saving the model.
        """
        if "address" in form.changed_data or not obj:
            new_address = form.data["address"]
            coordinates = self._get_coordinates(new_address)
            if coordinates:
                obj.point = Point(*coordinates)
                obj.save()

        super().save_model(request, obj, form, change)


@admin.register(Category)
class CategoryAdmin(admin.OSMGeoAdmin):
    verbose_name = "Categories"
