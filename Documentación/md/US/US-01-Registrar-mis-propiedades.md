| **Registrar mis propiedades** |
| - |
| Como locador, quiero registrar una propiedad, para incorporarla a la plataforma y poder gestionarla. |
| **Criterios de aceptación:** |
| - Se debe haber iniciado sesión. |
| - Se debe ingresar un título para la propiedad a publicar. |
| - Se debe indicar si la propiedad ya se encuentra alquilada o no. |
| - Se debe decidir si publicar la propiedad o no. |
| - Si la propiedad se encuentra alquilada, por defecto no se publicará. |
| - Si la propiedad no se encuentra alquilada, por defecto se publicará. |
| - Se debe indicar la provincia en la que se encuentra la propiedad. |
| - Se debe indicar la calle en la que se encuentra la propiedad. |
| - Se debe indicar a qué altura de la calle se encuentra la propiedad. |
| - Se debe indicar los metros cuadrados de la propiedad. |
| - Se debe indicar el tipo de propiedad (casa, departamento, monoambiente). |
| - Se debe indicar la cantidad de dormitorios de la propiedad si no es un monoambiente. |
| - Se debe indicar la cantidad de ambientes de la propiedad si no es un monoambiente. |
| - Se debe indicar la cantidad de baños de la propiedad. |
| - Se debe indicar qué servicios incluye la propiedad. |
| - Se debe asociar el contrato de alquiler de la propiedad. |
| - Se pueden indicar tags de la propiedad, que son características adicionales. |
| - Se debe cargar al menos una foto de la propiedad. |
| - Las fotos deberán estar en formato JPG y no superar los 350kb. |
| - Se pueden cargar hasta 50 fotos por propiedad. |
| - Se puede indicar la antigüedad de la propiedad. |
| - Se debe escoger la primer foto cargada como la imagen principal de la propiedad. |
| - Se puede cambiar la foto principal de la propiedad. |
| **Pruebas de usuario:** |
| - Probar registrar una propiedad sin contar con una sesión iniciada (falla). |
| - Probar registrar una propiedad y no haber adjuntado ninguna foto (falla). |
| - Probar registrar una propiedad sin haber ingresado un título (falla). |
| - Probar registrar una propiedad sin haber ingresado una calle (falla). |
| - Probar registrar una propiedad sin haber ingresado una altura de calle (falla). |
| - Probar registrar una propiedad sin haber ingresado los metros cuadrados (falla). |
| - Probar registrar una propiedad sin haber seleccionado el tipo de propiedad (falla). |
| - Probar registrar una propiedad que no es monoambiente sin haber ingresado la cantidad de dormitorios (falla). |
| - Probar registrar una propiedad que no es monoambiente sin haber ingresado la cantidad de ambientes (falla). |
| - Probar registrar una propiedad monoambiente con más de un ambiente (falla). |
| - Probar registrar una propiedad monoambiente con más de un dormitorio (falla). |
| - Probar registrar una propiedad sin haber seleccionado los servicios que incluye la misma (falla). |
| - Probar registrar una propiedad y cargar más de 50 fotos (falla). |
| - Probar registrar una propiedad y cargar una foto en un formato diferente a JPG (falla). |
| - Probar registrar una propiedad y cargar una foto con peso mayor a 350kb (falla). |
| - Probar registrar una propiedad sin haber ingresado la antigüedad de la propiedad (pasa). |
| - Probar registrar una propiedad sin haber indicado si se encuentra alquilada o no (falla).  |
| - Probar registrar una propiedad sin haber indicado la ciudad en la que se encuentra (falla). |
| - Probar registrar una propiedad en una provincia que no existe (falla). |
| - Probar registrar una propiedad con menos de 0 habitaciones (falla). |
| - Probar registrar una propiedad que no es monoambiente con menos de 1 habitación (falla). |
| - Probar registrar una propiedad que no es monoambiente con menos de 2 ambientes (falla). |
| - Probar registrar una propiedad con 0 o menos metros cuadrados (falla). |
| - Probar registrar una propiedad con 0 o menos baños (falla). |
| - Probar registrar una propiedad ya alquilada y que por defecto se seleccione la opción de no publicarla (pasa). |
| - Probar registrar una propiedad sin alquilar y que por defecto se seleccione la opción de publicarla (pasa). |
| - Probar registrar una propiedad sin haber seleccionado tags (pasa). |
| - Probar registrar una propiedad y seleccionar uno o más tags (pasa). |
| - Probar registrar una propiedad sin asociarle un contrato (falla). |

