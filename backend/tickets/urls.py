from django.urls import path
from .views import TicketListCreateView, TicketDetailView, UpdateTicketStatusView

urlpatterns = [
    path('', TicketListCreateView.as_view(), name='ticket-list'),
    path('<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('<int:pk>/status/', UpdateTicketStatusView.as_view(), name='ticket-status'),
]
