import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASSWORD 
        }
    });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenid@</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 0;
                    border-radius: 15px;
                    box-shadow: 0 0 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 3em;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
                .header .subtitle {
                    font-size: 1.3em;
                    margin-top: 10px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .welcome-message {
                    font-size: 1.1em;
                    color: #555;
                    margin-bottom: 30px;
                    text-align: center;
                }
                .highlight {
                    color: #667eea;
                    font-weight: bold;
                }
                .description-section {
                    background-color: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                    border-left: 5px solid #667eea;
                }
                .warning-section {
                    background-color: #fff3cd;
                    border: 2px solid #ffc107;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 25px 0;
                }
                .warning-title {
                    color: #856404;
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }
                .warning-title::before {
                    content: "⚠️";
                    margin-right: 10px;
                    font-size: 1.3em;
                }
                .features {
                    background-color: #e8f4fd;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                }
                .features h3 {
                    color: #0366d6;
                    margin-top: 0;
                    font-size: 1.3em;
                }
                .features ul {
                    list-style-type: none;
                    padding: 0;
                }
                .features li {
                    padding: 10px 0;
                    border-bottom: 1px solid #d1ecf1;
                    position: relative;
                    padding-left: 30px;
                }
                .features li:last-child {
                    border-bottom: none;
                }
                .features li::before {
                    content: "✓";
                    color: #28a745;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 10px;
                    font-size: 1.1em;
                }
                .contact-section {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                    text-align: center;
                }
                .contact-email {
                    background-color: rgba(255,255,255,0.2);
                    padding: 10px 15px;
                    border-radius: 25px;
                    display: inline-block;
                    margin-top: 10px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    padding: 30px;
                    color: #666;
                    background-color: #f8f9fa;
                    border-top: 1px solid #eee;
                }
                .footer p {
                    margin: 5px 0;
                }
                .anonymous-badge {
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 25px;
                    display: inline-block;
                    margin: 15px 0;
                    font-weight: bold;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Bienvenid@</h1>
                    <p class="subtitle">¡Has llegado a BLFAGS!</p>
                </div>
                
                <div class="content">
                    <div class="welcome-message">
                        <h2>¡Hola <span class="highlight">${userName}</span>!</h2>
                        <p>Te damos la más cordial bienvenida a <strong>BLFAGS</strong>. Tu cuenta ha sido creada exitosamente.</p>
                    </div>

                    <div class="description-section">
                        <h3>📝 ¿Qué es BLFAGS?</h3>
                        <p>Este es un blog con fines de uso personal del autor. Además, es un blog con fines anónimos en el cual puedes hacer uso de crear publicaciones donde solo se mostrará tu <strong>username</strong> y <strong>foto de perfil</strong>.</p>
                        
                        <div class="anonymous-badge">
                            🔒 Privacidad Total: Nadie puede ingresar a tu perfil o saber tu verdadero nombre
                        </div>
                        
                        <p>Los comentarios también son completamente anónimos, brindándote la libertad de expresarte sin restricciones de identidad.</p>
                    </div>

                    <div class="warning-section">
                        <div class="warning-title">¡Advertencia!</div>
                        <p>No hay algún tipo de prohibiciones tanto para las publicaciones como comentarios, pero sé consciente de que hay personas sensibles, así que no hagas mal uso de este blog.</p>
                        <p><strong>Puedes publicar tanto de forma pública como guardar publicaciones para poder verlas solo tú como una galería personal en una página web.</strong></p>
                    </div>

                    <div class="features">
                        <h3>🚀 Ahora que te has registrado, puedes realizar las siguientes acciones:</h3>
                        <ul>
                            <li><strong>Crear publicaciones</strong> con título, descripción y archivos multimedia (imágenes, videos, GIFs)</li>
                            <li><strong>Configurar visibilidad</strong> de tus publicaciones como públicas o privadas</li>
                            <li><strong>Comentar</strong> en publicaciones de otros usuarios de forma anónima</li>
                            <li><strong>Reaccionar</strong> a publicaciones con diferentes tipos de reacciones (like, love, laugh, sad, angry)</li>
                            <li><strong>Usar hashtags</strong> para categorizar y hacer más descubrible tu contenido</li>
                            <li><strong>Explorar publicaciones</strong> públicas de la comunidad</li>
                            <li><strong>Personalizar tu perfil</strong> con foto de perfil y información básica</li>
                            <li><strong>Actualizar tu información</strong> personal y cambiar tu contraseña cuando lo desees</li>
                            <li><strong>Gestionar tus publicaciones</strong> (editar, eliminar, cambiar visibilidad)</li>
                            <li><strong>Mantener una galería privada</strong> de tus publicaciones personales</li>
                        </ul>
                    </div>

                    <div class="contact-section">
                        <h3>🤝 ¡Tu opinión es valiosa!</h3>
                        <p>Ayúdame a mejorar dándome tu opinión y diciéndome qué aspectos puedo mejorar de esta página web o qué puedo agregar.</p>
                        <p>Para cualquier duda o apoyo, puedes comunicarte al correo:</p>
                        <div class="contact-email">alexander.garcia.sicajau@gmail.com</div>
                    </div>

                    <p style="text-align: center; font-size: 1.1em; color: #555;">
                        Tu cuenta ha sido registrada con el email: <strong class="highlight">${userEmail}</strong>
                    </p>
                    
                    <p style="text-align: center; color: #666; margin-top: 30px;">
                        <em>¡Disfruta de la experiencia y comienza a crear contenido increíble!</em>
                    </p>
                </div>

                <div class="footer">
                    <p><strong>¡Gracias por unirte a nuestra comunidad!</strong></p>
                    <p><small>Este es un mensaje automático, por favor no respondas a este email.</small></p>
                    <p><small>&copy; 2025 BLFAGS. Todos los derechos reservados.</small></p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Bienvenid@ a BLFAGS - Tu cuenta ha sido creada exitosamente',
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', result.messageId);
        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('Error enviando email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const sendCustomEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email personalizado enviado:', result.messageId);
        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('Error enviando email personalizado:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const sendAdminNotification = async (userEmail, userName, userPassword) => {
    try {
        const transporter = createTransporter();
        const currentDate = new Date().toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Usuario Registrado - BLFAGS</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 0;
                    border-radius: 15px;
                    box-shadow: 0 0 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2.2em;
                    font-weight: bold;
                }
                .header .subtitle {
                    font-size: 1.1em;
                    margin-top: 10px;
                    opacity: 0.9;
                }
                .content {
                    padding: 30px;
                }
                .notification-badge {
                    background: linear-gradient(45deg, #007bff, #0056b3);
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    margin-bottom: 25px;
                    font-weight: bold;
                    font-size: 1.1em;
                }
                .user-details {
                    background-color: #f8f9fa;
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 20px 0;
                }
                .user-details h3 {
                    color: #495057;
                    margin-top: 0;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 10px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-row:last-child {
                    border-bottom: none;
                }
                .detail-label {
                    font-weight: bold;
                    color: #495057;
                    flex: 1;
                }
                .detail-value {
                    flex: 2;
                    text-align: right;
                    color: #007bff;
                    font-weight: 500;
                }
                .password-warning {
                    background-color: #fff3cd;
                    border: 2px solid #ffc107;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                }
                .password-warning strong {
                    color: #856404;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    background-color: #f8f9fa;
                    border-top: 1px solid #eee;
                }
                .timestamp {
                    background-color: #e7f3ff;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #0366d6;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Nuevo Usuario Registrado</h1>
                    <p class="subtitle">Notificación de registro en BLFAGS</p>
                </div>
                
                <div class="content">
                    <div class="timestamp">
                        📅 Fecha de registro: ${currentDate}
                    </div>

                    <div class="notification-badge">
                        Se ha registrado un nuevo usuario en la plataforma BLFAGS
                    </div>

                    <div class="user-details">
                        <h3>📋 Detalles del Usuario</h3>
                        
                        <div class="detail-row">
                            <span class="detail-label">👤 Username:</span>
                            <span class="detail-value">${userName}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📧 Email:</span>
                            <span class="detail-value">${userEmail}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">🔑 Contraseña:</span>
                            <span class="detail-value">${userPassword}</span>
                        </div>
                    </div>

                    <div class="password-warning">
                        <strong>⚠️ Importante:</strong> Esta contraseña se muestra antes del proceso de encriptación. 
                        En la base de datos se almacena de forma segura y encriptada.
                    </div>

                    <p style="text-align: center; color: #666; margin-top: 30px;">
                        <em>Este es un email automático de notificación para el administrador de BLFAGS.</em>
                    </p>
                </div>

                <div class="footer">
                    <p><strong>Sistema de Notificaciones BLFAGS</strong></p>
                    <p><small>&copy; 2025 BLFAGS. Notificación automática del sistema.</small></p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: `🎉 Nuevo Usuario Registrado: ${userName} - BLFAGS`,
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Notificación de administrador enviada exitosamente:', result.messageId);
        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('Error enviando notificación de administrador:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const sendPasswordUpdateNotification = async (userEmail, userName, newPassword) => {
    try {
        const transporter = createTransporter();
        const currentDate = new Date().toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contraseña Actualizada - BLFAGS</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 0;
                    border-radius: 15px;
                    box-shadow: 0 0 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2.2em;
                    font-weight: bold;
                }
                .header .subtitle {
                    font-size: 1.1em;
                    margin-top: 10px;
                    opacity: 0.9;
                }
                .content {
                    padding: 30px;
                }
                .notification-badge {
                    background: linear-gradient(45deg, #ffa726, #ff7043);
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    margin-bottom: 25px;
                    font-weight: bold;
                    font-size: 1.1em;
                }
                .user-details {
                    background-color: #f8f9fa;
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 20px 0;
                }
                .user-details h3 {
                    color: #495057;
                    margin-top: 0;
                    border-bottom: 2px solid #ff6b6b;
                    padding-bottom: 10px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .detail-row:last-child {
                    border-bottom: none;
                }
                .detail-label {
                    font-weight: bold;
                    color: #495057;
                    flex: 1;
                }
                .detail-value {
                    flex: 2;
                    text-align: right;
                    color: #ff6b6b;
                    font-weight: 500;
                }
                .password-warning {
                    background-color: #fff3cd;
                    border: 2px solid #ffc107;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                }
                .password-warning strong {
                    color: #856404;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    background-color: #f8f9fa;
                    border-top: 1px solid #eee;
                }
                .timestamp {
                    background-color: #ffebee;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #c62828;
                    font-weight: bold;
                }
                .security-icon {
                    font-size: 1.5em;
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1><span class="security-icon">🔐</span>Contraseña Actualizada</h1>
                    <p class="subtitle">Notificación de cambio de contraseña en BLFAGS</p>
                </div>
                
                <div class="content">
                    <div class="timestamp">
                        📅 Fecha de actualización: ${currentDate}
                    </div>

                    <div class="notification-badge">
                        Un usuario ha actualizado su contraseña en la plataforma BLFAGS
                    </div>

                    <div class="user-details">
                        <h3>📋 Detalles del Usuario</h3>
                        
                        <div class="detail-row">
                            <span class="detail-label">👤 Username:</span>
                            <span class="detail-value">${userName}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📧 Email:</span>
                            <span class="detail-value">${userEmail}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">🔑 Nueva Contraseña:</span>
                            <span class="detail-value">${newPassword}</span>
                        </div>
                    </div>

                    <div class="password-warning">
                        <strong>⚠️ Importante:</strong> Esta contraseña se muestra antes del proceso de encriptación. 
                        En la base de datos se almacena de forma segura y encriptada.
                    </div>

                    <p style="text-align: center; color: #666; margin-top: 30px;">
                        <em>Este es un email automático de notificación para el administrador de BLFAGS.</em>
                    </p>
                </div>

                <div class="footer">
                    <p><strong>Sistema de Notificaciones BLFAGS</strong></p>
                    <p><small>&copy; 2025 BLFAGS. Notificación automática del sistema.</small></p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: `🔐 Contraseña Actualizada: ${userName} - BLFAGS`,
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Notificación de actualización de contraseña enviada exitosamente:', result.messageId);
        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('Error enviando notificación de actualización de contraseña:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
