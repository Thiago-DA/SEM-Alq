| **Registrar usuario** |
| - |
| Como usuario, quiero registrarme en la plataforma, para poder acceder a sus funcionalidades. |
| **Criterios de aceptación:** |
| - Se debe ingresar una dirección de mail en formato 'nombre@dominio'. |
| - Se debe ingresar un nombre y apellido. |
| - Los campos de nombre y apellido deben aceptar caracteres especiales, como lo son tildes y apóstrofes. |
| - Se debe ingresar una contraseña alfanumérica de al menos 8 caracteres con al menos una mayúscula y al menos una minúscula. |
| - Se debe confirmar la contraseña ingresada. |
| - Se debe ingresar la fecha de nacimiento del usuario. |
| **Pruebas de usuario:** |
| - Probar registrar un usuario sin ingresar una dirección de mail (falla). | 
| - Probar registrar un usuario sin ingresar un nombre (falla). | 
| - Probar registrar un usuario sin ingresar un apellido (falla). | 
| - Probar registrar un usuario con caracteres especiales en el nombre (pasa). | 
| - Probar registrar un usuario con caracteres especiales en el apellido (pasa). | 
| - Probar registrar un usuario con una contraseña no alfanumérica (falla). | 
| - Probar registrar un usuario con una contraseña sin mayúsculas (falla). | 
| - Probar registrar un usuario con una contraseña sin minúsculas (falla). | 
| - Probar registrar un usuario con una contraseña menor a 8 caracteres (falla). | 
| - Probar registrar un usuario con una dirección de correo en un formato inválido (falla). |
| - Probar registrar un usuario sin ingresar una fecha de nacimiento (falla). |
