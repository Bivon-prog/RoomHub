from django.db import models
from users.models import User


class Property(models.Model):
    PROPERTY_TYPE = [
        ('rental', 'Rental'),
        ('sale', 'For Sale'),
    ]
    LISTING_TYPE = [
        ('land', 'Land'),
        ('apartment', 'Apartment'),
        ('mansion', 'Mansion'),
        ('single_room', 'Single Room'),
        ('bedsitter', 'Bedsitter'),
        ('house', 'House'),
    ]
    OWNER_TYPE = [
        ('individual', 'Individual'),
        ('company', 'Company'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE)
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPE)
    owner_type = models.CharField(max_length=20, choices=OWNER_TYPE, default='individual')
    company_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    size = models.CharField(max_length=100, blank=True)  # e.g. "2 bedrooms", "50 sqm"
    price = models.DecimalField(max_digits=12, decimal_places=2)
    deposit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    amenities = models.JSONField(default=list)  # e.g. ["water", "electricity", "wifi"]
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')

    def __str__(self):
        return f"Image for {self.property.title}"


class LegalDocument(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='legal_docs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.property.title}"


class PropertyRules(models.Model):
    property = models.OneToOneField(Property, on_delete=models.CASCADE, related_name='rules')
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rules for {self.property.title}"


class TenantUnit(models.Model):
    """Links a tenant to a rental property/unit."""
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='units')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='tenants')
    move_in_date = models.DateField()
    move_out_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.tenant.username} @ {self.property.title}"
