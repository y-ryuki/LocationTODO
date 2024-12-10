from django.shortcuts import render , redirect,get_object_or_404
from django.views import View
from .models import TodoItem
from .forms import TodoForm
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import math

class TodoListView(View):
    def get(self, request):
        todos = TodoItem.objects.values('id','title', 'description', 'latitude', 'longitude', 'category')
        return render(request, 'todo/todo_list.html',
                {
                    'todos_json': json.dumps(list(todos)),
                    'todo_lists':todos
                })

    
class TodoCreateView(View):
    def get(self, request):
        form = TodoForm()
        return render(request, "todo/todo_create.html", {"form": form})

    def post(self, request):
        form = TodoForm(request.POST)
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')

        if not latitude or not longitude:
            return render(request, 'todo/todo_create.html', {
                'form': form,
                'error': '地図をクリックして位置を設定してください。'
            })

        if form.is_valid():
            TodoItem.objects.create(
                title=form.cleaned_data['title'],
                description=form.cleaned_data['description'],
                latitude=latitude,
                longitude=longitude,
                category = form.cleaned_data['category'],
            )
            return redirect('todo_list')
        return render(request, 'todo/todo_create.html', {'form': form})


class TodoCompleteView(View):
    def post(self, request,todo_id):
        todo = get_object_or_404(TodoItem, id=todo_id)
        todo.completed = True
        todo.save()
        return JsonResponse({'success': True, 'message': 'TODOが完了しました！'})
    
class TodoUnCompleteView(View):
    def post(self, request,todo_id):
        todo = get_object_or_404(TodoItem, id=todo_id)
        todo.completed = False
        todo.save()
        return JsonResponse({'success': True, 'message': 'TODOを未完了に戻しました！'})

class TodoUpdateView(View):

    def post(self, request, todo_id):
        try:
            data = json.loads(request.body)  # リクエストのJSONデータを読み取る
            todo = get_object_or_404(TodoItem, id=todo_id)

            # データのバリデーション
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()

            if not title:
                return JsonResponse({'success': False, 'message': 'タイトルは必須です'}, status=400)
            if len(title) > 100:
                return JsonResponse({'success': False, 'message': 'タイトルは100文字以内で入力してください'}, status=400)
            if len(description) > 500:
                return JsonResponse({'success': False, 'message': '説明は500文字以内で入力してください'}, status=400)


            if title and description:
                todo.title = title
                todo.description = description
                todo.save()
                return JsonResponse({'success': True, 'message': 'TODOが更新されました'})
            else:
                return JsonResponse({'success': False, 'message': 'データが不足しています'}, status=400)

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)


class TodoDeleteView(View):
    @csrf_exempt
    def post(self,request,todo_id):
        if request.method == "POST":
            todo = get_object_or_404(TodoItem, id=todo_id)
            todo.delete()
            return JsonResponse({'success': True, 'message': 'TODOが削除されました！'})
        return JsonResponse({'success': False, 'message': '無効なリクエストです。'})
    

def haversine(lat1, lon1, lat2, lon2):
        # 地球の半径（メートル）
        R = 6371000
        # ラジアンに変換
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        # Haversineの公式
        a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

class CheckLocationView(View):

    def post(self, request):
        try:
            # リクエストから緯度・経度を取得
            data = json.loads(request.body)
            user_lat = data.get('latitude')
            user_lon = data.get('longitude')

            if not user_lat or not user_lon:
                return JsonResponse({'success': False, 'message': '緯度と経度が必要です'}, status=400)

            # 半径内のTODOを判定
            todos_in_range = []
            for todo in TodoItem.objects.filter(completed=False):
                distance = haversine(user_lat, user_lon, todo.latitude, todo.longitude)
                if distance <= todo.radius:
                    todos_in_range.append({
                        'id': todo.id,
                        'title': todo.title,
                        'description': todo.description,
                        'distance': distance,
                    })
                    print(f"距離: {distance}m, タイトル: {todo.title}, 半径: {todo.radius}")

            return JsonResponse({'success': True, 'todos_in_range': todos_in_range})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)


todo_list = TodoListView.as_view()
todo_create = TodoCreateView.as_view()
complete_todo = TodoCompleteView.as_view()
uncomplete_todo = TodoUnCompleteView.as_view()
todo_update = TodoUpdateView.as_view()
todo_delete = TodoDeleteView.as_view()
todo_location = CheckLocationView.as_view()


