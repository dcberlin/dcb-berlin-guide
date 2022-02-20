from django.contrib.gis import admin

from .models import Location, Category
from .helpers import set_coordinates_from_address


@admin.register(Location)
class LocationAdmin(admin.OSMGeoAdmin):
    list_display = (
        "name",
        "category",
        "address",
        "published",
        "coordinates",
        "user_submitted",
    )

    default_lon = 1489458
    default_lat = 6894156
    default_zoom = 10

    def save_model(self, request, obj, form, change):
        """
        Try to geocode any provided address while saving the model.
        """
        if "address" in form.changed_data or not obj:
            new_address = form.data["address"]
            set_coordinates_from_address(new_address, obj)

        super().save_model(request, obj, form, change)


@admin.register(Category)
class CategoryAdmin(admin.OSMGeoAdmin):
    verbose_name = "Categories"
