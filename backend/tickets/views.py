from rest_framework import generics, permissions
from .models import Ticket
from .serializers import TicketSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Ticket.objects.filter(property__owner=user)
        return Ticket.objects.filter(submitted_by=user)


class TicketDetailView(generics.RetrieveAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Ticket.objects.filter(property__owner=user)
        return Ticket.objects.filter(submitted_by=user)


class UpdateTicketStatusView(generics.UpdateAPIView):
    """Landlord updates ticket status."""
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        return Ticket.objects.filter(property__owner=self.request.user)

    def perform_update(self, serializer):
        status = self.request.data.get('status')
        if status in ['open', 'in_progress', 'resolved']:
            serializer.save(status=status)
