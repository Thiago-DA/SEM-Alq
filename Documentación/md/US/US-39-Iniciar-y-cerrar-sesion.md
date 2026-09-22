| **Iniciar y cerrar sesión** |
| - |
|Como usuario de la plataforma quiero poder iniciar y cerrar la sesión de mi cuenta para acceder a funcionalidad adicional.|
|**Criterios de aceptación:**|
|- Se debe ingresar una dirección de mail ya registrada en la plataforma. |
|- Se debe ingresar la contraseña asociada a la dirección de mail ingresada. |
|- Se debe vincular la sesión del usuario al navegador actual si la contraseña es correcta para la dirección de mail ingresada si elige "iniciar sesión". |
|- Se debe poder desvincular la sesión del usuario si elige "cerrar sesión".|
|- Se debe redirigir al usuario a la página en la que se encontraba antes de ingresar al portal de inicio de sesión. |
|- Se debe reemplazar visualmente los caracteres de la contraseña mientras se ingresa la misma. |
|**Pruebas de usuario:**|
|- Probar iniciar sesión ingresando una dirección de mail inexistente en la plataforma (falla). |
|- Probar iniciar sesión ingresando una contraseña diferente a la asociada al mail ingresado (falla). |
|- Probar iniciar sesión sin ingresar una contraseña (falla). |
|- Probar iniciar sesión sin ingresar una dirección de mail (falla). |
|- Probar iniciar sesión ingresando una dirección de mail existente en la plataforma y su contraseña asociada (pasa). |
|- Probar iniciar sesión y ser redirigido a la página anterior al inicio de sesión (pasa).|
|- Probar iniciar sesión y los caracteres de la contraseña son reemplazados por otros para el usuario (pasa).|
|- Probar cerrar sesión y la sesión del usuario se desvincula del navegador actual (pasa). |
