# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Board(models.Model):
    board_id = models.AutoField(primary_key=True)
    emp = models.ForeignKey('Emp', models.DO_NOTHING, blank=True, null=True)
    board_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        
        db_table = 'board'


class Col(models.Model):
    col_id = models.IntegerField(primary_key=True)
    col_name = models.CharField(max_length=255, blank=True, null=True)
    size = models.IntegerField(blank=True, null=True)
    board = models.ForeignKey(Board, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        
        db_table = 'col'


class Comments(models.Model):
    comment_id = models.IntegerField(primary_key=True)
    comment_desc = models.CharField(max_length=255, blank=True, null=True)
    task = models.ForeignKey('Task', models.DO_NOTHING, blank=True, null=True)
    comment_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        
        db_table = 'comments'


class Emp(models.Model):
    emp_id = models.AutoField(primary_key=True)
    empname = models.CharField(max_length=255, blank=True, null=True, unique=True)
    pass_field = models.CharField(db_column='pass', max_length=255, blank=True, null=True)  # Field renamed because it was a Python reserved word.

    class Meta:
       
        db_table = 'emp'


class Task(models.Model):
    task_id = models.AutoField(primary_key=True)    
    task_name = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    task_type = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    reporter = models.ForeignKey(Emp, models.DO_NOTHING, db_column='reporter', blank=True, null=True, related_name='reported_tasks')
    assignee = models.ForeignKey(Emp, models.DO_NOTHING, db_column='assignee', blank=True, null=True, related_name='assigned_tasks')
    priority = models.IntegerField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    summary = models.CharField(max_length=255, blank=True, null=True)
    acceptance_criteria = models.CharField(max_length=255, blank=True, null=True)
    story_points = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=45, blank=True, null=True, db_index=True)

    class Meta:
        
        db_table = 'task'

