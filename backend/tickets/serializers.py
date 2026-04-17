from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'submitted_by', 'submitted_by_name', 'property', 'property_title',
            'category', 'subject', 'description', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'submitted_by', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['submitted_by'] = self.context['request'].user
        return super().create(validated_data)
