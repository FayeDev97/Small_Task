from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime
from django.utils import timezone
from json import JSONEncoder, JSONDecoder
from .models import Task

@ensure_csrf_cookie
@require_http_methods(["GET","POST"])
def index(request):
    try:
        tasks = Task.objects.order_by('last_update')
    except(Task.DoesNotExist):
        tasks = []
    return render(request, 'index.html', {'tasks': tasks})

@require_http_methods(["POST"])
def post(request):
    # handling json request body from fetch api
    request_body = request.body.decode()
    if 'text' in request_body:
        task_text = request_body.strip('{}\"').split('\":\"')[1]
        task = Task.objects.create(text=task_text.capitalize(),
        create_date= datetime.date(timezone.now()),
        last_update= datetime.date(timezone.now()))  

        return HttpResponse(JSONEncoder().encode({'status': 'success','msg': 'Task created', 'task': task_to_dict(task)}))
    return HttpResponse(JSONEncoder().encode({'status': 'fail','msg': 'Task not created'}))

@require_http_methods(['GET'])
def get(request):
    try:
        tasks= list(Task.objects.all().values('id','text','create_date','last_update'))
        for task in tasks:
            task['last_update']= str(task['last_update'])
            task['create_date']= str(task['create_date'])
        return HttpResponse(JSONEncoder().encode(tasks))
    except(Task.DoesNotExist):
        Http404('There is no task at hand')

@require_http_methods(['GET'])
def get(request, task_id):
    try:
        # encode to json
        task =  Task.objects.filter(pk=task_id).values('id','text','create_date', 'last_update')
        task = list(task)
        task[0]['create_date'] = str(task[0]['create_date'])
        task[0]['last_update'] = str(task[0]['last_update'])
        return HttpResponse(JSONEncoder().encode(task))
        # return HttpResponse(task)
    except(Task.DoesNotExist):
        Http404("Task does not exist")

@require_http_methods("PUT")
def put(request, task_id):
    task_text = ''
    request_body = request.body.decode()
    task_text = request_body.strip('{}\"').split('\":\"')[2]
    # lazy logging
    # print('--------------------------')
    # print(task_text)
    # print(request_body)
    # print('--------------------------')
    try:
        Task.objects.filter(pk=task_id).update(text=task_text.capitalize(), last_update=timezone.datetime.date(timezone.now()))
        # task[0]['text'] = task_text
        # task[0]['last_update'] = timezone.datetime.date(timezone.now())
        # task.update(text=task_text, last_update=timezone.datetime.date(timezone.now()))

        return HttpResponse(request,{'status':'succes','msg': 'Task updated'})
    except(Task.DoesNotExist):
        Http404("Task does not exist")

@require_http_methods("DELETE")
def delete(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.delete()
        return HttpResponse(JSONEncoder().encode({'status': 'success','msg': 'Task removed'}))
    except(Task.DoesNotExist):
        Http404("This task doesn't exist.")

@require_http_methods("PUT")
def complete(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        if(task.completed):
            task.completed=False
        else:
            task.completed=True
        task.save()
        return HttpResponse(JSONEncoder.encode({'status':'success', 'msg':"task update"}))
    except(Task.DoesNotExist):
        return HttpResponse(JSONEncoder.encode({'status':'failed', 'msg':"task doesn't exist"}))
    
def task_to_dict(task):
    id = task.id
    text = task.text
    create_date = str(task.create_date)
    last_update = str(task.last_update)

    task_dict = {
        'id': id,
        'text': text,
        'create_date': create_date,
        'last_update': last_update
    }
    return task_dict