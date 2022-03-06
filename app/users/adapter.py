# from allauth.account.adapter import DefaultAccountAdapter


# class CustomAccountAdapter(DefaultAccountAdapter):

#     def save_user(self, request, user, form, commit=True):
#         user = super().save_user(request, user, form, commit)
#         data = form.cleaned_data
#         user.first_name = data.get('first_name')
#         user.last_name = data.get('last_name')
#         user.save()
#         return user
