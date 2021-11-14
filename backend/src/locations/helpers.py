from django.contrib.gis.geos import Point
import logging
import time

import geocoder

logger = logging.getLogger(__name__)


def set_coordinates_from_address(address, obj):
    """
    Get the coordinates for an address by using the geocoder and set them
    on a location object.
    """
    g = geocoder.osm(address)
    if not g.ok:
        logger.warning("Geocoder could not find result for '%s'", g.json)
        return
    logger.info("Geocoding successful for: '%s'", address)
    lat, lng = g.latlng
    obj.point = Point(lng, lat)
    obj.save()
