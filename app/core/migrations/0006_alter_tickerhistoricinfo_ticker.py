# Generated by Django 4.0.2 on 2022-03-01 07:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_user_tickers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tickerhistoricinfo',
            name='ticker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticker_historic_info', to='core.ticker'),
        ),
    ]
