**UNIVERSIDAD TECNOLÓGICA NACIONAL**

**FACULTAD REGIONAL CÓRDOBA**

*Ingeniería en Sistemas de Información*

**Materia:** Seminario Integrador

**ESTUDIO INICIAL**

Nombre del sistema:

**RentAR --- Plataforma web de Gestión de Alquileres de Inmuebles**

**Curso:** Comisión 4K2

**Alumnos:** Nico (Legajo 87508)

**Docentes:** \[Completar\]

**Año de cursado:** 2026

Córdoba, Argentina

# Historial de versiones

  ----------------------------------------------------------------------------------------------
  **Versión**   **Fecha**    **Autor**       **Descripción de cambios**
  ------------- ------------ --------------- ---------------------------------------------------
  1.0           18/08/2026   Nico            Versión inicial del Estudio Inicial del proyecto.

  ----------------------------------------------------------------------------------------------

# Índice

**1. Introducción General del Proyecto 4**

**2. Introducción al Informe Inicial 4**

**3. Ámbito de Aplicación 4**

> 3.1. Contextualización del proyecto 4
>
> 3.2. Sistemas similares existentes 5

**4. Procesos de Negocio 6**

> 4.1. Mapa de procesos 6
>
> 4.2. Descripción de procesos 6

**5. Impulsos 7**

> 5.1. Necesidades 7
>
> 5.2. Problemas 8
>
> 5.3. Oportunidades 8

**6. Propuesta del Sistema de Información 8**

> 6.1. Objetivo del sistema de información 8
>
> 6.2. Alcance (requerimientos funcionales detallados) 9

**7. Estudio de Prefactibilidad 10**

> 7.1. Prefactibilidad técnica 10
>
> 7.2. Prefactibilidad económica 11
>
> 7.3. Prefactibilidad operativa 11

**8. Metodología a Utilizar 11**

**9. Roadmap del Proyecto 11**

**10. Glosario de Términos 12**

# 1. Introducción General del Proyecto

El presente proyecto surge en el marco del Seminario Integrador de la carrera de Ingeniería en Sistemas de Información de la Universidad Tecnológica Nacional, Facultad Regional Córdoba. Su desarrollo responde a un cambio concreto en el mercado de locación de inmuebles en Argentina: desde la derogación de la Ley 27.551 por el DNU 70/2023, el índice y la frecuencia de ajuste del alquiler dejaron de estar regulados por una norma única y pasaron a negociarse libremente entre las partes. Esto trasladó a propietarios e inquilinos una carga operativa ---de cálculo, de seguimiento y de cobro--- que hoy se resuelve mayormente de forma manual e informal.

El proyecto propone el desarrollo de una plataforma web que integre, en un mismo sistema, la publicación y búsqueda de propiedades, el cálculo automático de los ajustes periódicos, la firma electrónica del contrato, el cobro y seguimiento de pagos, el cálculo de mora y el cierre administrativo del contrato de alquiler.

El proyecto se desarrolla en etapas sucesivas: un Estudio Inicial (el presente informe), que releva el contexto, diagnostica la situación actual y evalúa la factibilidad de la propuesta; una etapa de relevamiento y análisis de requerimientos en mayor detalle; una etapa de diseño de la arquitectura, la base de datos y la experiencia de usuario; una etapa de desarrollo iterativo del sistema; y finalmente una etapa de pruebas, documentación y defensa del proyecto ante la cátedra.

# 2. Introducción al Informe Inicial

Este informe constituye el Estudio Inicial del proyecto y tiene como propósito relevar el ámbito de aplicación del sistema, analizar los procesos de negocio involucrados, diagnosticar las necesidades, problemas y oportunidades que motivan el desarrollo, definir el objetivo y el alcance de la propuesta, y evaluar su factibilidad técnica, económica y operativa. Sirve como base documental para las etapas posteriores de análisis y diseño del sistema.

El informe se organiza en las siguientes secciones: Ámbito de Aplicación (contextualización del proyecto y sistemas similares existentes), Procesos de Negocio (mapa y descripción de procesos), Impulsos (necesidades, problemas y oportunidades), Propuesta del Sistema de Información (objetivo y alcance), Estudio de Prefactibilidad, Metodología a Utilizar, Roadmap del Proyecto y Glosario de Términos.

# 3. Ámbito de Aplicación

## 3.1. Contextualización del proyecto

El sistema está dirigido al mercado de locación de inmuebles urbanos de uso habitacional sin amoblar, dejando fuera de su ámbito el alquiler temporario o amoblado, que responde a otra lógica de servicios y exigencias.

Dentro de ese mercado se identifican dos perfiles de usuarios potencialmente afectados por el sistema:

-   Propietarios particulares, que alquilan de forma directa y resuelven todo el proceso ---publicación, comunicación, cálculo de ajustes y cobro--- de manera informal.

-   Inquilinos, que buscan propiedades dispersas en múltiples portales y canales, sin un criterio unificado de comparación.

Como piloto se propone acotar geográficamente el sistema a la ciudad de Córdoba, con posibilidad de expandirlo a otras localidades en etapas posteriores. La justificación del proyecto se apoya en el cambio normativo señalado en la introducción ---que dejó el cálculo de ajustes librado al acuerdo entre partes--- y en la ausencia, relevada en el punto siguiente, de una solución digital que integre de punta a punta la publicación, el cálculo de ajuste y el cobro del alquiler.

## 3.2. Sistemas similares existentes

Se relevaron cuatro tipos de soluciones digitales relacionadas con el problema abordado, ninguna de las cuales cubre de forma integral las funcionalidades propuestas:

***ARquiler (arquiler.com)***

Calculadora online orientada exclusivamente a estimar el nuevo valor del alquiler según la ley vigente y el índice elegido, a partir del valor inicial, la fecha de inicio del contrato y la periodicidad de ajuste. No ofrece publicación de propiedades, búsqueda, cobro ni gestión de contratos.

***Argenprop / ZonaProp (con Argenprop Gestión)***

Portales de búsqueda y publicación de inmuebles con gran volumen de avisos y filtros de búsqueda avanzados. Argenprop incorporó además un CRM gratuito para inmobiliarias (Argenprop Gestión) que permite administrar publicaciones y gestionar garantías online, pero no incluye cálculo automático de ajuste del alquiler ni cobro dentro de la plataforma.

***TusAlquileres.com.ar***

Software de administración de alquileres orientado a inmobiliarias, con funciones de cálculo automático de punitorios por mora, emisión de recibos y liquidaciones, y facturación. Es la solución más cercana en funcionalidad administrativa a la propuesta de este proyecto, aunque está pensada como herramienta interna de gestión para inmobiliarias y no incluye un portal público de búsqueda ni un flujo de postulación para inquilinos.

***Roomix***

Buscador agregador de avisos de distintos portales (ZonaProp, Argenprop, MercadoLibre, entre otros) con asistencia por inteligencia artificial y herramientas de cálculo de índices. Funciona como metabuscador para el inquilino, pero no gestiona la relación contractual, el cobro ni la administración del alquiler.

En conjunto, el relevamiento confirma que las soluciones existentes cubren de forma parcial el proceso: unas resuelven la búsqueda, otras el cálculo del ajuste y otras la administración interna de una inmobiliaria, pero ninguna integra en una misma plataforma la publicación, la búsqueda, la firma del contrato, el cálculo de ajuste, el cobro y el cierre del contrato. Ese es el espacio que ocupa la propuesta de este proyecto.

# 4. Procesos de Negocio

## 4.1. Mapa de procesos

El siguiente mapa representa, a nivel macro, la secuencia de procesos de negocio que la plataforma debe soportar a lo largo del ciclo de vida de un contrato de alquiler, desde la publicación de la propiedad hasta el cierre del contrato.

  -----------------------------------------------------------------------------------------------------------------------------
  **Publicación\      **→**   **Búsqueda y\   **→**   **Firma electrónica\   **→**   **Cobro, ajuste\   **→**   **Cierre del\
  de la propiedad**           postulación**           del contrato**                 y mora**                   contrato**
  ------------------- ------- --------------- ------- ---------------------- ------- ------------------ ------- ---------------

  -----------------------------------------------------------------------------------------------------------------------------

*Figura 1. Mapa de procesos macro de la plataforma.*

## 4.2. Descripción de procesos

### Proceso 1: Publicación de la propiedad

El propietario particular o la inmobiliaria carga los datos de la propiedad (fotos, descripción, ubicación, precio y características) en la plataforma. El sistema valida los datos obligatorios y publica el aviso con estado \"disponible\". El publicador puede editar o dar de baja la publicación en cualquier momento, y el estado se actualiza automáticamente a \"alquilada\" una vez firmado el contrato correspondiente.

### Proceso 2: Búsqueda y postulación

El inquilino busca propiedades utilizando filtros por zona, precio, tipo de inmueble y ambientes. Al encontrar una propiedad de interés, contacta al publicador a través del canal interno de la plataforma o por un medio externo con los datos cargados por el mismo para coordinar una visita. Si decide avanzar, se postula formalmente, y el publicador confirma o rechaza la postulación.

### Proceso 3: Firma electrónica del contrato

Una vez aceptada la postulación, la plataforma genera el contrato con los datos acordados (partes, canon locativo inicial, índice y periodicidad de ajuste, plazo). Locador, locatario y garantes revisan el documento y dejan constancia de su conformidad mediante firma electrónica dentro de la plataforma, quedando el contrato activo.

### Proceso 4: Cobro, ajuste y seguimiento de mora

Mensualmente, el sistema calcula el monto a pagar ---aplicando el ajuste correspondiente cuando corresponde según el índice y la periodicidad pactada--- y notifica al inquilino el vencimiento. El pago se registra a través de la pasarela integrada y genera automáticamente un recibo, o en caso de que el pago sea realizado por un medio informal, el propietario tendrá que confirmar el pago manualmente para que luego se genere el recibo. Si el pago se realiza fuera del plazo pactado, el sistema calcula los intereses por mora correspondientes.

### Proceso 5: Cierre del contrato

Al finalizar el plazo del contrato o por decisión anticipada de las partes, se inicia el proceso de cierre: se registra el estado de entrega del inmueble mediante un checklist, se dejan asentados eventuales saldos pendientes y se genera una constancia final que certifica que el contrato fue cerrado y el inmueble entregado, actualizando el estado de la propiedad a \"disponible\" nuevamente.

# 5. Impulsos

## 5.1. Necesidades

Las necesidades que dan origen al proyecto surgen de un cambio de contexto concreto: al liberarse la elección del índice y la periodicidad de ajuste del alquiler, cada propietario e inquilino debe resolver por su cuenta un cálculo que antes definía la ley. A eso se suma que, actualmente las herramientas disponibles están centradas en inmobiliarias y no a propietarios particulares, además la información de la oferta de alquileres está dispersa entre portales, redes sociales y canales informales, y que el cobro, la firma del contrato y su cierre se gestionan hoy sin ningún soporte digital integrado. De estas necesidades surge el siguiente listado de requerimientos globales.

**Requerimientos funcionales (globales)**

  -------------------------------------------------------------------------
  **ID**     **Requerimiento funcional global**
  ---------- --------------------------------------------------------------
  RFG-01     Publicación y gestión de propiedades en alquiler.

  RFG-02     Búsqueda y filtrado de propiedades para inquilinos.

  RFG-03     Cálculo automático de ajustes periódicos del canon locativo.

  RFG-04     Cobro y administración de pagos del alquiler.

  RFG-05     Firma electrónica de contratos.

  RFG-06     Cálculo automático de mora.

  RFG-07     Cierre administrativo del contrato.
  -------------------------------------------------------------------------

**Requerimientos no funcionales**

  -------------------------------------------------------------------------------------------------------------------------------------------------
  **ID**     **Requerimiento no funcional**
  ---------- --------------------------------------------------------------------------------------------------------------------------------------
  RNF-01     Usabilidad: interfaz simple y adaptable a usuarios sin conocimientos técnicos avanzados (diseño responsive).

  RNF-02     Seguridad: cifrado de datos sensibles y cumplimiento de la Ley 25.326 de Protección de Datos Personales.

  RNF-03     Disponibilidad: la plataforma debe estar operativa al menos el 99% del tiempo mensual.

  RNF-04     Rendimiento: tiempos de respuesta de búsqueda inferiores a 2 segundos para el 90% de las consultas.

  RNF-05     Escalabilidad: arquitectura capaz de soportar el crecimiento de propiedades y usuarios sin rediseño mayor.

  RNF-06     Compatibilidad: acceso desde navegadores web modernos en dispositivos de escritorio y móviles.

  RNF-07     Mantenibilidad: código documentado y modular que facilite futuras extensiones.

  RNF-08     APIs: integración con las APIs de una pasarela de pago, firma electrónica y de consulta de los índices de actualización de contrato.
  -------------------------------------------------------------------------------------------------------------------------------------------------

## 5.2. Problemas

***Del lado de propietarios:***

-   Cálculo manual y propenso a errores del nuevo valor de alquiler en cada período de ajuste, con riesgo de aplicar un índice, una fecha o un porcentaje incorrecto.

-   Falta de un sistema centralizado que avise cuándo corresponde el próximo ajuste y lo calcule automáticamente.

-   Seguimiento de cobros disperso entre transferencias, efectivo y distintas cuentas, sin trazabilidad clara de pagos e impagos.

-   Ausencia de un historial digital del inquilino (pagos, cumplimiento) reutilizable para decisiones futuras.

***Del lado de inquilinos y buscadores:***

-   Falta de transparencia sobre cómo y cuándo aumentará el alquiler durante la vigencia del contrato, lo que dificulta planificar el presupuesto familiar.

-   Medios de pago informales, sin comprobante centralizado ni recordatorios de vencimiento.

-   Seguimiento consistente de la evolución del contrato.

-   Dificultad para entender o encontrar información dentro del contrato.

## 5.3. Oportunidades

-   Alta adopción de medios de pago digitales y billeteras virtuales en Argentina, lo que permite integrar el cobro dentro de la misma plataforma mediante pasarelas ya existentes.

-   El vacío regulatorio en torno a un índice único impulsó la aparición de calculadoras y herramientas puntuales de ajuste, pero el relevamiento de sistemas similares confirmó que ninguna integra de punta a punta publicación, búsqueda, firma, cobro y cierre dentro de una misma plataforma.

-   Los organismos oficiales (INDEC, BCRA) publican periódicamente los valores de los índices utilizados, lo que habilita una integración de datos automatizada y confiable.

-   Los propietarios particulares no cuentan hoy con ninguna herramienta pensada específicamente para ellos, a diferencia de las inmobiliarias, que sí acceden a software de gestión genérico.

-   Implementación de un Agente de IA que permita consultar información y resolver dudas respecto al contrato en un lenguaje natural y entendible.

# 6. Propuesta del Sistema de Información

## 6.1. Objetivo del sistema de información

Desarrollar una plataforma web de gestión de alquileres que permita propietarios particulares publicar propiedades, y a inquilinos buscarlas y filtrarlas, integrando además la firma electrónica del contrato, el cálculo automático de ajustes periódicos del canon locativo, el cobro del alquiler, el cálculo de mora y el cierre administrativo del contrato dentro de la misma plataforma.

## 6.2. Alcance (requerimientos funcionales detallados)

**Módulo de Publicaciones**

  -------------------------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- --------------------------------------------------------------------------------------------------
  RF-01      Alta, edición y baja de propiedades con fotos, descripción, ubicación, precio y características.

  RF-02      Gestión del estado de la propiedad (disponible / reservada / alquilada).
  -------------------------------------------------------------------------------------------------------------

**Módulo de Búsqueda**

  -----------------------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- ------------------------------------------------------------------------------------------------
  RF-03      Búsqueda y filtrado de propiedades por zona, precio, tipo de inmueble y cantidad de ambientes.

  RF-04      Visualización del detalle de cada propiedad publicada.
  -----------------------------------------------------------------------------------------------------------

**Módulo de Ajuste de Alquiler**

  ------------------------------------------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- -------------------------------------------------------------------------------------------------------------------
  RF-05      Configuración del índice de ajuste (IPC / ICL / etc.) por contrato.

  RF-06      Configuración de la periodicidad de ajuste (mensual, trimestral, etc.).

  RF-07      Cálculo automático del nuevo valor del alquiler según índice y periodicidad, actualizado desde fuentes oficiales.
  ------------------------------------------------------------------------------------------------------------------------------

**Módulo de Cobro y Pagos**

  -------------------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- --------------------------------------------------------------------------------------------
  RF-08      Registro de pagos mediante integración con una pasarela de pago.

  RF-09      Historial de pagos y ajustes por contrato, visible para propietario e inquilino.

  RF-10      Emisión automática de un recibo por cada pago registrado.

  RF-11      Cálculo automático de intereses por mora según los días de atraso pactados en el contrato.
  -------------------------------------------------------------------------------------------------------

**Módulo de Firma Electrónica**

  ----------------------------------------------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- -----------------------------------------------------------------------------------------------------------------------
  RF-12      Firma electrónica del contrato dentro de la plataforma, con registro de conformidad de locador, locatario y garantes.

  ----------------------------------------------------------------------------------------------------------------------------------

**Módulo de Cierre de Contrato**

  ----------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- -----------------------------------------------------------------
  RF-13      Registro del estado de entrega del inmueble mediante checklist.

  RF-14      Generación de una constancia final de cierre de contrato.
  ----------------------------------------------------------------------------

**Módulo de Usuarios y Notificaciones**

  ---------------------------------------------------------------------------------------------
  **ID**     **Descripción**
  ---------- ----------------------------------------------------------------------------------
  RF-15      Gestión de usuarios con roles diferenciados (propietario particular, inquilino).

  RF-16      Notificaciones automáticas de vencimientos de pago y de ajustes de precio.
  ---------------------------------------------------------------------------------------------

# 7. Estudio de Prefactibilidad

## [7.1. Prefactibilidad técnica (STACK Pendiente)]{.mark}

El desarrollo se apoya en un stack tecnológico moderno y ampliamente documentado: Next.js y Node.js para la aplicación web, Supabase como base de datos y backend (autenticación, almacenamiento), y Vercel como plataforma de despliegue serverless. Los organismos oficiales (INDEC y BCRA) publican sus índices de forma pública, lo que permite automatizar la actualización de los valores de ajuste. La integración de cobros puede resolverse con una pasarela de pago existente (por ejemplo, Mercado Pago), evitando desarrollar infraestructura de procesamiento de pagos propia.

## 7.2. Prefactibilidad económica

[La arquitectura serverless propuesta (Vercel y Supabase)]{.mark} permite operar el MVP dentro de los niveles gratuitos o de bajo costo de estos servicios mientras el volumen de usuarios es reducido, lo que mantiene acotada la inversión en infraestructura durante el desarrollo académico del proyecto. La pasarela de pago no requiere costo fijo, sino una comisión por transacción procesada. El principal costo del proyecto es el esfuerzo de desarrollo, cubierto por el equipo del Seminario Integrador. Para una eventual puesta en producción comercial, el modelo de ingresos podría basarse en una comisión sobre el cobro gestionado o en una suscripción mensual para inmobiliarias, aunque ese análisis de negocio excede el alcance académico del presente informe.

## [7.3. Prefactibilidad operativa]{.mark}

Argentina presenta una adopción alta de medios de pago digitales y de uso de aplicaciones móviles, lo que favorece la aceptación del sistema por parte de inquilinos y propietarios particulares. El principal riesgo operativo es la resistencia al cambio de las inmobiliarias, acostumbradas a procesos manuales o a herramientas ya instaladas (como planillas de cálculo o software de administración existente). Se propone mitigar este riesgo con un proceso de incorporación simple, sin necesidad de conocimientos técnicos, y con un alcance piloto acotado a la ciudad de Córdoba que permita validar la adopción antes de una expansión mayor.

# 8. Metodología a Utilizar

Para las etapas de diseño y desarrollo se propone una metodología ágil basada en Scrum, que organiza el trabajo en sprints breves (dos semanas) con entregas incrementales del producto. Este enfoque permite validar tempranamente los módulos más críticos del sistema antes de avanzar con funcionalidades de menor prioridad, y ajustar el backlog del proyecto según la retroalimentación de la cátedra en cada revisión.

# 9. Roadmap del Proyecto

El siguiente diagrama presenta la planificación macro del proyecto para el cuatrimestre de cursado, distribuida en ocho etapas entre agosto y diciembre de 2026. Este roadmap es una propuesta estimativa, ya que, para determinar que funcionalidades priorizaremos durante el desarrollo de la plataforma será necesario primero completar el relevamiento y análisis de los requerimientos.

  ----------------------------------------------------------------------------------------------
  **Etapa**                                    **Ago**   **Sep**   **Oct**   **Nov**   **Dic**
  -------------------------------------------- --------- --------- --------- --------- ---------
  **1. Estudio inicial**                                                               

  **2. Relevamiento y análisis**                                                       

  **3. Diseño (arquitectura, UX/UI, datos)**                                           

  **4. Desarrollo: publicación y búsqueda**                                            

  **5. Desarrollo: ajuste y cobro**                                                    

  **6. Desarrollo: firma, mora y cierre**                                              

  **7. Pruebas e integración**                                                         

  **8. Documentación final y defensa**                                                 
  ----------------------------------------------------------------------------------------------

*Figura 2. Roadmap macro del proyecto (agosto--diciembre 2026).*

# 10. Glosario de Términos

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Término**         **Definición**
  ------------------- --------------------------------------------------------------------------------------------------------------------------------------------------
  MVP                 Producto Mínimo Viable: versión inicial de un producto con las funcionalidades mínimas necesarias para validar la propuesta de valor.

  IPC                 Índice de Precios al Consumidor, publicado por el INDEC, mide la variación de precios de bienes y servicios.

  ICL                 Índice para Contratos de Locación, publicado por el BCRA, utilizado como referencia para actualizar alquileres.

  DNU                 Decreto de Necesidad y Urgencia: norma dictada por el Poder Ejecutivo con fuerza de ley.

  Locador             Parte que cede el uso del inmueble en un contrato de alquiler (propietario).

  Locatario           Parte que recibe el uso del inmueble en un contrato de alquiler (inquilino).

  Firma electrónica   Mecanismo de firma sin certificación de un prestador homologado; requiere probar autoría si es cuestionada.

  Firma digital       Firma electrónica certificada por un prestador de servicios homologado, con presunción legal de autoría e integridad.

  Sandbox             Entorno de prueba aislado que simula el comportamiento real de un servicio (por ejemplo, una pasarela de pago) sin generar transacciones reales.

  Backlog             Lista priorizada de funcionalidades o tareas pendientes de un proyecto de software.

  Sprint              Período acotado (1 a 4 semanas) en el que se desarrolla un incremento del producto, según Scrum.

  API                 Interfaz de Programación de Aplicaciones: conjunto de reglas que permite la comunicación entre sistemas de software.
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
