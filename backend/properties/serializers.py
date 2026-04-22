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
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        min_length=5,
        max_length=10
    )

    class Meta:
        model = Property
        fields = [
            'id', 'owner', 'owner_name', 'title', 'property_type', 'listing_type',
            'owner_type', 'company_name', 'description', 'location',
            'latitude', 'longitude', 'size', 'price', 'deposit',
            'amenities', 'is_available', 'created_at', 'images', 'documents', 'rules', 'uploaded_images'
        ]
        read_only_fields = ['id', 'owner', 'created_at']

    def validate_uploaded_images(self, images):
        if len(images) < 5:
            raise serializers.ValidationError("At least 5 images are required for each property.")
        return images

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        validated_data['owner'] = self.context['request'].user
        property = super().create(validated_data)
        
        # Create PropertyImage instances for each uploaded image
        for image in uploaded_images:
            PropertyImage.objects.create(property=property, image=image)
        
        return property


class PropertyImageUploadSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        min_length=1,
        max_length=10
    )

    class Meta:
        model = PropertyImage
        fields = ['id', 'property', 'images']

    def create(self, validated_data):
        property_instance = validated_data['property']
        images = validated_data.pop('images', [])
        
        created_images = []
        for image in images:
            created_images.append(PropertyImage.objects.create(property=property_instance, image=image))
        
        return created_images


class TenantUnitSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = TenantUnit
        fields = ['id', 'tenant', 'tenant_name', 'property', 'property_title', 'move_in_date', 'move_out_date', 'is_active']
