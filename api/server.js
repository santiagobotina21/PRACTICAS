const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const PDFDocument = require('pdfkit');
const fs = require('fs');

// Configuración de Multer
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const app = express();
const port = 3000;

const pool = new Pool({
  user: 'santiago',
  host: 'localhost',
  database: 'practica',
  password: 'santiago21',
  port: 5432,
  ssl: false
});

app.use(bodyParser.json());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});




// Maneja la solicitud GET para obtener todas las empresas
app.get('/llamar', async (req, res) => {
  try {
    const query = `
      SELECT 
        empresas.id,
        empresas.nombre_empresa,
        empresas.nit_empresa,
        empresas.telefono_empresa,
        empresas.celular_empresa,
        empresas.correo_empresa,
        empresas.tipo_empresa,
        empresas.direccion_empresa,
        paises.nombre AS pais_empresa,
        municipios.nombre AS municipio_empresa,
        empresas.nombre_encargado,
        empresas.celular_encargado,
        empresas.correo_encargado,
        empresas.estado_id,
        estados.estado_convenio AS estado_convenio,
        estados.nombre AS estado
        
      FROM empresas
      INNER JOIN paises ON empresas.pais_empresa = paises.id
      LEFT JOIN municipios ON empresas.municipio_empresa = municipios.id
      LEFT JOIN estados ON empresas.estado_id = estados.id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

app.delete('/eliminar-empresa/:id', async (req, res) => {
  const empresaId = req.params.id;

  try {
    await pool.query('BEGIN');  // Comienza una transacción

    // Elimina los registros relacionados en la tabla pdfs_empresas
    const deletePdfsQuery = 'DELETE FROM pdfs_empresas WHERE empresa_id = $1';
    await pool.query(deletePdfsQuery, [empresaId]);

    const deleteDocJaQuery = 'DELETE FROM convenios_dep_juridico WHERE empresa_id = $1';
    await pool.query(deleteDocJaQuery, [empresaId]);

    const deleteDocCQuery = 'DELETE FROM convenios_consolidados WHERE empresa_id = $1';
    await pool.query(deleteDocCQuery, [empresaId]);

    // Elimina la empresa principal de la tabla empresas
    const deleteEmpresaQuery = 'DELETE FROM empresas WHERE id = $1';
    await pool.query(deleteEmpresaQuery, [empresaId]);

    await pool.query('COMMIT');  // Confirma la transacción

    // Envía una respuesta de éxito
    res.status(200).json({ message: 'Empresa eliminada con éxito' });
  } catch (error) {
    await pool.query('ROLLBACK');  // En caso de error, revierte la transacción
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ error: 'Error al eliminar empresa' });
  }
});


app.put('/cambiar-estado/:id/:nuevoEstado', async (req, res) => {
  const empresaId = req.params.id;
  const nuevoEstado = req.params.nuevoEstado; // El nuevo estado se pasa como parámetro

  try {
    // Ejecuta una consulta SQL para cambiar el estado de la empresa con el ID proporcionado
    const query = 'UPDATE empresas SET estado_id = $1 WHERE id = $2';
    await pool.query(query, [nuevoEstado, empresaId]);

    // Envía una respuesta de éxito
    res.status(200).json({ message: 'Estado de la empresa cambiado con éxito' });
  } catch (error) {
    console.error('Error al cambiar el estado de la empresa:', error);
    res.status(500).json({ error: 'Error al cambiar el estado de la empresa' });
  }
});

app.get('/documentos-por-empresa/:empresaId', async (req, res) => {
  try {
    const empresaId = req.params.empresaId; // Obtén el ID de la empresa de los parámetros de la URL

    const query = `
      SELECT pe.id, pe.documento_id, pe.empresa_id, d.nombre AS nombre_documento
      FROM pdfs_empresas AS pe
      INNER JOIN documentos AS d ON pe.documento_id = d.id
      WHERE pe.empresa_id = $1
    `;

    const result = await pool.query(query, [empresaId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener documentos por empresa:', error);
    res.status(500).json({ error: 'Error al obtener documentos por empresa' });
  }
});


const tmp = require('tmp'); // Instala la biblioteca 'tmp' si aún no lo has hecho




app.get('/get-pdf/:id', async (req, res) => {
  try {
    const documentoId = req.params.id;

    // Realiza una consulta SQL para obtener el contenido bytea del archivo PDF
    const query = `
      SELECT contenido
      FROM pdfs_empresas
      WHERE id = $1
    `;

    const result = await pool.query(query, [documentoId]);
    const contenidoBytea = result.rows[0].contenido;

    // Guarda el contenido bytea en un archivo temporal (temp.pdf)
    const fs = require('fs');
    fs.writeFileSync('temp.pdf', contenidoBytea);

    // Envía el contenido bytea al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.send(contenidoBytea);
  } catch (error) {
    console.error('Error al obtener documento PDF:', error);
    res.status(500).json({ error: 'Error al obtener documento PDF' });
  }
});


app.post('/cargar-pdf', upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
    }

    const documento = req.file.buffer; // Contenido del archivo PDF en formato bytea
    const peso = req.file.size; // Peso del archivo en bytes

    const empresaId = req.body.empresaId; // Asegúrate de enviar el ID de la empresa desde tu cliente
    // const fecha = new Date();

    // Guardar el archivo en la base de datos, incluyendo la fecha y el peso usando NOW()
    const insertQuery = 'INSERT INTO convenios_dep_juridico (nombre, contenido, peso, empresa_id, fecha) VALUES ($1, $2, $3, $4, now())';
    const values = [req.file.originalname, documento, peso, empresaId];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error('Error al insertar el archivo en la base de datos:', error);
        return res.status(500).json({ error: 'Error al guardar el archivo en la base de datos.' });
      }

      return res.status(200).json({ message: 'Archivo guardado con éxito en la base de datos.' });
    });
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    res.status(500).json({ error: 'Error al cargar el archivo.' });
  }
});


app.get('/get-pdfr/:id', async (req, res) => {
  try {
    const documentoId = req.params.id;

    // Realiza una consulta SQL para obtener el contenido bytea del archivo PDF
    const query = `
      SELECT contenido
      FROM convenios_dep_juridico
      WHERE empresa_id = $1
    `;

    const result = await pool.query(query, [documentoId]);
    const contenidoBytea = result.rows[0].contenido;

    // Guarda el contenido bytea en un archivo temporal (temp.pdf)
    const fs = require('fs');
    fs.writeFileSync('temp2.pdf', contenidoBytea);

    console.log(documentoId);

    // Envía el contenido bytea al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.send(contenidoBytea);
  } catch (error) {
    console.error('Error al obtener documento PDF:', error);
    res.status(500).json({ error: 'Error al obtener documento PDF' });
  }
});



app.post('/cargar-pdfc', upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
    }

    const documento = req.file.buffer; // Contenido del archivo PDF en formato bytea
    const peso = req.file.size; // Peso del archivo en bytes

    const empresaId = req.body.empresaId; // Asegúrate de enviar el ID de la empresa desde tu cliente
    // const fecha = new Date();

    // Guardar el archivo en la base de datos, incluyendo la fecha y el peso usando NOW()
    const insertQuery = 'INSERT INTO convenios_consolidados (nombre, contenido, peso, empresa_id, fecha) VALUES ($1, $2, $3, $4, now())';
    const values = [req.file.originalname, documento, peso, empresaId];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error('Error al insertar el archivo en la base de datos:', error);
        return res.status(500).json({ error: 'Error al guardar el archivo en la base de datos.' });
      }

      return res.status(200).json({ message: 'Archivo guardado con éxito en la base de datos.' });
    });
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    res.status(500).json({ error: 'Error al cargar el archivo.' });
  }
});

app.get('/convenios/:empresaId', (req, res) => {
  const empresaId = req.params.empresaId;

  const query = {
    text: 'SELECT nombre, peso, empresa_id FROM convenios_consolidados WHERE empresa_id = $1 ORDER BY fecha DESC LIMIT 1',
    values: [empresaId],
  };

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error al obtener el documento más reciente:', error);
      return res.status(500).json({ error: 'Error al obtener el documento más reciente.' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron documentos para la empresa especificada.' });
    }

    const documentoReciente = result.rows[0];
    res.status(200).json(documentoReciente);
  });
});

app.get('/get-pdfc/:id', async (req, res) => {
  try {
    const documentoId = req.params.id;

    // Realiza una consulta SQL para obtener el contenido bytea del archivo PDF
    const query = `
      SELECT contenido
      FROM convenios_consolidados
      WHERE empresa_id = $1
    `;

    const result = await pool.query(query, [documentoId]);
    const contenidoBytea = result.rows[0].contenido;

    // Guarda el contenido bytea en un archivo temporal (temp.pdf)
    const fs = require('fs');
    fs.writeFileSync('temp2.pdf', contenidoBytea);

    console.log(documentoId);

    // Envía el contenido bytea al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.send(contenidoBytea);
  } catch (error) {
    console.error('Error al obtener documento PDF:', error);
    res.status(500).json({ error: 'Error al obtener documento PDF' });
  }
});


// -------------------------------------------------------

app.post('/insertar', async (req, res) => {
  const formData = req.body;

  try {
    const client = await pool.connect();

    const queryConvenio = `
        INSERT INTO "empresas" (  
          "fecha_creacion", "nombre_empresa", "telefono_empresa", "direccion_empresa",
          "pais_empresa", "departamento_empresa", "nombre_representante", "nit_empresa",
          "celular_empresa", "correo_empresa", "municipio_empresa", "tipo_empresa",
          "cedula_representante", "nombre_encargado", "correo_encargado", "celular_encargado", "estado_id"
        )
        VALUES (
          NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
        RETURNING id;`; // Agregamos "RETURNING id" para obtener el ID generado

    const valuesConvenio = [
      formData.nombreEmpresa, formData.telefonoFijo, formData.direccion, formData.pais,
      formData.departamento, formData.nombreRepresentante, formData.nit, formData.telefonoCelular,
      formData.correoElectronico, formData.municipio, formData.tipoEmpresa, formData.cedulaRepresentante,
      formData.nombreEncargado, formData.correoElectronicoEncargado, formData.celularEncargado, '1'
    ];

    const result = await client.query(queryConvenio, valuesConvenio);
    const nuevoID = result.rows[0].id; // Obtenemos el ID generado

    res.status(201).json({ message: 'Registro insertado correctamente.', nuevoID });
  } catch (error) {
    console.error('Error al insertar el registro:', error);
    res.status(500).json({ error: 'Error al insertar el registro.' });
  }
});


app.get('/paises', (req, res) => {
  const query = 'SELECT * FROM paises';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al obtener la lista de países' });
      return;
    }
    const paises = results.rows;



    res.json(paises);
  });
});

app.get('/departamentos/:paisId', (req, res) => {
  const paisId = req.params.paisId;
  const query = 'SELECT * FROM departamentos WHERE id_pais = $1'; // Ajusta la consulta según tu estructura de base de datos

  pool.query(query, [paisId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de departamentos:', error);
      res.status(500).json({ error: 'Error al obtener la lista de departamentos' });
      return;
    }
    const departamentos = results.rows;
    res.json(departamentos);
  });
});

app.get('/municipios/:departamentoId', (req, res) => {
  const departamentoId = req.params.departamentoId;
  const query = 'SELECT * FROM municipios WHERE id_departamento = $1'; // Ajusta la consulta según tu estructura de base de datos

  pool.query(query, [departamentoId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de municipios:', error);
      res.status(500).json({ error: 'Error al obtener la lista de municipios' });
      return;
    }
    const municipios = results.rows;
    res.json(municipios);
  });
});




app.post('/subir-pdfs', upload.fields([{ name: 'pdf1' }, { name: 'pdf2' }, { name: 'pdf3' }, { name: 'pdf4' }, { name: 'pdf5' }, { name: 'pdf6' }, { name: 'pdf7' }, { name: 'pdf8' }, { name: 'pdf9' }]), async (req, res) => {
  try {
    const empresa_id = req.body.nuevoID; // Recupera el ID del formulario 1 desde el cuerpo de la solicitud

    if (req.files && req.files.pdf1) {
      const archivosPDF1 = req.files.pdf1;
      for (let i = 0; i < archivosPDF1.length; i++) {
        const archivo = archivosPDF1[i];
        // const fecha = new Date();
        // Inserta el archivo PDF1 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '1'];
        await pool.query(query, values);
      }
    }

    if (req.files && req.files.pdf2) {
      const archivosPDF2 = req.files.pdf2;
      for (let i = 0; i < archivosPDF2.length; i++) {
        const archivo = archivosPDF2[i];
        const fecha = new Date();
        // Inserta el archivo PDF2 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '2'];
        await pool.query(query, values);
      }
    }
    if (req.files && req.files.pdf3) {
      const archivosPDF3 = req.files.pdf3;
      for (let i = 0; i < archivosPDF3.length; i++) {
        const archivo = archivosPDF3[i];
        // const fecha = new Date();
        // Inserta el archivo PDF3 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '3'];
        await pool.query(query, values);
      }
    }

    if (req.files && req.files.pdf4) {
      const archivosPDF4 = req.files.pdf4;
      for (let i = 0; i < archivosPDF4.length; i++) {
        const archivo = archivosPDF4[i];
        // const fecha = new Date();
        // Inserta el archivo PDF4 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '4'];
        await pool.query(query, values);
      }
    }

    if (req.files && req.files.pdf5) {
      const archivosPDF5 = req.files.pdf5;
      for (let i = 0; i < archivosPDF5.length; i++) {
        const archivo = archivosPDF5[i];
        // const fecha = new Date();
        // Inserta el archivo PDF5 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '5'];
        await pool.query(query, values);
      }
    }

    if (req.files && req.files.pdf6) {
      const archivosPDF6 = req.files.pdf6;
      for (let i = 0; i < archivosPDF6.length; i++) {
        const archivo = archivosPDF6[i];
        // const fecha = new Date();
        // Inserta el archivo PDF5 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '6'];
        await pool.query(query, values);
      }
    }

    if (req.files && req.files.pdf7) {
      const archivosPDF7 = req.files.pdf7;
      for (let i = 0; i < archivosPDF7.length; i++) {
        const archivo = archivosPDF7[i];
        // const fecha = new Date();
        // Inserta el archivo PDF5 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '7'];
      }
    }


    if (req.files && req.files.pdf8) {
      const archivosPDF8 = req.files.pdf8;
      for (let i = 0; i < archivosPDF8.length; i++) {
        const archivo = archivosPDF8[i];
        // const fecha = new Date();
        // Inserta el archivo PDF5 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '8'];
        await pool.query(query, values);
      }
    }


    if (req.files && req.files.pdf9) {
      const archivosPDF9 = req.files.pdf9;
      for (let i = 0; i < archivosPDF9.length; i++) {
        const archivo = archivosPDF9[i];
        // const fecha = new Date();
        // Inserta el archivo PDF5 en la base de datos junto con el ID del formulario 1
        const query = 'INSERT INTO pdfs_empresas ( nombre, contenido, peso, fecha, empresa_id, documento_id) VALUES ( $1, $2, $3, NOW(), $4, $5)';
        const values = [archivo.originalname, archivo.buffer, archivo.size, empresa_id, '9'];
        await pool.query(query, values);
      }
    }

    res.status(201).json({ message: 'Archivos PDF subidos correctamente.' });
  } catch (error) {
    console.error('Error al subir archivos PDF:', error);
    res.status(500).json({ error: 'Error al subir archivos PDF.' });
  }
});



const transporter = nodemailer.createTransport({
  service: 'Gmail', // Cambia esto al servicio de correo que deseas usar
  auth: {
    user: 'correo@unicesmag.edu.co', // Cambia esto a tu dirección de correo
    pass: '****' // Cambia esto a tu contraseña de correo
  }
});

// Ruta para manejar las solicitudes POST para enviar correos
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  // Configura los detalles del correo
  const mailOptions = {
    from: 'correo@unicesmag.edu.co',
    to: to, 
    subject: subject,
    text: text
  };

  // Envía el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    } else {
      res.status(200).json({ success: true, message: 'Correo enviado exitosamente' });
    }
  });
});










