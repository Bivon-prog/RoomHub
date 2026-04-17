from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView, VerifyPaymentView, PaymentReceiptView, FinancialSummaryView

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment-list'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('<int:pk>/verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('<int:pk>/receipt/', PaymentReceiptView.as_view(), name='payment-receipt'),
    path('summary/', FinancialSummaryView.as_view(), name='financial-summary'),
]
