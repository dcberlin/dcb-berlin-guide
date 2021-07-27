from django.contrib.gis.db import models as gis_models
from django.db import models


class Location(gis_models.Model):
    name = models.CharField(
        max_length=64,
    )
    address = models.CharField(null=False, blank=False, max_length=128)
    website = models.CharField(null=True, blank=True, max_length=128)
    email = models.CharField(null=True, blank=True, max_length=128)
    phone = models.CharField(null=True, blank=True, max_length=16)
    description = models.TextField(null=True, blank=True, max_length=500)
    point = gis_models.PointField(
        null=True,
        blank=True,
    )
    category = models.ForeignKey("Category", null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Category(models.Model):
    name_slug = models.SlugField(null=False, blank=False)
    label_singular = models.CharField(max_length=64, null=False, blank=False)
    label_plural = models.CharField(max_length=64, null=False, blank=False)

    def __str__(self):
        return self.name_slug

    class Meta:
        verbose_name_plural = "Categories"
