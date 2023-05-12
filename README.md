Chatbot de programación

## Descripción

Es un chatbot diseñado para ayudar a los estudiantes de programación a comprender conceptos de programación mediante el uso de lenguaje natural. También tiene una sección para mostrar errores de código, donde los estudiantes pueden pegar su código y obtener información sobre el problema y la solución.

## Imágenes

### Principal:
[![Captura-de-pantalla-156.png](https://i.postimg.cc/NMDRGFGq/Captura-de-pantalla-156.png)](https://postimg.cc/6278Y9GY)

### Encontrar errores en código
[![Captura-de-pantalla-158.png](https://i.postimg.cc/CKV8jkzp/Captura-de-pantalla-158.png)](https://postimg.cc/w103ztXw)

### Estadistica para profesores
[![Captura-de-pantalla-159.png](https://i.postimg.cc/ZqTRbcWn/Captura-de-pantalla-159.png)](https://postimg.cc/K1HFQtrh)

# Features
- Los endpoints están protegidos y es necesario un token para tener acceso a los endopoint de la aplicación.
- Las rutas del front también están protegidas, no se permite entrar al dashboard si el usuario no está logueado.
- Los tokens consumidos están limitados a cada usuario, este límite se renueva con un cron cada día.
- El cron también se encarga de extraer las palabras clave de los mensajes solo una vez al día para hacer más eficiente el uso de las APIs AWS.

# Tecnologías utilizadas
## Frontend 
- React
- Tailwind

## Backend 
- Node / Express
- MongoDB / Mongoose
- Bcrypt
- Auth / JWT

# Deployment & Apis
- AWS EC2
- AWS Comprehend API
- GPT-3.5-TURBO API
- Git para el control de versiones

## Instrucciones de uso
1. Clona el repositorio en tu máquina local.
2. Instala las dependencias con `npm install`.
3. Crea una cuenta en AWS, OpenAI y configura tus credenciales de acceso.
4. Configura la base de datos MongoDB.
5. Inicia el servidor
