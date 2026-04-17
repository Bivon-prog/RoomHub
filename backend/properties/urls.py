from django.urls import path
from .views import (
    PropertyListCreateView, PropertyDetailView, MyPropertiesView,
    PropertyImageUploadView, TenantUnitListCreateView, TenantUnitDetailView,
    LegalDocumentView, PropertyRulesView
)

urlpatterns = [
    path('', PropertyListCreateView.as_view(), name='property-list'),
    path('<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),
    path('mine/', MyPropertiesView.as_view(), name='my-properties'),
    path('images/', PropertyImageUploadView.as_view(), name='property-image-upload'),
    path('documents/', LegalDocumentView.as_view(), name='legal-documents'),
    path('<int:property_id>/rules/', PropertyRulesView.as_view(), name='property-rules'),
    path('units/', TenantUnitListCreateView.as_view(), name='tenant-units'),
    path('units/<int:pk>/', TenantUnitDetailView.as_view(), name='tenant-unit-detail'),
]
