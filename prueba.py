import os
import mimetypes

def listar_archivos_video(path):
    for root, dirs, files in os.walk(path):
        nivel = root.replace(path, '').count(os.sep)
        espacio = '-' * 4 * nivel
        print(f"{espacio}[{os.path.basename(root)}/]")

        for file in files:
            mimetype, _ = mimetypes.guess_type(file)
            if mimetype is not None and mimetype.startswith('video'):
                archivo_path = os.path.join(root, file)
                print(f"{espacio}    {file} ({archivo_path})")

# listar_archivos_video('T:\! 24-07-2023 (ALPHA)')
m = []

for i in range(10):
    row = []
    for e in range(10):
        row.append('0')
        
    m.append(row)


for row in m:
    for col in row:
        print(col, end='')
    print('')