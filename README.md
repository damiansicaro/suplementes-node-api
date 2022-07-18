# Suplementes API

Implementación de una API para el manejo de  productos y cuentas de usuarios.


## Configuración

Este servicio utiliza el archivo ```config.json``` como repositorio de parámetros de configuración. 

El programa ```syncmodels.js``` ejecuta un hard reset de la base de datos indicada de la aplicación.


## Información general
* El endpoint base es: **/v1/**
* Todos los endpoints devuelven un objeto JSON o un array de los mismos.
* Todos los campos referidos a fechas y horas se expresan en  **milliseconds**.
* Para métodos `GET`, los parámetros deben ser enviados como `query string`.
* Para métodos `POST`, `PUT`, and `DELETE`, los parámetros deben ser enviados como `request body` con content type
  `application/json`. 
* Los parámetros pueden ser enviados en cualquier orden.

## Códigos de retorno HTTP

* HTTP `2XX` : Ok
* HTTP `4XX` : Requests mal formados; el inconveniente esta del lado del cliente.
* HTTP `403` : Requests con credenciales invalidas.
* HTTP `5XX` : Errores internos; el inconveniente esta del lado del servidor.
  
### Mensajes de error
Cualquier endpoint puede devolver un ERROR con un mensaje que amplíe la información, por ejemplo:

```json
{
  "message": "Invalid authorization header."
}
```

# Endpoints

## Productos

### GET 

```
GET /v1/products
```
Devuelve un array con todos los productos almacenados.

```
GET /v1/products/:prodId
```
Devuelve un único producto cuyo ```id``` coincida con ```:prodId```.

```
GET /v1/products?title=string1&description=string2
```

Devuelve un array con los productos cuyo ```title``` contenga ```string1``` y/o ```description``` contenga ```string2``` según se indiquen los args.  ```title``` y/o ```description```.


----

## Account Info

### GET 
Devuelve la información de la cuenta que corresponde al token JWT de la session actual
```
GET /v1/accounts/account-info
```

**Response:**
```json
{
  "fullname": "User Name",
  "email": "address@email.com"
}
```

### PUT
 Actualiza la información de una cuenta de usuario basándose en un token JWT válido
```
PUT /v1/accounts/account-info
```
**Request Body:**
```json
{
  "fullname": "User Name",
  "email": "address@emal.com"
}
```
**Response:**
```
NONE
```

## Check token
Chequear la validez de un token JWT en el header
```
GET /v1/accounts/check-token
```
**Response:**
```json
{
  "serverTime": 1657676901,
  "iat": 1676430011,
  "exp": 1676516411
}
```

## Login
Procesar un pedido de login . (Describir validaciones y encriptacion)
```
POST /v1/accounts/login
```
**Request Body:**
```json
{
  "email": "address@emal.com",
  "password": "sha3(512)password"
}
```
**Response:**
```json
{
  "fullname": "User Name",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC..."
}
```

## Register
Registrar una cuenta. (Describir validaciones Y RESPUESTA)
```
POST /v1/accounts/register
```
**Request Body:**
```json
{
  "fullname": "User Name",
  "email": "address@emal.com",
  "password": "sha3(512)password"
}
```

## Status
 Estado del servidor
```
POST /v1/accounts/status
```
**Response:**
```json
{
  "serverTime": 1676029283
  "version": "1.0",
  "endPoint": "/v1/accounts",
}
```
