| **Registrar cobro** |
| - |
| Como locador, quiero registrar un cobro recibido por fuera de la plataforma (por ejemplo, transferencia o efectivo) para llevar el registro de los pagos del locatario. |
| **Criterios de aceptación:** |
| *Acceso* |
| - Se debe haber iniciado sesión con el usuario locador dueño de la propiedad. |
| - Se debe registrar desde Cobros (/panel/cobros), con el botón general "Registrar cobro", o desde el detalle de un período (/panel/cobros/[id]), con "Registrar un pago a mano". |
| - Solo se pueden registrar cobros de contratos vigentes. |
| - El locatario no puede registrar cobros. |
| *Períodos* |
| - Solo se pueden registrar cobros de períodos en estado "pendiente" o "vencido", incluidos los de meses anteriores. |
| - No se pueden registrar cobros de períodos futuros ni de períodos pagados. |
| *Formulario (modal sobre el listado)* |
| - Si se entra desde el detalle de un período, la propiedad, el locatario y el período vienen elegidos. Si se entra desde el botón general, hay que elegir la propiedad (solo las que tienen contrato vigente) y el período. |
| - Se debe indicar el monto cobrado, como número entero mayor a 0. Por defecto se precarga el saldo del período: el alquiler más los intereses por mora a la fecha del cobro (US-12), menos lo ya cobrado. |
| - El monto cobrado no puede superar el saldo del período. |
| - Se debe indicar la fecha del cobro, que no puede ser futura ni anterior a la fecha de inicio del contrato. Por defecto es la fecha actual. |
| - Se debe indicar el medio: transferencia, efectivo, cheque, MercadoPago (fuera de RentAR) u otro. Si es "otro", se debe indicar una nota de hasta 200 caracteres. |
| - Se puede adjuntar un comprobante del pago, en PDF, JPG o PNG, de hasta 8 MB. |
| - Los errores se deben mostrar en el campo correspondiente y en español. |
| *Al registrar* |
| - Cada cobro registrado emite su comprobante de pago (US-10). |
| - El medio se registra tal cual se cargó: un cobro registrado a mano nunca se muestra como pagado a través de RentAR. |
| - Se debe registrar quién cargó el cobro, con fecha y hora, en el historial del período y del contrato. |
| - Se debe mostrar un mensaje de éxito con acceso al comprobante. |
| **Pruebas de usuario:** |
| - Probar registrar un cobro sin haber iniciado sesión (falla). |
| - Probar registrar un cobro habiendo iniciado sesión como locatario (falla). |
| - Probar registrar un cobro de una propiedad de otro locador, accediendo por URL (falla). |
| - Probar registrar un cobro de un contrato pendiente de firma o finalizado (falla). |
| - Probar registrar un cobro desde el detalle de un período y verificar que la propiedad, el locatario y el período vengan elegidos (pasa). |
| - Probar registrar un cobro desde el botón general y verificar que solo se ofrezcan propiedades con contrato vigente (pasa). |
| - Probar registrar un cobro de un período futuro o ya pagado (falla). |
| - Probar verificar que el monto venga precargado con el saldo del período (pasa). |
| - Probar verificar que el saldo precargado de un período vencido incluya los intereses por mora (pasa). |
| - Probar registrar un monto igual a 0, negativo o con decimales (falla). |
| - Probar registrar un monto mayor al saldo del período (falla). |
| - Probar registrar el saldo completo y verificar que el período pase a "pagado" (pasa). |
| - Probar registrar un monto menor al saldo, verificar el aviso de pago parcial y que el período siga pendiente con el saldo restante (pasa). |
| - Probar registrar un segundo cobro por el saldo restante y verificar que el período pase a "pagado" (pasa). |
| - Probar registrar una fecha futura o anterior al inicio del contrato (falla). |
| - Probar elegir el medio "otro" sin nota (falla). |
| - Probar adjuntar un comprobante de más de 8 MB o en un formato no admitido (falla). |
| - Probar registrar un cobro sin adjuntar comprobante (pasa). |
| - Probar registrar un cobro en efectivo y verificar que el medio figure como "Efectivo" en el detalle y en el comprobante (pasa). |
| - Probar verificar que el cobro figure en el historial con quién lo cargó, la fecha y la hora (pasa). |
| - Probar anular un cobro con motivo y confirmar, y verificar que quede tachado y que el período vuelva a pendiente o vencido (pasa). |
| - Probar anular un cobro sin motivo (falla). |
| - Probar anular un cobro y cancelar la confirmación (pasa: el cobro se mantiene). |
| - Probar modificar o eliminar un cobro registrado (falla). |
