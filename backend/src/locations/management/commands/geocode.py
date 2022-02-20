import time
from django.core.management.base import BaseCommand, CommandError
from locations.models import Location
from locations.helpers import set_coordinates_from_address

class Command(BaseCommand):
    help = "Geocodes all locations"

    def handle(self, *args, **options):
        locations = Location.objects.filter(address__isnull=False)
        for location in locations:
            try:
                set_coordinates_from_address(location.address, location)
                self.stdout.write(self.style.SUCCESS(f"Geolocated {location} successfully"))
                time.sleep(0.5)
            except Exception as exc:
                raise CommandError(f"Failed to geolocate {location}: {exc}")

        self.stdout.write(self.style.SUCCESS("Great Success"))
