import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (template: EmailTemplate): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Multi Electric Supply" <${process.env.EMAIL_USER}>`,
      ...template,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const generateOrderConfirmationEmail = (order: any): EmailTemplate => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return {
    to: order.customer.email,
    subject: `Confirmación de Pedido - ${order.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1>Multi Electric Supply</h1>
          <h2>Confirmación de Pedido</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a ${order.customer.name},</p>
          
          <p>Gracias por su pedido. Hemos recibido su pago y estamos preparando sus productos.</p>
          
          <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${order.orderNumber}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Código de Recogida:</strong> <span style="font-size: 18px; font-weight: bold; color: #0ea5e9;">${order.pickup.code}</span></p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Producto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Cantidad</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Precio</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f8f9fa; font-weight: bold;">
                <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
                <td style="padding: 10px; text-align: right; border-top: 2px solid #dee2e6;">$${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #0ea5e9;">
            <h4>Próximos Pasos:</h4>
            <ol>
              <li>Recibirá una notificación cuando su pedido esté listo para recoger</li>
              <li>Venga a nuestra tienda con su código de recogida: <strong>${order.pickup.code}</strong></li>
              <li>Presente una identificación válida</li>
            </ol>
          </div>
          
          <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
          
          <p>Saludos cordiales,<br>
          El equipo de Multi Electric Supply</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>Multi Electric Supply - Suministros Eléctricos Profesionales</p>
        </div>
      </div>
    `,
    text: `
      Confirmación de Pedido - ${order.orderNumber}
      
      Estimado/a ${order.customer.name},
      
      Gracias por su pedido. Hemos recibido su pago y estamos preparando sus productos.
      
      Número de Pedido: ${order.orderNumber}
      Código de Recogida: ${order.pickup.code}
      Total: $${order.total.toFixed(2)}
      
      Recibirá una notificación cuando su pedido esté listo para recoger.
      
      Saludos cordiales,
      Multi Electric Supply
    `
  };
};

export const generatePickupReadyEmail = (order: any): EmailTemplate => {
  return {
    to: order.customer.email,
    subject: `Pedido Listo para Recoger - ${order.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Multi Electric Supply</h1>
          <h2>¡Su Pedido Está Listo!</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a ${order.customer.name},</p>
          
          <p>¡Excelentes noticias! Su pedido está listo para recoger.</p>
          
          <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #16a34a; text-align: center;">
            <h3 style="color: #16a34a; margin-top: 0;">Código de Recogida</h3>
            <div style="font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 3px;">
              ${order.pickup.code}
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4>Información del Pedido:</h4>
            <p><strong>Número de Pedido:</strong> ${order.orderNumber}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h4>Para Recoger su Pedido:</h4>
            <ol>
              <li>Venga a nuestra tienda durante horario de atención</li>
              <li>Presente este código: <strong>${order.pickup.code}</strong></li>
              <li>Traiga una identificación válida</li>
            </ol>
          </div>
          
          <p>Gracias por elegir Multi Electric Supply.</p>
          
          <p>Saludos cordiales,<br>
          El equipo de Multi Electric Supply</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>Multi Electric Supply - Suministros Eléctricos Profesionales</p>
        </div>
      </div>
    `,
    text: `
      ¡Su Pedido Está Listo! - ${order.orderNumber}
      
      Estimado/a ${order.customer.name},
      
      Su pedido está listo para recoger.
      
      Código de Recogida: ${order.pickup.code}
      Número de Pedido: ${order.orderNumber}
      
      Para recoger:
      1. Venga a nuestra tienda
      2. Presente el código: ${order.pickup.code}
      3. Traiga identificación válida
      
      Saludos cordiales,
      Multi Electric Supply
    `
  };
};
