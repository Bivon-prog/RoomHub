from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer
from users.models import User


class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


class ConversationView(generics.ListAPIView):
    """Get all messages between the current user and another user."""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        other_id = self.kwargs['user_id']
        user = self.request.user
        qs = Message.objects.filter(
            Q(sender=user, receiver_id=other_id) |
            Q(sender_id=other_id, receiver=user)
        )
        # mark received messages as read
        qs.filter(receiver=user, is_read=False).update(is_read=True)
        return qs


class InboxView(APIView):
    """Returns list of unique conversations (latest message per contact)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        messages = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-created_at')

        seen = set()
        conversations = []
        for msg in messages:
            other = msg.receiver if msg.sender == user else msg.sender
            if other.id not in seen:
                seen.add(other.id)
                conversations.append({
                    'user_id': other.id,
                    'username': other.username,
                    'last_message': msg.content,
                    'created_at': msg.created_at,
                    'unread': Message.objects.filter(sender=other, receiver=user, is_read=False).count()
                })
        return Response(conversations)
