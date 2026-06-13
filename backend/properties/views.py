from rest_framework import generics, permissions, filters
from .models import Property, PropertyImage, TenantUnit, LegalDocument, PropertyRules
from .serializers import (
    PropertySerializer, PropertyImageUploadSerializer, TenantUnitSerializer,
    LegalDocumentSerializer, PropertyRulesSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'listing_type', 'amenities', 'size']
    ordering_fields = ['price', 'created_at']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Property.objects.select_related('owner', 'rules').prefetch_related('images', 'documents').filter(is_available=True)
        params = self.request.query_params
        if params.get('listing_type'):
            qs = qs.filter(listing_type=params['listing_type'])
        if params.get('property_type'):
            qs = qs.filter(property_type=params['property_type'])
        if params.get('min_price'):
            qs = qs.filter(price__gte=params['min_price'])
        if params.get('max_price'):
            qs = qs.filter(price__lte=params['max_price'])
        if params.get('location'):
            qs = qs.filter(location__icontains=params['location'])
        if params.get('size'):
            qs = qs.filter(size__icontains=params['size'])
        if params.get('amenities'):
            qs = qs.filter(amenities__contains=[params['amenities']])
        return qs


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsOwnerOrReadOnly]


class MyPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.select_related('owner', 'rules').prefetch_related('images', 'documents').filter(owner=self.request.user)


class PropertyImageUploadView(generics.CreateAPIView):
    serializer_class = PropertyImageUploadSerializer
    permission_classes = [permissions.IsAuthenticated]


class LegalDocumentView(generics.ListCreateAPIView):
    serializer_class = LegalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LegalDocument.objects.filter(property__owner=self.request.user)


class PropertyRulesView(generics.RetrieveUpdateAPIView):
    serializer_class = PropertyRulesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        prop_id = self.kwargs['property_id']
        obj, _ = PropertyRules.objects.get_or_create(property_id=prop_id)
        return obj


class TenantUnitListCreateView(generics.ListCreateAPIView):
    serializer_class = TenantUnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return TenantUnit.objects.select_related('tenant', 'property').filter(property__owner=user)
        return TenantUnit.objects.select_related('tenant', 'property').filter(tenant=user)


class TenantUnitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TenantUnit.objects.select_related('tenant', 'property').all()
    serializer_class = TenantUnitSerializer
    permission_classes = [permissions.IsAuthenticated]
