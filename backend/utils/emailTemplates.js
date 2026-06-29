export const confirmationTemplate = (reservation) => `
  <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #0F0F0F; color: #F8F4E9; padding: 40px; border: 1px solid #D4AF37; max-width: 600px; margin: auto;">
    <h1 style="color: #D4AF37; text-align: center; letter-spacing: 4px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 20px;">AURUM</h1>
    <p style="text-align: center; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: rgba(248, 244, 233, 0.6);">Reservation Confirmed</p>
    
    <div style="margin: 40px 0; font-size: 16px; line-height: 1.8;">
      <p>Dear <strong>${reservation.name}</strong>,</p>
      <p>We are delighted to confirm your dining residency at Aurum. Your table has been reserved and our culinary team is preparing for your arrival.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
        <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
          <td style="padding: 10px 0; color: #D4AF37; font-weight: bold; width: 40%;">Reservation ID:</td>
          <td style="padding: 10px 0;">#${reservation._id.toString().slice(-6).toUpperCase()}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
          <td style="padding: 10px 0; color: #D4AF37; font-weight: bold;">Dining Date:</td>
          <td style="padding: 10px 0;">${reservation.date}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
          <td style="padding: 10px 0; color: #D4AF37; font-weight: bold;">Preferred Time:</td>
          <td style="padding: 10px 0;">${reservation.time}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
          <td style="padding: 10px 0; color: #D4AF37; font-weight: bold;">Number of Guests:</td>
          <td style="padding: 10px 0;">${reservation.guests} Guests</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.1);">
          <td style="padding: 10px 0; color: #D4AF37; font-weight: bold;">Occasion Context:</td>
          <td style="padding: 10px 0;">${reservation.occasion}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 12px; text-align: center; color: rgba(248, 244, 233, 0.5); border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; font-style: italic;">
      "Dining is not just eating. It is an experience."
    </p>
    <p style="font-size: 10px; text-align: center; color: rgba(248, 244, 233, 0.3); margin-top: 10px;">
      12 Gold Sovereign Way, Mayfair, London | +44 20 7946 0199
    </p>
  </div>
`;

export const rejectionTemplate = (reservation) => `
  <div style="font-family: 'Playfair Display', Georgia, serif; background-color: #0F0F0F; color: #F8F4E9; padding: 40px; border: 1px solid #D4AF37; max-width: 600px; margin: auto;">
    <h1 style="color: #D4AF37; text-align: center; letter-spacing: 4px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 20px;">AURUM</h1>
    <p style="text-align: center; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: rgba(248, 244, 233, 0.6);">Reservation Update</p>
    
    <div style="margin: 40px 0; font-size: 16px; line-height: 1.8;">
      <p>Dear <strong>${reservation.name}</strong>,</p>
      <p>Thank you for your interest in dining with us at Aurum.</p>
      <p>We regret to inform you that we are unable to accommodate your reservation request for <strong>${reservation.date}</strong> at <strong>${reservation.time}</strong> due to reaching full capacity for that evening.</p>
      <p>We apologize for any inconvenience this may cause and sincerely hope to have the opportunity to welcome you on another occasion.</p>
    </div>

    <p style="font-size: 12px; text-align: center; color: rgba(248, 244, 233, 0.5); border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; font-style: italic;">
      "Dining is not just eating. It is an experience."
    </p>
    <p style="font-size: 10px; text-align: center; color: rgba(248, 244, 233, 0.3); margin-top: 10px;">
      12 Gold Sovereign Way, Mayfair, London | +44 20 7946 0199
    </p>
  </div>
`;
