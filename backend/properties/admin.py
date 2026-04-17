from django.contrib import admin
from .models import Property, PropertyImage, TenantUnit, LegalDocument, PropertyRules

admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(TenantUnit)
admin.site.register(LegalDocument)
admin.site.register(PropertyRules)
