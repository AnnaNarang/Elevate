# Generated by Django 5.0.7 on 2024-10-16 06:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workout_name', models.CharField(max_length=255)),
                ('workout_type', models.CharField(max_length=100)),
                ('program_duration', models.IntegerField()),
                ('days_per_week', models.IntegerField()),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='UserWorkouts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('exercises_done', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('workout_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workouts.workout')),
            ],
        ),
        migrations.CreateModel(
            name='UserWorkoutPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('workout_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workouts.workout')),
            ],
        ),
    ]
