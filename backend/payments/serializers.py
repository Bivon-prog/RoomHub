from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    property_title = serializers.CharField(source='unit.property.title', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'tenant', 'tenant_name', 'unit', 'property_title',
            'amount', 'status', 'transaction_ref', 'paid_at', 'created_at'
        ]
        read_only_fields = ['id', 'tenant', 'status', 'created_at']

    def create(self, validated_data):
        validated_data['tenant'] = self.context['request'].user
        return super().create(validated_data)
