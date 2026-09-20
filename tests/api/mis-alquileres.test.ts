import http from 'http';
import { app } from '../../apps/api/src/app';

let server: http.Server;
let baseUrl: string;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Test Failed: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Iniciando batería de pruebas automatizadas para RentAR...\n');

  // Iniciar servidor en puerto dinámico
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      }
    });
  });

  try {
    // -------------------------------------------------------------------------
    // Test 1: Health check del API Gateway
    // -------------------------------------------------------------------------
    console.log('➡️  Test 1: Health check y headers del API Gateway');
    const resHealth = await fetch(`${baseUrl}/api/health`);
    assert(resHealth.status === 200, 'El status de health check debe ser 200');
    assert(resHealth.headers.get('x-gateway-version') === '1.0.0', 'Debe incluir header X-Gateway-Version');
    const healthJson = await resHealth.json();
    assert(healthJson.status === 'UP', 'Health status debe ser UP');
    console.log('   ✅ API Gateway responde correctamente en /api/health\n');

    // -------------------------------------------------------------------------
    // Test 2: Inmuebles CRUD con ID generado automáticamente
    // -------------------------------------------------------------------------
    console.log('➡️  Test 2: Crear inmueble con ID autogenerado');
    const nuevoInmuebleData = {
      tipo: 1, // Departamento
      direccion: 'Av. Hipólito Yrigoyen',
      numero: 450,
      piso: '8C',
      ciudad: 'Córdoba',
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      m2: 52,
      descripcion: 'Excelente vista a la plaza',
      tags: 4, // Balcón
      id_locador: 1,
      servicios: 1 // Luz
    };

    const resCreateInmueble = await fetch(`${baseUrl}/api/v1/inmuebles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '1' // Locador
      },
      body: JSON.stringify(nuevoInmuebleData)
    });

    assert(resCreateInmueble.status === 201, `Status de creación debe ser 201, recibido ${resCreateInmueble.status}`);
    const jsonCreate = await resCreateInmueble.json();
    assert(jsonCreate.success === true, 'Respuesta exitosa');
    assert(typeof jsonCreate.data.id === 'number', 'El ID debe ser numérico');
    assert(jsonCreate.data.id > 4, `El ID debe ser autogenerado secuencialmente, obtenido: ${jsonCreate.data.id}`);
    const createdId = jsonCreate.data.id;
    console.log(`   ✅ Inmueble creado con ID autogenerado: ${createdId}`);

    // Test 2b: Obtener por ID
    const resGetById = await fetch(`${baseUrl}/api/v1/inmuebles/${createdId}`);
    assert(resGetById.status === 200, 'Status debe ser 200 al buscar por ID');
    const jsonGetById = await resGetById.json();
    assert(jsonGetById.data.direccion === 'Av. Hipólito Yrigoyen', 'La dirección debe coincidir');

    // Test 2c: Actualizar inmueble
    const resUpdate = await fetch(`${baseUrl}/api/v1/inmuebles/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '1'
      },
      body: JSON.stringify({ descripcion: 'Descripción actualizada' })
    });
    assert(resUpdate.status === 200, 'Status debe ser 200 al actualizar');
    const jsonUpdate = await resUpdate.json();
    assert(jsonUpdate.data.descripcion === 'Descripción actualizada', 'Debe actualizarse la descripción');
    console.log('   ✅ Operaciones CRUD de Inmuebles validadas con éxito\n');

    // -------------------------------------------------------------------------
    // Test 3: Regla de Negocio - Publicar SIN contrato debe fallar
    // -------------------------------------------------------------------------
    console.log('➡️  Test 3: Regla de negocio - Publicar SIN contrato previo');
    // El inmueble createdId recién creado no tiene contrato asociado
    const resPubFail = await fetch(`${baseUrl}/api/v1/publicaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '1'
      },
      body: JSON.stringify({
        id_inmueble: createdId,
        titulo: 'Publicación sin contrato',
        precio: 300000
      })
    });

    assert(resPubFail.status === 400, `Debe fallar con status 400, recibido ${resPubFail.status}`);
    const jsonPubFail = await resPubFail.json();
    assert(jsonPubFail.success === false, 'Debe ser no exitoso');
    assert(
      jsonPubFail.error.includes('No se puede publicar una propiedad sin asociarle previamente un contrato'),
      `El mensaje de error debe indicar la regla de contrato. Obtenido: ${jsonPubFail.error}`
    );
    console.log('   ✅ Rechazo correcto al intentar publicar un inmueble sin contrato asociado\n');

    // -------------------------------------------------------------------------
    // Test 4: Endpoint /api/v1/mis-alquileres para Locador
    // -------------------------------------------------------------------------
    console.log('➡️  Test 4: Visualizar "Mis Propiedades / Mis Alquileres" como Locador');
    const resMisAlquileres = await fetch(`${baseUrl}/api/v1/mis-alquileres`, {
      headers: {
        'x-user-id': '1' // Carlos Locador
      }
    });

    assert(resMisAlquileres.status === 200, `Status debe ser 200, recibido ${resMisAlquileres.status}`);
    const jsonMisAlquileres = await resMisAlquileres.json();
    assert(jsonMisAlquileres.success === true, 'Respuesta debe ser success: true');
    assert(Array.isArray(jsonMisAlquileres.data), 'data debe ser un array');

    const lista = jsonMisAlquileres.data;
    console.log(`   Propiedades encontradas para locador: ${lista.length}`);

    // Carlos tiene Inmueble 1 (disponible) e Inmueble 2 (alquilado) publicados
    // Inmueble 3 no está publicado, Inmueble 4 es de otro locador
    assert(lista.length === 2, `Carlos debe tener exactamente 2 propiedades publicadas, encontradas: ${lista.length}`);

    const propDisponible = lista.find((p: any) => p.id_inmueble === 1);
    assert(!!propDisponible, 'Debe incluir el inmueble 1');
    assert(propDisponible.estado_alquiler === 'disponible', 'Inmueble 1 debe figurar como disponible');
    assert(propDisponible.tipo_inmueble === 'Departamento', 'Tipo debe ser Departamento');
    assert(propDisponible.publicacion.activa === true, 'Publicación debe estar activa');
    assert(propDisponible.contrato.monto === 350000, 'Monto de contrato debe ser 350000');

    const propAlquilada = lista.find((p: any) => p.id_inmueble === 2);
    assert(!!propAlquilada, 'Debe incluir el inmueble 2');
    assert(propAlquilada.estado_alquiler === 'alquilado', 'Inmueble 2 debe figurar como alquilado');
    assert(propAlquilada.contrato.estado === 'vigente', 'Contrato debe estar vigente');

    console.log('   ✅ Vista "Mis Alquileres" muestra correctamente propiedades disponibles y alquiladas\n');

    // -------------------------------------------------------------------------
    // Test 5: Control de Acceso por Rol (Locatario no puede ver /mis-alquileres)
    // -------------------------------------------------------------------------
    console.log('➡️  Test 5: Control de roles en API Gateway');
    const resForbidden = await fetch(`${baseUrl}/api/v1/mis-alquileres`, {
      headers: {
        'x-user-id': '2' // Ana Inquilina (rol locatario)
      }
    });

    assert(resForbidden.status === 403, `Debe retornar 403 Forbidden para inquilinos, recibido ${resForbidden.status}`);
    const jsonForbidden = await resForbidden.json();
    assert(jsonForbidden.error.includes("Se requiere el rol 'locador'"), 'Error debe requerir rol locador');
    console.log('   ✅ El API Gateway bloquea adecuadamente a usuarios sin rol de locador\n');

    console.log('🎉 ¡Todas las pruebas han pasado exitosamente! Todo el backend funciona al 100%.\n');
  } catch (err) {
    console.error('💥 Fallo en las pruebas:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
