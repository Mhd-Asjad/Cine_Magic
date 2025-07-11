from django.db import models
from useracc.models import User
from django.utils import timezone


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

    def all_with_deleted(self):
        return super().get_queryset()

    def deleted_only(self):
        return super().get_queryset().filter(is_deleted=True)


class TheaterOwnerProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    owner_photo = models.ImageField(upload_to="owner_photos", null=True, blank=True)
    avatar_config = models.JSONField(null=True, blank=True)
    latitude = models.DecimalField(
        max_digits=22, decimal_places=15, blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=22, decimal_places=15, blank=True, null=True
    )
    theatre_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, null=True, blank=True)
    user_message = models.TextField(default=True)
    ownership_status = models.CharField(
        max_length=20,
        choices=(
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("rejected", "Rejected"),
            ("archived", "Archived"),
        ),
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def __str__(self):
        return f"{self.user.username} - {self.theatre_name}"

    def soft_delete(self, reason=None):
        """Soft delete the theatre profile"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        if reason:
            self.rejection_reason = reason
        self.save()

    def restore(self):
        """Restore a soft-deleted theatre profile"""
        self.is_deleted = False
        self.deleted_at = None
        self.ownership_status = "pending"
        self.rejected_at = None
        self.save()

    def reject(self, reason):
        """Reject and soft delete the theatre profile"""
        self.ownership_status = "rejected"
        self.rejected_at = timezone.now()
        self.is_deleted = True
        self.rejection_reason = reason
        self.soft_delete(reason)

    def archive(self, reason=None):
        """Archive and soft delete the theatre profile"""
        self.ownership_status = "archived"
        if reason:
            self.rejection_reason = f"Archived: {reason}"
        self.soft_delete(reason)

    def confirm(self):
        """Confirm the theatre ownership"""
        self.ownership_status = "confirmed"
        self.is_deleted = False
        self.deleted_at = None
        self.rejected_at = None
        self.save()

    @property
    def is_pending(self):
        return self.ownership_status == "pending"

    @property
    def is_confirmed(self):
        return self.ownership_status == "confirmed"

    @property
    def is_rejected(self):
        return self.ownership_status == "rejected"

    @property
    def is_archived(self):
        return self.ownership_status == "archived"
