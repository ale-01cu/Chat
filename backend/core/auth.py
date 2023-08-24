from urllib.parse import parse_qsl
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
User = get_user_model()

@database_sync_to_async
def get_user_from_token(access_token_str: str) -> User:
    try:
        access_token_obj = AccessToken(access_token_str)
        user_id = access_token_obj['user_id']
        user = User.objects.get(id=user_id)
        return user
    
    except User.DoesNotExist:
        return AnonymousUser()
    
    except Exception as e:
        print("Error al verificar token", e)


class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        query_string = scope.get('query_string', b'').decode()
        query_params = dict(parse_qsl(query_string))
        token = query_params.get('token')
        scope['user'] = await get_user_from_token(token)

        return await self.app(scope, receive, send)