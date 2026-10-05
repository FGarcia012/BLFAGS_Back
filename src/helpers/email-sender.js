import nodemailer from 'nodemailer';
export const escapeHtml = value => String(value).replace(/[&<>"']/g,char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export async function sendWelcomeEmail(to,username) {
 if (process.env.NODE_ENV === 'test') return {success:true};
 try {
  const transport = nodemailer.createTransport({service:'gmail',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD},disableFileAccess:true,disableUrlAccess:true});
  await transport.sendMail({from:process.env.EMAIL_USER,to,subject:'Bienvenido a BLFAGS',text:`Hola ${username}. No pedimos tu nombre. Guardamos tu correo para iniciar sesión y enviarte esta bienvenida. Publicas con tu alias.`,html:`<p>Hola ${escapeHtml(username)}.</p><p>No pedimos tu nombre. Guardamos tu correo para iniciar sesión y enviarte esta bienvenida. Publicas con tu alias; tu correo no se muestra a otros usuarios.</p>`});
  return {success:true};
 } catch { console.warn('No se pudo enviar una bienvenida'); return {success:false}; }
}
