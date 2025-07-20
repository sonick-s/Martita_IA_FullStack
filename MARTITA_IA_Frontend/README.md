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
- [ ] Cambiar el icono de Vue por logo Martita
- [ ] En registrar el logo y validar los campos de contraseña para que tenga al menos 8 caracteres

Reglas del Bot
- [ ] 
Tramites
- [ ] En crear Direccion validar el campo numero de telefono
- [ ] Arreglarbarra de navegacion
- [ ] Dentro de las targetas colocar un boton para visualizar los tramites correspondientes a la direccion 
- [ ] La opcion Borrar Direccion no debe eliminar la direccion si no actualizar el estado a -1 para que no lo muestre en la lista de direcciones 
- [ ] Al crear un tramite los campos responsable , correo y telefono pueden enviarse null, (posible cambio en backend)
- [ ] En crear un tramite el imput contexto de ia debe ser para texto , no un solo campo 
- [ ] En el paso dos de crear un tramite los imputs deben ser para texto , no para un solo campo
- [ ] La opcion Borrar tramite no debe eliminar el tramite si no actualizar el estado a -1 para que no lo muestre en la lista de direcciones 
- [ ] los campos formularios no guardan datos

Usuarios
- [ ] solo debe mostrar la informacion dle usuario Administrador, ya que la aplicaicon esta daptada solo para administrador por ahora 

