from django import forms
from .models import TodoItem

class TodoForm(forms.ModelForm):
    class Meta:
        model = TodoItem
        fields = ['title', 'description', 'category']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'タイトルを入力', 'class': 'form-control'}),
            'description': forms.Textarea(attrs={'placeholder': '説明を入力', 'class': 'form-control'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'title': 'タイトル',
            'description': '説明',
            'category': 'カテゴリ',
        }


    # タイトルのバリデーション
    def clean_title(self):
        title = self.cleaned_data.get('title', '').strip()

        # タイトルは必須
        if not title:
            raise forms.ValidationError('タイトルは必須です。')

        # タイトルの長さ制限
        if len(title) > 100:
            raise forms.ValidationError('タイトルは100文字以内で入力してください。')

        return title

    # 説明のバリデーション
    def clean_description(self):
        description = self.cleaned_data.get('description', '').strip()

        # 説明の長さ制限
        if len(description) > 500:
            raise forms.ValidationError('説明は500文字以内で入力してください。')

        return description
