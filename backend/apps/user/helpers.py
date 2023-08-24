import os

def path_image_user_generate(instance, filename):
    folder_name = f'{instance.username}/'
    path = os.path.join(folder_name, filename)
    return path