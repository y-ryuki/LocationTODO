from django.urls import path
from . import views

urlpatterns = [
    path("",views.todo_list,name ="todo_list"),
    path("create",views.todo_create,name ="todo_create"),
    path("complete/<int:todo_id>/",views.complete_todo,name='complete_todo'),
    path("uncomplete/<int:todo_id>/",views.uncomplete_todo,name='uncomplete_todo'),
    path("update/<int:todo_id>/ajax/",views.todo_update,name ="todo_update"),
    path("delete/<int:todo_id>/",views.todo_delete,name ="todo_delete"),
    path('check-location/', views.todo_location, name='check_location'),
]
