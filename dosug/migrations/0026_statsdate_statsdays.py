# Generated by Django 4.2.6 on 2024-03-30 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dosug', '0025_alter_event_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='StatsDate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.IntegerField()),
                ('date', models.DateField()),
                ('views', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='StatsDays',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.IntegerField()),
                ('day', models.IntegerField()),
                ('views', models.IntegerField()),
            ],
        ),
    ]
