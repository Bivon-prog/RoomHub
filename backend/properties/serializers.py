from rest_framework import serializers
from .models import Property, PropertyImage, TenantUnit, LegalDocument, PropertyRules


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class LegalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalDocument
        fields = ['id', 'property', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class PropertyRulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyRules
        fields = ['id', 'property', 'content', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    documents = LegalDocumentSerializer(many=True, read_only=True)
    rules = PropertyRulesSerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'owner', 'owner_name', 'title', 'property_type', 'listing_type',
            'owner_type', 'company_name', 'description', 'location',
            'latitude', 'longitude', 'size', 'price', 'deposit',
            'amenities', 'is_available', 'created_at', 'images', 'documents', 'rules'
        ]
        read_only_fields = ['id', 'owner', 'created_at']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class PropertyImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'property', 'image']


class TenantUnitSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = TenantUnit
        fields = ['id', 'tenant', 'tenant_name', 'property', 'property_title', 'move_in_date', 'move_out_date', 'is_active']
