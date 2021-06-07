from rest_framework.routers import SimpleRouter

from .views import CategoryViewSet, LocationViewSet

router = SimpleRouter()
router.register(r"locations", LocationViewSet)
router.register(r"categories", CategoryViewSet)
urlpatterns = router.urls
