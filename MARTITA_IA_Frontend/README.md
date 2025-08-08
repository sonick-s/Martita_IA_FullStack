# martita_ai

Frontend de la aplicacion Martita AI

## Instrucciones de instalacion 

```sh
npm install

npm run dev # para iniciar el servidor de desarrollo

npm run build # para compilar la aplicacion
```


```sh
npm run lint # para corregir errores de codigo
```
## Docker

```sh
docker build --no-cache -t martita-frontend-nginx . # para construir la imagen
docker run -d -p 8080:80 --name martita-frontend-nginx martita-frontend-nginx # para iniciar el contenedor

```
## ⚠️ Tareas urgentes

**¡IMPORTANTE!**  
Estas tareas deben completarse hasta el martes , jueves tenemos presentacion final

Login
- [X] Cambiar el icono de Vue por logo Martita
- [X] En registrar el logo y validar los campos de contraseña para que tenga al menos 8 caracteres

Reglas del Bot
- [X] 
Tramites
- [X] En crear Direccion validar el campo numero de telefono
- [X] Arreglar barra de navegacion
- [X] Dentro de las targetas colocar un boton para visualizar los tramites correspondientes a la direccion 
- [X] La opcion Borrar Direccion no debe eliminar la direccion si no actualizar el estado a -1 para que no lo muestre en la lista de direcciones 
- [X] Al crear un tramite los campos responsable , correo y telefono pueden enviarse null, (posible cambio en backend)
- [X] En crear un tramite el imput contexto de ia debe ser para texto , no un solo campo 
- [X] En el paso dos de crear un tramite los imputs deben ser para texto , no para un solo campo
- [X] La opcion Borrar tramite no debe eliminar el tramite si no actualizar el estado a -1 para que no lo muestre en la lista de direcciones 
- [X] los campos formularios no guardan datos

Usuarios
- [X] solo debe mostrar la informacion dle usuario Administrador, ya que la aplicaicon esta daptada solo para administrador por ahora 

- [X] Conectar las apis de flowise a la aplicacion mediante un boton de "Actualizar memoria"
- [X] Arreglar el campo fomulario de editar tramite.
- [X] Conectar el boton para la actualizacion de la base de datos vectorial.
- [ ] El desgraciado login/registrarse.
- [X] La vista de la tabla.