from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.http import HttpResponse
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Payment.objects.select_related('tenant', 'unit__property').filter(unit__property__owner=user)
        return Payment.objects.select_related('tenant', 'unit__property').filter(tenant=user)


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Payment.objects.select_related('tenant', 'unit__property').filter(unit__property__owner=user)
        return Payment.objects.select_related('tenant', 'unit__property').filter(tenant=user)


class VerifyPaymentView(generics.UpdateAPIView):
    """Landlord verifies a payment."""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        return Payment.objects.select_related('tenant', 'unit__property').filter(unit__property__owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(status='verified', paid_at=timezone.now())


class PaymentReceiptView(APIView):
    """Returns a plain-text receipt for a verified payment."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk, tenant=request.user, status='verified')
        except Payment.DoesNotExist:
            return Response({'detail': 'Receipt not found or payment not verified.'}, status=404)

        receipt = (
            f"===== PAYMENT RECEIPT =====\n"
            f"Receipt No : {payment.transaction_ref}\n"
            f"Tenant     : {payment.tenant.get_full_name() or payment.tenant.username}\n"
            f"Property   : {payment.unit.property.title}\n"
            f"Amount     : KES {payment.amount}\n"
            f"Paid At    : {payment.paid_at.strftime('%d %b %Y, %H:%M')}\n"
            f"Status     : {payment.status.upper()}\n"
            f"==========================="
        )
        response = HttpResponse(receipt, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="receipt_{payment.transaction_ref}.txt"'
        return response


class FinancialSummaryView(APIView):
    """Landlord financial analysis."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'landlord':
            return Response({'detail': 'Only landlords can access this.'}, status=403)

        payments = Payment.objects.filter(unit__property__owner=request.user)

        summary = {
            'total_collected': payments.filter(status='verified').aggregate(total=Sum('amount'))['total'] or 0,
            'total_pending': payments.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0,
            'total_transactions': payments.count(),
            'verified_count': payments.filter(status='verified').count(),
            'pending_count': payments.filter(status='pending').count(),
            'per_property': list(
                payments.filter(status='verified')
                .values('unit__property__title')
                .annotate(total=Sum('amount'), count=Count('id'))
                .order_by('-total')
            )
        }
        return Response(summary)
