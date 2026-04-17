from django.urls import path
from .views import SendMessageView, ConversationView, InboxView

urlpatterns = [
    path('', SendMessageView.as_view(), name='send-message'),
    path('inbox/', InboxView.as_view(), name='inbox'),
    path('<int:user_id>/', ConversationView.as_view(), name='conversation'),
]
